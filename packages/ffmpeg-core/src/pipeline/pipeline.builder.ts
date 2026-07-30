import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { FilterGraph } from './filter.graph';
import {
  TrimOptions,
  CropOptions,
  ScaleOptions,
  OverlayOptions,
  ColorCorrectionOptions,
  FadeOptions,
  CompressorOptions,
  EqualizerOptions,
} from '../types';

export class PipelineBuilder {
  private command: FfmpegCommand;
  private filterGraph: FilterGraph;
  private currentVideoStream: string = '0:v';
  private currentAudioStream: string = '0:a';
  private outputPath?: string;

  constructor(command?: FfmpegCommand) {
    this.command = command || ffmpeg();
    this.filterGraph = new FilterGraph();
  }

  /**
   * Adds an input file to the FFmpeg command.
   */
  public addInput(path: string): this {
    this.command.input(path);
    return this;
  }

  /**
   * Sets the output file path.
   */
  public setOutput(path: string): this {
    this.outputPath = path;
    return this;
  }

  /**
   * Applies a trim operation.
   * Note: Trimming is often better applied as an input option or output option
   * for performance, but here we use the trim filter for pipeline consistency
   * or stream-specific clipping.
   */
  public trim(opts: TrimOptions): this {
    const options: Record<string, string | number> = {};
    if (opts.startTime !== undefined) options.start = opts.startTime;
    if (opts.endTime !== undefined) options.end = opts.endTime;
    if (opts.duration !== undefined) options.duration = opts.duration;

    const outStream = this.filterGraph.generateStreamName('trim');
    this.filterGraph.addFilter('trim', [this.currentVideoStream], [outStream], options);
    
    const setptsStream = this.filterGraph.generateStreamName('setpts');
    this.filterGraph.addFilter('setpts', [outStream], [setptsStream], 'PTS-STARTPTS');
    
    this.currentVideoStream = setptsStream;

    // Additionally handle audio trim if needed
    const aOutStream = this.filterGraph.generateStreamName('atrim');
    this.filterGraph.addFilter('atrim', [this.currentAudioStream], [aOutStream], options);
    
    const asetptsStream = this.filterGraph.generateStreamName('asetpts');
    this.filterGraph.addFilter('asetpts', [aOutStream], [asetptsStream], 'PTS-STARTPTS');
    
    this.currentAudioStream = asetptsStream;
    
    return this;
  }

  /**
   * Applies a crop operation.
   */
  public crop(opts: CropOptions): this {
    const outStream = this.filterGraph.generateStreamName('crop');
    const cropStr = `${opts.w}:${opts.h}:${opts.x}:${opts.y}`;
    this.filterGraph.addFilter('crop', [this.currentVideoStream], [outStream], cropStr);
    this.currentVideoStream = outStream;
    return this;
  }

  /**
   * Applies a scale operation.
   */
  public scale(opts: ScaleOptions): this {
    const outStream = this.filterGraph.generateStreamName('scale');
    const scaleStr = opts.keepAspectRatio 
      ? `${opts.width}:${opts.height}:force_original_aspect_ratio=decrease`
      : `${opts.width}:${opts.height}`;
    
    this.filterGraph.addFilter('scale', [this.currentVideoStream], [outStream], scaleStr);
    this.currentVideoStream = outStream;
    return this;
  }

  /**
   * Applies an overlay operation.
   * Requires another input to overlay onto the current stream.
   * For simplicity, assumes the next input stream (e.g., 1:v) is the overlay.
   */
  public overlay(opts: OverlayOptions, overlayStream: string = '1:v'): this {
    const outStream = this.filterGraph.generateStreamName('overlay');
    const options: Record<string, string | number> = {
      x: opts.x,
      y: opts.y,
    };
    
    // In a full implementation, opacity and blendMode would be mapped to specific 
    // overlay or blend filters. FFmpeg overlay filter supports format/alpha.
    
    this.filterGraph.addFilter('overlay', [this.currentVideoStream, overlayStream], [outStream], options);
    this.currentVideoStream = outStream;
    return this;
  }

  /**
   * Applies color correction.
   */
  public colorCorrection(opts: ColorCorrectionOptions): this {
    const outStream = this.filterGraph.generateStreamName('eq');
    const options: Record<string, string | number> = {};
    
    if (opts.brightness !== undefined) options.brightness = opts.brightness;
    if (opts.contrast !== undefined) options.contrast = opts.contrast;
    if (opts.saturation !== undefined) options.saturation = opts.saturation;
    if (opts.gamma !== undefined) options.gamma = opts.gamma;
    
    // For hue, eq uses hue, but sometimes it's expressed differently in ffmpeg.
    
    this.filterGraph.addFilter('eq', [this.currentVideoStream], [outStream], options);
    this.currentVideoStream = outStream;
    return this;
  }

  /**
   * Mutes the audio.
   */
  public mute(): this {
    const outStream = this.filterGraph.generateStreamName('volume');
    this.filterGraph.addFilter('volume', [this.currentAudioStream], [outStream], { volume: 0 });
    this.currentAudioStream = outStream;
    return this;
  }

  /**
   * Adjusts the audio volume.
   */
  public adjustVolume(level: number): this {
    const outStream = this.filterGraph.generateStreamName('volume');
    this.filterGraph.addFilter('volume', [this.currentAudioStream], [outStream], { volume: level });
    this.currentAudioStream = outStream;
    return this;
  }

  /**
   * Applies an audio fade.
   */
  public fadeAudio(opts: FadeOptions): this {
    const outStream = this.filterGraph.generateStreamName('afade');
    const options: Record<string, string | number> = {
      t: opts.type,
      st: opts.startTime,
      d: opts.duration,
    };
    if (opts.curve) {
      options.curve = opts.curve;
    }
    this.filterGraph.addFilter('afade', [this.currentAudioStream], [outStream], options);
    this.currentAudioStream = outStream;
    return this;
  }

  /**
   * Applies audio compression.
   */
  public compress(opts: CompressorOptions): this {
    const outStream = this.filterGraph.generateStreamName('acompressor');
    const options: Record<string, string | number> = {
      threshold: opts.threshold,
      ratio: opts.ratio,
      attack: opts.attack,
      release: opts.release,
    };
    if (opts.makeup !== undefined) {
      options.makeup = opts.makeup;
    }
    this.filterGraph.addFilter('acompressor', [this.currentAudioStream], [outStream], options);
    this.currentAudioStream = outStream;
    return this;
  }

  /**
   * Applies audio equalization.
   */
  public equalize(opts: EqualizerOptions): this {
    const outStream = this.filterGraph.generateStreamName('equalizer');
    const options: Record<string, string | number> = {
      f: opts.frequency,
      g: opts.gain,
    };
    if (opts.width_type) options.t = opts.width_type;
    if (opts.width !== undefined) options.w = opts.width;
    
    this.filterGraph.addFilter('equalizer', [this.currentAudioStream], [outStream], options);
    this.currentAudioStream = outStream;
    return this;
  }

  /**
   * Syncs audio by applying a delay.
   */
  public syncAudio(offsetMs: number): this {
    if (offsetMs > 0) {
      const outStream = this.filterGraph.generateStreamName('adelay');
      const options = { delays: `${offsetMs}|${offsetMs}` };
      this.filterGraph.addFilter('adelay', [this.currentAudioStream], [outStream], options);
      this.currentAudioStream = outStream;
    } else if (offsetMs < 0) {
      const atrimOutStream = this.filterGraph.generateStreamName('atrim');
      this.filterGraph.addFilter('atrim', [this.currentAudioStream], [atrimOutStream], { start: Math.abs(offsetMs) / 1000 });
      
      const asetptsOutStream = this.filterGraph.generateStreamName('asetpts');
      this.filterGraph.addFilter('asetpts', [atrimOutStream], [asetptsOutStream], 'PTS-STARTPTS');
      
      this.currentAudioStream = asetptsOutStream;
    }
    return this;
  }

  /**
   * Executes the pipeline.
   */
  public execute(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.outputPath) {
        return reject(new Error('Output path must be set before executing'));
      }

      const complexFilterStr = this.filterGraph.build();
      if (complexFilterStr) {
        this.command.complexFilter(complexFilterStr, [this.currentVideoStream, this.currentAudioStream]);
      }

      this.command
        .output(this.outputPath)
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
  }
}
