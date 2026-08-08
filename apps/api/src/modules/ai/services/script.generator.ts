import { generateObject, GenerateObjectResult } from 'ai';
import { z } from 'zod';
import { getProviderModel, AIProvider } from '../ai.module';

export const scriptSchema = z.object({
  title: z.string(),
  hook: z.string(),
  scenes: z.array(
    z.object({
      order: z.number(),
      narration: z.string(),
      visualSuggestion: z.string(),
      duration: z.number(),
    })
  ),
  fullScript: z.string(),
  suggestedHashtags: z.array(z.string()),
});

export type ScriptResponse = z.infer<typeof scriptSchema>;

export class ScriptGenerator {
  public async generateScript(
    topic: string,
    length: 'short' | 'medium' | 'long',
    tone: string,
    provider: AIProvider = 'gemini',
    modelName: string = 'gemini-1.5-flash'
  ): Promise<GenerateObjectResult<ScriptResponse>> {
    const model = getProviderModel(provider, modelName);

    const lengthWords = length === 'short' ? 'about 150 words' : length === 'medium' ? 'about 300 words' : 'about 500 words';

    const systemPrompt = `You are an expert content creator specializing in highly engaging, viral YouTube Shorts and TikTok scripts. 
Your goal is to write a script with clear scene directions and voiceover text.
The tone should be ${tone}. 
The length should be ${lengthWords}.
Include a strong hook in the first 3 seconds, keep the pacing fast, and end with a call to action.`;

    const userPrompt = `Write a viral script about the following topic:\n\n${topic}`;

    return generateObject({
      model,
      schema: scriptSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });
  }
}
