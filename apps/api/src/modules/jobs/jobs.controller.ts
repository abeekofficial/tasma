import { Request, Response } from 'express';
import { jobsService } from './jobs.service';

export class JobsController {
  public getJobStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { queueName, jobId } = req.params;
      const status = await jobsService.getJobStatus(queueName, jobId);
      res.status(200).json({ success: true, data: status });
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        res.status(404).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
      }
    }
  };

  public cancelJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { queueName, jobId } = req.params;
      await jobsService.cancelJob(queueName, jobId);
      res.status(200).json({ success: true, message: `Job ${jobId} cancelled successfully` });
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        res.status(404).json({ success: false, error: error.message });
      } else if (error.message && error.message.includes('active')) {
        res.status(400).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
      }
    }
  };
}

export const jobsController = new JobsController();
