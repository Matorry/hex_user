import 'dotenv/config';
import { createServer } from 'http';
import { createApp } from './app';

console.log('Starting server');

const port = process.env.PORT ?? 7373;

const start = async () => {
  const app = await createApp(); // <- await porque createApp es async
  const server = createServer(app); // <- sin await

  server.on("error", (error) => {
    process.exit(1);
  });

  server.on('listening', () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.listen(port);
};

start();
