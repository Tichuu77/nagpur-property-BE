import { createServer } from 'node:http';
import app from './src/app.js';
import env from './src/config/env.js';
import connectDB from './src/config/db.js';

const server = createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();
