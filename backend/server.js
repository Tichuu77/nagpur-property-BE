import { createServer } from 'node:http';
import app from './src/app.js';
import env from './src/config/env.js';
import connectDB from './src/config/db.js';
import './src/workers/mail.worker.js';

const server = createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};
 
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down...`);

  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

 
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();