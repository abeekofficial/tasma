import { Queue, JobsOptions, Job } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export type QueueName = 'ai-jobs' | 'media-jobs' | 'system-jobs';

export interface EnqueueOptions {
  priority?: 'high' | 'medium' | 'low';
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
}

const PRIORITY_MAP = {
  high: 1,
  medium: 5,
  low: 10,
};

export class JobsService {
  private queues: Map<QueueName, Queue>;

  constructor() {
    this.queues = new Map();
    this.queues.set('ai-jobs', new Queue('ai-jobs', { connection: redisConnection }));
    this.queues.set('media-jobs', new Queue('media-jobs', { connection: redisConnection }));
    this.queues.set('system-jobs', new Queue('system-jobs', { connection: redisConnection }));
  }

  private getQueue(queueName: string): Queue {
    const queue = this.queues.get(queueName as QueueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    return queue;
  }

  public async enqueueJob(queueName: string, jobName: string, payload: any, options?: EnqueueOptions): Promise<Job> {
    const queue = this.getQueue(queueName);
    
    const jobOptions: JobsOptions = {
      attempts: options?.attempts ?? 3,
      backoff: options?.backoff ?? { type: 'exponential', delay: 1000 },
      priority: options?.priority ? PRIORITY_MAP[options.priority] : PRIORITY_MAP['medium'],
    };

    return queue.add(jobName, payload, jobOptions);
  }

  public async getJobStatus(queueName: string, jobId: string): Promise<{ state: string | null; progress: number | object; returnvalue: any; failedReason: string | null }> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    const state = await job.getState();
    const progress = job.progress;
    
    return {
      state,
      progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason ?? null,
    };
  }

  public async cancelJob(queueName: string, jobId: string): Promise<boolean> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    const state = await job.getState();
    if (state === 'active') {
      throw new Error('Cannot cancel an active job');
    }

    await job.remove();
    return true;
  }
}

export const jobsService = new JobsService();
