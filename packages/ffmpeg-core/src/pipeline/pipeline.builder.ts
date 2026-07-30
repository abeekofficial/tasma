import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { FilterGraph } from './filter.graph';
import {
  TrimOptions,
  CropOptions,
  ScaleOptions,
  OverlayOptions,
  ColorCorrectionOptions,
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
