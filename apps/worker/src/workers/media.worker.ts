import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

export function setupMediaWorker(connection: Redis): Worker {
  const worker = new Worker(
    'media-jobs',
    async (job: Job) => {
      console.log(`[Media Worker] Processing job ${job.id} of type ${job.name}`);

      switch (job.name) {
        case 'generate-thumbnail':
          await job.updateProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await job.updateProgress(100);
          return { status: 'success', url: 'https://example.com/thumb.jpg' };

        case 'extract-metadata':
          await job.updateProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await job.updateProgress(100);
          return { status: 'success', metadata: { duration: 120, resolution: '1080p' } };

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`[Media Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Media Worker] Job ${job?.id} failed with error:`, err);
  });

  return worker;
}
