import { streamText, StreamTextResult } from 'ai';
import { getProviderModel, AIProvider } from '../ai.module';

export class SubtitleGenerator {
  public async translateSubtitles(
    text: string,
    targetLanguage: string,
    provider: AIProvider,
    modelName: string = 'gpt-4o'
  ): Promise<StreamTextResult<Record<string, never>, never>> {
    const model = getProviderModel(provider, modelName);

    const systemPrompt = `You are an expert translator. 
Translate the provided subtitle text into ${targetLanguage}. 
Maintain the original timing, tone, and formatting (e.g., SRT or VTT) if present. 
Ensure the translation sounds natural to native speakers.`;

    const userPrompt = `Translate the following text:\n\n${text}`;

    return streamText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    });
  }
}
