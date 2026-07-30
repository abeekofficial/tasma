import { SubtitleCue } from '../../types';

export class VttParser {
  /**
   * Parses WebVTT format subtitle content into SubtitleCue objects.
   * @param content Raw string content of the VTT file.
   * @returns Array of standardized SubtitleCue objects.
   */
  public static parse(content: string): SubtitleCue[] {
    const cues: SubtitleCue[] = [];
    if (!content) return cues;

    // Normalize line endings
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized.split(/\n\n+/);

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i].trim();
      if (!block) continue;

      // Ignore WEBVTT header and NOTE blocks
      if (i === 0 && block.startsWith('WEBVTT')) continue;
      if (block.startsWith('NOTE')) continue;

      const lines = block.split('\n');
      let timecodeLineIdx = -1;

      // Search for the timecode line which contains '-->'
      for (let j = 0; j < Math.min(2, lines.length); j++) {
        if (lines[j].includes('-->')) {
          timecodeLineIdx = j;
          break;
        }
      }

      if (timecodeLineIdx === -1) continue;

      const timecodeLine = lines[timecodeLineIdx];
      // VTT timecodes can omit the hour part: MM:SS.mmm or HH:MM:SS.mmm
      const timeRegex = /^(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})/;
      const match = timeRegex.exec(timecodeLine);

      if (!match) continue;

      const startMs = this.timeToMs(match[1] || '00', match[2], match[3], match[4]);
      const endMs = this.timeToMs(match[5] || '00', match[6], match[7], match[8]);

      const rawText = lines.slice(timecodeLineIdx + 1).join('\n');
      // Strip VTT tags (e.g., <c.className>, <b>, <v VoiceName>)
      const text = rawText.replace(/<\/?[^>]+(>|$)/g, '').trim();

      cues.push({
        startMs,
        endMs,
        text,
      });
    }

    return cues;
  }

  private static timeToMs(h: string, m: string, s: string, ms: string): number {
    return (
      parseInt(h, 10) * 3600000 +
      parseInt(m, 10) * 60000 +
      parseInt(s, 10) * 1000 +
      parseInt(ms, 10)
    );
  }
}
