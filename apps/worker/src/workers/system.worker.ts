import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

export function setupSystemWorker(connection: Redis): Worker {
  const worker = new Worker(
    'system-jobs',
    async (job: Job) => {
      console.log(`[System Worker] Processing job ${job.id} of type ${job.name}`);

      switch (job.name) {
        case 'cache-cleanup':
          await job.updateProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 500));
          await job.updateProgress(100);
          return { status: 'success', itemsRemoved: 42 };

        case 'auto-save':
          await job.updateProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 500));
          await job.updateProgress(100);
          return { status: 'success', saved: true };

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`[System Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[System Worker] Job ${job?.id} failed with error:`, err);
  });

  return worker;
}
