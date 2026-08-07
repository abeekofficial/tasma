import { z } from 'zod';
import { AppError } from '@/shared/errors/app-error';

/**
 * Status transition matrix defining valid state transitions for render jobs.
 * Each key is a source status, and the value is an array of valid target statuses.
 */
const STATUS_TRANSITIONS: Record<string, string[]> = {
  QUEUED:     ['ASSIGNED', 'CANCELLED', 'TIMED_OUT'],
  ASSIGNED:   ['PROCESSING', 'QUEUED', 'CANCELLED', 'TIMED_OUT'],
  PROCESSING: ['ENCODING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'],
  ENCODING:   ['UPLOADING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'],
  UPLOADING:  ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'],
  COMPLETED:  [],
  FAILED:     ['QUEUED'],
  CANCELLED:  ['QUEUED'],
  TIMED_OUT:  ['QUEUED'],
};

const ALL_STATUSES = [
  'QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING',
  'UPLOADING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT',
] as const;

const ALL_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;

const ALL_TYPES = ['PREVIEW', 'EXPORT', 'THUMBNAIL', 'SOCIAL_PUBLISH'] as const;

const PRIORITY_WEIGHT: Record<string, number> = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
  URGENT: 3,
};

/**
 * Validates render queue business rules.
 * Enforces status transitions, priority rules, retry limits, and duplicate prevention.
 */
export class QueueValidator {
  /**
   * Validates that a status transition is allowed.
   * Throws AppError.badRequest if the transition is invalid.
   */
  public validateStatusTransition(currentStatus: string, targetStatus: string): void {
    if (!STATUS_TRANSITIONS[currentStatus]) {
      throw AppError.badRequest(`Unknown current status: ${currentStatus}`);
    }

    const allowedTransitions = STATUS_TRANSITIONS[currentStatus];

    if (allowedTransitions.length === 0) {
      throw AppError.conflict(
        `Job in status ${currentStatus} is in a terminal state and cannot be transitioned`
      );
    }

    if (!allowedTransitions.includes(targetStatus)) {
      throw AppError.badRequest(
        `Invalid status transition from ${currentStatus} to ${targetStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ')}`
      );
    }
  }

  /**
   * Validates that a job can be retried based on its current retry count and max retries.
   */
  public validateRetryEligibility(
    currentStatus: string,
    retryCount: number,
    maxRetries: number
  ): void {
    const retryableStatuses = ['FAILED', 'CANCELLED', 'TIMED_OUT'];

    if (!retryableStatuses.includes(currentStatus)) {
      throw AppError.conflict(
        `Cannot retry a job with status ${currentStatus}. ` +
        `Only jobs in status ${retryableStatuses.join(', ')} can be retried.`
      );
    }

    if (retryCount >= maxRetries) {
      throw AppError.conflict(
        `Maximum retry count (${maxRetries}) reached. Current retries: ${retryCount}.`
      );
    }
  }

  /**
   * Validates that a job can be cancelled.
   */
  public validateCancellation(currentStatus: string): void {
    const cancellableStatuses = ['QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'];

    if (!cancellableStatuses.includes(currentStatus)) {
      throw AppError.conflict(
        `Cannot cancel a job with status ${currentStatus}. ` +
        `Only jobs in status ${cancellableStatuses.join(', ')} can be cancelled.`
      );
    }
  }

  /**
   * Validates that a job can be paused.
   */
  public validatePause(currentStatus: string): void {
    const pausableStatuses = ['QUEUED', 'ASSIGNED'];

    if (!pausableStatuses.includes(currentStatus)) {
      throw AppError.conflict(
        `Cannot pause a job with status ${currentStatus}. ` +
        `Only jobs in status ${pausableStatuses.join(', ')} can be paused.`
      );
    }
  }

  /**
   * Validates that a job can be resumed.
   */
  public validateResume(currentStatus: string): void {
    const resumableStatuses = ['CANCELLED'];

    if (!resumableStatuses.includes(currentStatus)) {
      throw AppError.conflict(
        `Cannot resume a job with status ${currentStatus}. ` +
        `Only jobs in status ${resumableStatuses.join(', ')} can be resumed.`
      );
    }
  }

  /**
   * Validates priority escalation or de-escalation.
   * Returns the numeric weight of the new priority.
   */
  public validatePriorityChange(currentPriority: string, newPriority: string): number {
    if (!(currentPriority in PRIORITY_WEIGHT)) {
      throw AppError.badRequest(`Unknown current priority: ${currentPriority}`);
    }
    if (!(newPriority in PRIORITY_WEIGHT)) {
      throw AppError.badRequest(`Unknown target priority: ${newPriority}`);
    }
    return PRIORITY_WEIGHT[newPriority];
  }

  /**
   * Checks for duplicate jobs: same project, same type, and same non-terminal status.
   * Returns true if a duplicate is found.
   */
  public isDuplicateJobCandidate(
    existingJobs: Array<{ type: string; status: string; projectId: string }>,
    newType: string,
    newProjectId: string
  ): boolean {
    const terminalStatuses = ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'];

    return existingJobs.some(
      (job) =>
        job.projectId === newProjectId &&
        job.type === newType &&
        !terminalStatuses.includes(job.status)
    );
  }

  /**
   * Returns the set of valid transitions from a given status.
   */
  public getValidTransitions(currentStatus: string): string[] {
    return STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Returns true if the status is terminal (no further transitions possible).
   */
  public isTerminalStatus(status: string): boolean {
    const transitions = STATUS_TRANSITIONS[status];
    return !transitions || transitions.length === 0;
  }

  /**
   * Returns true if the status indicates the job is actively processing.
   */
  public isActiveStatus(status: string): boolean {
    return ['ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'].includes(status);
  }
}

export const queueValidator = new QueueValidator();
