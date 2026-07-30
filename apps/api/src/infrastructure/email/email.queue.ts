import { Queue, Worker } from 'bullmq';
import { redis } from '@/lib/redis';
import { emailService } from './email.service';

export enum EmailJobType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MAGIC_LINK = 'MAGIC_LINK',
  ORG_INVITE = 'ORG_INVITE',
  TEAM_INVITE = 'TEAM_INVITE',
  PROJECT_SHARE = 'PROJECT_SHARE',
  RENDER_COMPLETE = 'RENDER_COMPLETE',
  WELCOME = 'WELCOME',
}

export interface EmailJobData {
  type: EmailJobType;
  to: string;
  subject?: string;
  html?: string;
  text?: string;
  metadata?: any;
}

export const emailQueue = new Queue<EmailJobData>('email', { connection: redis });

export async function addEmailJob(data: EmailJobData) {
  await emailQueue.add(data.type, data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}

export const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    const { type, to, subject, html, text, metadata } = job.data;
    try {
      if (html && text && subject) {
        await emailService.sendEmail(to, subject, html, text);
      } else {
        // Here you would branch on 'type' and call the appropriate emailService method with metadata params
        // For brevity:
        console.log(`Processing email job of type ${type} to ${to}`);
      }
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  },
  { connection: redis }
);
