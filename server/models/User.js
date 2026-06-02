import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    displayName: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    location: { type: String, default: '' },
    emailVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true },
    lastSignInTime: { type: Date },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
