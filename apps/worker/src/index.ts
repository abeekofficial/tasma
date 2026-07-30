import 'dotenv/config';
import http from 'http';
import { redisConnection } from './config/redis';
import { setupAiWorker } from './workers/ai.worker';
import { setupMediaWorker } from './workers/media.worker';
import { setupSystemWorker } from './workers/system.worker';

async function bootstrap() {
  console.log('Starting Tasma workers...');

  const aiWorker = setupAiWorker(redisConnection);
  const mediaWorker = setupMediaWorker(redisConnection);
  const systemWorker = setupSystemWorker(redisConnection);

  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Health check server listening on port ${PORT}`);
  });

  async function shutdown(signal: string) {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    
    server.close();
    
    try {
      await Promise.all([
        aiWorker.close(),
        mediaWorker.close(),
        systemWorker.close(),
      ]);
      console.log('All workers closed successfully.');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  console.error('Failed to start workers:', error);
  process.exit(1);
});
