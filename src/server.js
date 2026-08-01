import app from './app.js';
import { initDb } from './db/initDb.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Initialize Database schema
  await initDb();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Profile Uploader Server running on port ${PORT}`);
    console.log(`📡 API Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`👤 Users API: http://localhost:${PORT}/api/users`);
    console.log(`☁️  S3 API: http://localhost:${PORT}/api/s3/presigned-url`);
  });

  // Graceful Shutdown
  const handleShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
