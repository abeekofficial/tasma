import { streamText, StreamTextResult } from 'ai';
import { getProviderModel, AIProvider } from '../ai.module';

export class ScriptGenerator {
  public async generateScript(
    topic: string,
    length: 'short' | 'medium' | 'long',
    tone: string,
    provider: AIProvider,
    modelName: string = 'gpt-4o'
  ): Promise<StreamTextResult<Record<string, never>, never>> {
    const model = getProviderModel(provider, modelName);

    const lengthWords = length === 'short' ? 'about 150 words' : length === 'medium' ? 'about 300 words' : 'about 500 words';

    const systemPrompt = `You are an expert content creator specializing in highly engaging, viral YouTube Shorts and TikTok scripts. 
Your goal is to write a script with clear scene directions and voiceover text.
The tone should be ${tone}. 
The length should be ${lengthWords}.
Format your output with clear tags like [SCENE 1: description] followed by Voiceover: "text".
Include a strong hook in the first 3 seconds, keep the pacing fast, and end with a call to action.`;

    const userPrompt = `Write a viral script about the following topic:\n\n${topic}`;

    return streamText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    });
  }
}
