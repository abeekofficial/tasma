import { env } from './config/env';
import { app } from './app';
import { prisma } from './lib/prisma';
import { redisClient } from './lib/redis';
import { webSocketManager } from './modules/websocket/websocket-manager';

async function startServer() {
  try {
    // Verify Prisma connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Verify Redis connection
    await redisClient.ping();
    console.log('Redis connected successfully');

    const server = app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Initialize WebSocket server
    webSocketManager.initialize(server);

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down gracefully...`);
      
      // Stop accepting new connections
      server.close(() => {
        console.log('HTTP server closed');
      });

      try {
        // Shutdown WebSocket server
        webSocketManager.shutdown();

        await prisma.$disconnect();
        console.log('Prisma disconnected');
        
        await redisClient.quit();
        console.log('Redis disconnected');
        
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Force shutdown after 10 seconds
    const forceShutdown = setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
    
    // Allow process to exit naturally if all connections close before timeout
    forceShutdown.unref();
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
