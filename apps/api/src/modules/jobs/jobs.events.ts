import { QueueEvents } from 'bullmq';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { QueueName } from './jobs.service';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const jobEventEmitter = new EventEmitter();

export class JobsEventsListener {
  private queueEvents: Map<QueueName, QueueEvents>;

  constructor() {
    this.queueEvents = new Map();
    this.setupListeners('ai-jobs');
    this.setupListeners('media-jobs');
    this.setupListeners('system-jobs');
  }

  private setupListeners(queueName: QueueName) {
    const events = new QueueEvents(queueName, { connection: redisConnection });
    
    events.on('completed', ({ jobId, returnvalue }) => {
      jobEventEmitter.emit('completed', { queueName, jobId, returnvalue });
    });

    events.on('failed', ({ jobId, failedReason }) => {
      jobEventEmitter.emit('failed', { queueName, jobId, failedReason });
    });

    events.on('progress', ({ jobId, data }) => {
      jobEventEmitter.emit('progress', { queueName, jobId, progress: data });
    });

    this.queueEvents.set(queueName, events);
  }

  public async close(): Promise<void> {
    for (const events of this.queueEvents.values()) {
      await events.close();
    }
  }
}

export const jobsEventsListener = new JobsEventsListener();
