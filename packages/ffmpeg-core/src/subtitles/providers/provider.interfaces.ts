import { SubtitleTrack } from '../../types';

export interface ITranscriptionProvider {
  transcribe(audioPath: string): Promise<SubtitleTrack>;
}

export interface ITranslationProvider {
  translate(track: SubtitleTrack, targetLang: string): Promise<SubtitleTrack>;
}
