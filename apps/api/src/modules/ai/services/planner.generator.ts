import { generateObject, GenerateObjectResult } from 'ai';
import { z } from 'zod';
import { getProviderModel, AIProvider } from '../ai.module';

const rankingPlanSchema = z.object({
  titleIdeas: z.array(z.string()).describe('A list of 3-5 catchy, high-CTR title ideas.'),
  hooks: z.array(z.string()).describe('A list of 2-3 engaging hooks for the beginning of the video.'),
  scenes: z.array(
    z.object({
      part: z.number().describe('The sequence number of the scene (1 to 5).'),
      description: z.string().describe('Visual description of the scene.'),
      keyMessage: z.string().describe('The core message or takeaway for this scene.')
    })
  ).length(5).describe('A 5-part scene breakdown for the video.')
});

export type RankingPlan = z.infer<typeof rankingPlanSchema>;

export class PlannerGenerator {
  public async generateRankingPlan(
    keyword: string,
    audience: string,
    provider: AIProvider,
    modelName: string = 'gpt-4o'
  ): Promise<GenerateObjectResult<RankingPlan>> {
    const model = getProviderModel(provider, modelName);

    const systemPrompt = `You are a YouTube strategist and video planner. 
Your goal is to create a structured plan for a video designed to rank in search and capture the audience's attention.
Target audience: ${audience}.
The plan must include title ideas, hook options, and a 5-part scene breakdown.`;

    const userPrompt = `Create a ranking video plan for the keyword/topic: "${keyword}"`;

    return generateObject({
      model,
      schema: rankingPlanSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });
  }
}
