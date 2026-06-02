import { Router } from 'express';
import { profileImageUpload } from '../middleware/upload.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create issues upload directory if it doesn't exist
const issuesUploadDir = path.join(__dirname, '..', 'uploads', 'issues');
const resolutionUploadDir = path.join(__dirname, '..', 'uploads', 'resolution');
fs.mkdirSync(issuesUploadDir, { recursive: true });
fs.mkdirSync(resolutionUploadDir, { recursive: true });

// Configure multer for issue images
import multer from 'multer';

const issueImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, issuesUploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const issueImageUpload = multer({
  storage: issueImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const resolutionFileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resolutionUploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const resolutionFileUpload = multer({
  storage: resolutionFileStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image or PDF files are allowed'));
    }
  },
});

// Upload issue image
router.post('/issue', issueImageUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/issues/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl,
      filePath: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Upload resolution proof, before/after photos, and receipts
router.post('/resolution', resolutionFileUpload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/resolution/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl,
      imageUrl: fileUrl,
      filePath: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Resolution upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Upload profile image
router.post('/profile', profileImageUpload.single('profileImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl,
      filePath: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

export default router;
