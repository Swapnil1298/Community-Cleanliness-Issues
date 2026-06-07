import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import corsMiddleware from './config/cors.js';
import issuesRouter from './routes/issues.js';
import contributionsRouter from './routes/contributions.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import paymentsRouter from './routes/payments.js';
import newsletterRouter from './routes/newsletter.js';
import { seedSampleIssues } from './seeds/sampleIssues.js';
import { streamUploadedFile } from './utils/fileStorage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/uploads/:folder/:filename', streamUploadedFile);

app.use('/api/auth', authRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/contributions', contributionsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/newsletter', newsletterRouter);

// ─── Serve built React/Vite frontend in production ───
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // All non-API routes → React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

connectDB()
  .then(async () => {
    if (process.env.SEED_SAMPLE_ISSUES === 'true') {
      await seedSampleIssues();
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      if (process.env.FRONTEND_URL) {
        console.log(`CORS allowed for: ${process.env.FRONTEND_URL}`);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });
