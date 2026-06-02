import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/db.js';
import { authenticate } from './middleware/auth.js';
import { uploadReceipt } from './middleware/upload.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import purchaseRoutes from './routes/purchase.js';
import budgetRoutes from './routes/budget.js';
import employeeRoutes from './routes/employees.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Root should serve the login page by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/employees', employeeRoutes);

// File upload endpoint
app.post('/api/upload', authenticate, uploadReceipt, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileId = uuidv4();
    res.json({
      fileId,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      fileSize: req.file.size
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Base64 upload endpoint (for signatures, etc.)
app.post('/api/upload-base64', authenticate, (req, res) => {
  try {
    const { base64Data, fileName, fileType } = req.body;

    if (!base64Data || !fileName || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileId = uuidv4();
    const uploadDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Decode base64 and save
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }

    const data = Buffer.from(matches[2], 'base64');
    const ext = fileName.split('.').pop() || 'png';
    const savedFileName = `${fileId}.${ext}`;
    const filePath = path.join(uploadDir, savedFileName);

    fs.writeFileSync(filePath, data);

    res.json({
      fileId,
      fileName,
      filePath: `/uploads/${savedFileName}`,
      fileType,
      base64Data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Base64 upload failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const start = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;
