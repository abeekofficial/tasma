import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

export function setupAiWorker(connection: Redis): Worker {
  const worker = new Worker(
    'ai-jobs',
    async (job: Job) => {
      console.log(`[AI Worker] Processing job ${job.id} of type ${job.name}`);

      switch (job.name) {
        case 'generate-script':
          await job.updateProgress(20);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await job.updateProgress(60);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await job.updateProgress(100);
          return { status: 'success', script: 'Simulated script content' };

        case 'generate-subtitles':
          await job.updateProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await job.updateProgress(100);
          return { status: 'success', subtitles: 'Simulated subtitles content' };

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`[AI Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[AI Worker] Job ${job?.id} failed with error:`, err);
  });

  return worker;
}
