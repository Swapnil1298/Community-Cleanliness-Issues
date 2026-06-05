import { Router } from 'express';
import { profileImageUpload } from '../middleware/upload.js';
import multer from 'multer';
import { saveUploadedFile } from '../utils/fileStorage.js';

const router = Router();

const issueImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const resolutionFileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image or PDF files are allowed'));
    }
  },
});

const runSingleUpload = (upload, fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || 'Upload failed' });
    }
    next();
  });
};

// Upload issue image
router.post('/issue', runSingleUpload(issueImageUpload, 'image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const storedFile = await saveUploadedFile(req.file, 'issues');
    const imageUrl = storedFile.url;
    res.json({
      success: true,
      imageUrl,
      filePath: imageUrl,
      filename: storedFile.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Upload resolution proof, before/after photos, and receipts
router.post('/resolution', runSingleUpload(resolutionFileUpload, 'file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const storedFile = await saveUploadedFile(req.file, 'resolution');
    const fileUrl = storedFile.url;
    res.json({
      success: true,
      fileUrl,
      imageUrl: fileUrl,
      filePath: fileUrl,
      filename: storedFile.filename,
    });
  } catch (error) {
    console.error('Resolution upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Upload profile image
router.post('/profile', runSingleUpload(profileImageUpload, 'profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const storedFile = await saveUploadedFile(req.file, 'profiles');
    const imageUrl = storedFile.url;
    res.json({
      success: true,
      imageUrl,
      filePath: imageUrl,
      filename: storedFile.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

export default router;
