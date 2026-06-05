import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

const bucketName = 'uploads';

const getBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error('Database is not ready for file uploads');
  }

  return new GridFSBucket(mongoose.connection.db, { bucketName });
};

export const createStoredFilename = (originalName = '') => {
  const ext = path.extname(originalName).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
};

export const saveUploadedFile = (file, folder) =>
  new Promise((resolve, reject) => {
    if (!file?.buffer) {
      reject(new Error('No file uploaded'));
      return;
    }

    const filename = createStoredFilename(file.originalname);
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        folder,
        originalName: file.originalname,
      },
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', (storedFile) => {
      resolve({
        id: storedFile._id.toString(),
        filename,
        url: `/uploads/${folder}/${filename}`,
      });
    });

    uploadStream.end(file.buffer);
  });

export const streamUploadedFile = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const bucket = getBucket();
    const files = await mongoose.connection.db
      .collection(`${bucketName}.files`)
      .find({ filename, 'metadata.folder': folder })
      .sort({ uploadDate: -1 })
      .limit(1)
      .toArray();

    const file = files[0];
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.contentType) {
      res.setHeader('Content-Type', file.contentType);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    bucket.openDownloadStream(new ObjectId(file._id)).on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Unable to read uploaded file' });
      } else {
        res.destroy();
      }
    }).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load uploaded file' });
  }
};
