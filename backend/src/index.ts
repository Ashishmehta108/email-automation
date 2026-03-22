import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRoutes } from './routes/index.js';
import { emailService } from './services/email.service.js';
import { pool } from './db/index.js';
import { runMigrations } from './db/migrate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Email Automation API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      certificates: '/api/certificates',
      templates: '/api/templates',
      auth: '/api/auth',
      stats: '/api/stats',
      health: '/api/health',
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Initialize application
async function bootstrap() {
  console.log('🚀 Starting Email Automation API...\n');

  // Run database migrations
  console.log('📦 Running database migrations...');
  await runMigrations();
  console.log('✅ Database initialized\n');

  // Initialize email service
  const emailConfig = {
    user: process.env.GMAIL_USER || '',
    clientId: process.env.GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
  };

  if (emailConfig.user && emailConfig.clientId && emailConfig.clientSecret && emailConfig.refreshToken) {
    emailService.initialize(emailConfig);
    console.log('📧 Email service initialized\n');
  } else {
    console.log('⚠️  Email service not configured. Set GMAIL_* environment variables.\n');
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check at http://localhost:${PORT}/api/health\n`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start application
bootstrap().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
