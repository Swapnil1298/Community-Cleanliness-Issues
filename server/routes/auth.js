import { Router } from 'express';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { toAuthUser } from '../utils/formatUser.js';
import { protect } from '../middleware/auth.js';
import { profileImageUpload } from '../middleware/upload.js';
import { saveUploadedFile } from '../utils/fileStorage.js';

const router = Router();

const sendAuthResponse = (user, res, statusCode = 200) => {
  const token = generateToken(user._id.toString());
  res.status(statusCode).json({
    token,
    user: toAuthUser(user),
  });
};

router.post('/register', (req, res, next) => {
  profileImageUpload.single('profileImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const storedProfileImage = await saveUploadedFile(req.file, 'profiles');
    const photoURL = storedProfileImage.url;

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      displayName: displayName || '',
      photoURL,
      lastSignInTime: new Date(),
    });

    sendAuthResponse(user, res, 201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastSignInTime = new Date();
    await user.save();

    sendAuthResponse(user, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }
    if (!googleClientId) {
      return res.status(503).json({ message: 'Google sign-in is not configured on the server' });
    }

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: 'Unable to read Google account email' });
    }

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
    });

    if (user) {
      user.googleId = payload.sub;
      user.displayName = user.displayName || payload.name || '';
      user.photoURL = user.photoURL || payload.picture || '';
      user.emailVerified = payload.email_verified ?? user.emailVerified;
      user.lastSignInTime = new Date();
      await user.save();
    } else {
      user = await User.create({
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        displayName: payload.name || '',
        photoURL: payload.picture || '',
        emailVerified: payload.email_verified ?? false,
        lastSignInTime: new Date(),
      });
    }

    sendAuthResponse(user, res);
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: toAuthUser(req.user) });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { displayName, photoURL, phoneNumber, location } = req.body;
    const user = req.user;

    if (displayName !== undefined) user.displayName = displayName;
    if (photoURL !== undefined) user.photoURL = photoURL;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (location !== undefined) user.location = location;

    await user.save();
    res.json({ user: toAuthUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
    }

    res.json({
      message:
        'If an account exists for that email, password reset instructions have been sent.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
