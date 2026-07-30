import { SubtitleCue } from '../types';


export class SubtitleOperations {
  /**
   * Shifts the timing of all cues by the given offset in milliseconds.
   */
  public static shiftTime(cues: SubtitleCue[], offsetMs: number): SubtitleCue[] {
    return cues.map(cue => ({
      ...cue,
      startMs: Math.max(0, cue.startMs + offsetMs),
      endMs: Math.max(0, cue.endMs + offsetMs),
    }));
  }

  /**
   * Splits a single cue into two cues at the specified time in milliseconds.
   * If the split time is outside the cue's duration, returns an array with the original cue.
   */
  public static splitCue(cue: SubtitleCue, splitAtMs: number): SubtitleCue[] {
    if (splitAtMs <= cue.startMs || splitAtMs >= cue.endMs) {
      return [ { ...cue } ];
    }

    return [
      {
        ...cue,
        id: `${cue.id}-1`,
        endMs: splitAtMs,
      },
      {
        ...cue,
        id: `${cue.id}-2`,
        startMs: splitAtMs,
      }
    ];
  }

  /**
   * Merges multiple cues into a single cue.
   * Spans from the start of the earliest cue to the end of the latest cue.
   * Concatenates the text of all cues.
   */
  public static mergeCues(cuesToMerge: SubtitleCue[]): SubtitleCue {
    if (cuesToMerge.length === 0) {
      throw new Error('Cannot merge empty array of cues');
    }
    
    // Sort cues by start time to ensure text concatenation is logical
    const sorted = [...cuesToMerge].sort((a, b) => a.startMs - b.startMs);
    
    const startMs = sorted[0].startMs;
    const endMs = Math.max(...sorted.map(c => c.endMs));
    const text = sorted.map(c => c.text).join(' ');
    
    return {
      ...sorted[0],
      id: `${sorted[0].id}-merged`,
      startMs,
      endMs,
      text,
    };
  }

  /**
   * Finds and replaces text across multiple cues based on a RegExp.
   */
  public static findAndReplace(cues: SubtitleCue[], regex: RegExp, replacement: string): SubtitleCue[] {
    return cues.map(cue => ({
      ...cue,
      text: cue.text.replace(regex, replacement),
    }));
  }

  /**
   * Validates if there are any overlapping cues in the array.
   * Returns true if overlaps exist, false otherwise.
   */
  public static validateOverlaps(cues: SubtitleCue[]): boolean {
    if (cues.length < 2) return false;
    
    const sorted = [...cues].sort((a, b) => a.startMs - b.startMs);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endMs > sorted[i + 1].startMs) {
        return true; // Overlap detected
      }
    }
    return false;
  }
}
