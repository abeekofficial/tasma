import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { LanguageModelV1 } from 'ai';

export type AIProvider = 'openai' | 'gemini' | 'anthropic';

export function getProviderModel(provider: AIProvider, modelName: string): LanguageModelV1 {
  switch (provider) {
    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is missing.');
      }
      const openai = createOpenAI({ apiKey });
      return openai(modelName);
    }
    case 'gemini': {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is missing.');
      }
      const google = createGoogleGenerativeAI({ apiKey });
      return google(modelName);
    }
    case 'anthropic': {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY environment variable is missing.');
      }
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelName);
    }
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
