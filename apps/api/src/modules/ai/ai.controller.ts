import { Request, Response, NextFunction } from 'express';
import { ScriptGenerator } from './services/script.generator';
import { PlannerGenerator } from './services/planner.generator';
import { SubtitleGenerator } from './services/subtitle.generator';
import { AIProvider } from './ai.module';

export class AIController {
  private scriptGenerator: ScriptGenerator;
  private plannerGenerator: PlannerGenerator;
  private subtitleGenerator: SubtitleGenerator;

  constructor() {
    this.scriptGenerator = new ScriptGenerator();
    this.plannerGenerator = new PlannerGenerator();
    this.subtitleGenerator = new SubtitleGenerator();
  }

  public generateScript = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { topic, length, tone, provider, modelName } = req.body;
      
      if (!topic || !length || !tone || !provider) {
        res.status(400).json({ error: 'Missing required parameters.' });
        return;
      }

      const streamResult = await this.scriptGenerator.generateScript(
        topic,
        length as 'short' | 'medium' | 'long',
        tone,
        provider as AIProvider,
        modelName
      );

      streamResult.pipeTextStreamToResponse(res);
    } catch (error) {
      next(error);
    }
  };

  public generatePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { keyword, audience, provider, modelName } = req.body;
      
      if (!keyword || !audience || !provider) {
        res.status(400).json({ error: 'Missing required parameters.' });
        return;
      }

      const result = await this.plannerGenerator.generateRankingPlan(
        keyword,
        audience,
        provider as AIProvider,
        modelName
      );

      res.status(200).json(result.object);
    } catch (error) {
      next(error);
    }
  };

  public translateSubtitles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { text, targetLanguage, provider, modelName } = req.body;

      if (!text || !targetLanguage || !provider) {
        res.status(400).json({ error: 'Missing required parameters.' });
        return;
      }

      const streamResult = await this.subtitleGenerator.translateSubtitles(
        text,
        targetLanguage,
        provider as AIProvider,
        modelName
      );

      streamResult.pipeTextStreamToResponse(res);
    } catch (error) {
      next(error);
    }
  };
}
