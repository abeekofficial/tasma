import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SystemResources {
  cpuUsagePercentage: number;
  freeMemoryBytes: number;
  totalMemoryBytes: number;
  gpuUtilizationPercentage: number;
}

export class ResourceMonitor {
  private lastCpuInfo: os.CpuInfo[] | null = null;

  public async poll(): Promise<SystemResources> {
    const cpuUsagePercentage = this.calculateCpuUsage();
    const freeMemoryBytes = os.freemem();
    const totalMemoryBytes = os.totalmem();
    const gpuUtilizationPercentage = await this.getGpuUtilization();

    return {
      cpuUsagePercentage,
      freeMemoryBytes,
      totalMemoryBytes,
      gpuUtilizationPercentage,
    };
  }

  private calculateCpuUsage(): number {
    const currentCpuInfo = os.cpus();
    if (!this.lastCpuInfo) {
      this.lastCpuInfo = currentCpuInfo;
      return 0; // Baseline establishment
    }

    let idleDifference = 0;
    let totalDifference = 0;

    for (let i = 0; i < currentCpuInfo.length; i++) {
      const current = currentCpuInfo[i];
      const previous = this.lastCpuInfo[i];

      const currentTotal =
        current.times.user +
        current.times.nice +
        current.times.sys +
        current.times.idle +
        current.times.irq;

      const previousTotal =
        previous.times.user +
        previous.times.nice +
        previous.times.sys +
        previous.times.idle +
        previous.times.irq;

      totalDifference += currentTotal - previousTotal;
      idleDifference += current.times.idle - previous.times.idle;
    }

    this.lastCpuInfo = currentCpuInfo;

    if (totalDifference === 0) {
      return 0;
    }

    const idlePercentage = idleDifference / totalDifference;
    const usagePercentage = (1 - idlePercentage) * 100;

    return Math.max(0, Math.min(100, usagePercentage));
  }

  private async getGpuUtilization(): Promise<number> {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits'
      );
      const utilization = parseFloat(stdout.trim());
      return isNaN(utilization) ? 0 : Math.max(0, Math.min(100, utilization));
    } catch (error) {
      // Graceful fallback for non-NVIDIA hardware, Mac, or execution failures
      return 0;
    }
  }
}
