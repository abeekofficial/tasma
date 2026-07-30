export interface FilterNode {
  filter: string;
  options?: string | Record<string, string | number>;
  inputs: string[];
  outputs: string[];
}

export class FilterGraph {
  private nodes: FilterNode[] = [];
  private streamCounter = 0;

  /**
   * Generates a unique stream name like `[v1]`, `[v2]`
   */
  public generateStreamName(prefix: string = 'v'): string {
    this.streamCounter++;
    return `${prefix}${this.streamCounter}`;
  }

  /**
   * Adds a filter to the graph.
   * @param filter The name of the filter (e.g., 'scale', 'crop')
   * @param inputs Array of input stream names (e.g., ['0:v'])
   * @param outputs Array of output stream names (e.g., ['v1'])
   * @param options Additional options for the filter
   */
  public addFilter(
    filter: string,
    inputs: string[],
    outputs: string[],
    options?: string | Record<string, string | number>
  ): void {
    this.nodes.push({
      filter,
      inputs,
      outputs,
      options,
    });
  }

  /**
   * Formats a single filter node into an FFmpeg complex filter string part.
   */
  private formatNode(node: FilterNode): string {
    const inputsStr = node.inputs.map(i => `[${i.replace(/^\[|\]$/g, '')}]`).join('');
    const outputsStr = node.outputs.map(o => `[${o.replace(/^\[|\]$/g, '')}]`).join('');
    
    let filterStr = node.filter;
    if (node.options) {
      if (typeof node.options === 'string') {
        filterStr += `=${node.options}`;
      } else {
        const optEntries = Object.entries(node.options);
        if (optEntries.length > 0) {
          const optStr = optEntries.map(([k, v]) => `${k}=${v}`).join(':');
          filterStr += `=${optStr}`;
        }
      }
    }

    return `${inputsStr}${filterStr}${outputsStr}`;
  }

  /**
   * Builds the finalized complex filter string suitable for fluent-ffmpeg.
   * Returns empty string if there are no filters.
   */
  public build(): string {
    if (this.nodes.length === 0) {
      return '';
    }
    return this.nodes.map(node => this.formatNode(node)).join(';');
  }
}
