import { SubtitleCue } from '../../types';

export class SrtParser {
  /**
   * Parses SRT format subtitle content into SubtitleCue objects.
   * @param content Raw string content of the SRT file.
   * @returns Array of standardized SubtitleCue objects.
   */
  public static parse(content: string): SubtitleCue[] {
    const cues: SubtitleCue[] = [];
    if (!content) return cues;

    // Normalize line endings
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized.split(/\n\n+/);

    for (const block of blocks) {
      if (!block.trim()) continue;

      const lines = block.trim().split('\n');
      if (lines.length < 3) continue;

      // lines[0] is typically the sequence index, lines[1] is the timecode, lines[2+] is the text.
      // However, sometimes lines can be shifted if the index is missing. We look for the timecode line.
      let timecodeLineIdx = -1;
      for (let i = 0; i < Math.min(2, lines.length); i++) {
        if (lines[i].includes('-->')) {
          timecodeLineIdx = i;
          break;
        }
      }

      if (timecodeLineIdx === -1) continue;

      const timecodeLine = lines[timecodeLineIdx];
      // Format: HH:MM:SS,mmm --> HH:MM:SS,mmm
      const timeRegex = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/;
      const match = timeRegex.exec(timecodeLine);

      if (!match) continue;

      const startMs = this.timeToMs(match[1], match[2], match[3], match[4]);
      const endMs = this.timeToMs(match[5], match[6], match[7], match[8]);

      const rawText = lines.slice(timecodeLineIdx + 1).join('\n');
      // Strip basic HTML-like tags (e.g., <b>, <i>, <font color="...">)
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
