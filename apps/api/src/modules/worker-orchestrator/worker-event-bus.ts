import { EventEmitter } from 'events';
import { WorkerEvent, WorkerEventType } from './worker.types';

/**
 * Typed event bus for worker orchestrator events.
 * Provides type-safe emit/on/off methods and event history tracking.
 */
export class WorkerEventBus {
  private readonly emitter: EventEmitter;
  private readonly eventHistory: WorkerEvent[];
  private readonly maxHistorySize: number;

  /**
   * Creates a new instance of WorkerEventBus.
   *
   * @param maxHistorySize - Maximum number of historical events to retain in memory (default: 1000)
   */
  constructor(maxHistorySize: number = 1000) {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
    this.eventHistory = [];
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Emits a worker event to all registered listeners and pushes it to history.
   * Trims historical events if maxHistorySize is exceeded.
   *
   * @param event - The worker event to emit
   */
  public emit(event: WorkerEvent): void {
    this.emitter.emit(event.type, event);

    this.eventHistory.push(event);

    if (this.maxHistorySize > 0 && this.eventHistory.length > this.maxHistorySize) {
      const overflowCount = this.eventHistory.length - this.maxHistorySize;
      this.eventHistory.splice(0, overflowCount);
    }
  }

  /**
   * Registers an event handler for a specific worker event type.
   *
   * @param eventType - The event type to subscribe to
   * @param handler - Callback function invoked when event is emitted
   */
  public on(eventType: WorkerEventType, handler: (event: WorkerEvent) => void): void {
    this.emitter.on(eventType, handler);
  }

  /**
   * Unregisters an event handler for a specific worker event type.
   *
   * @param eventType - The event type to unsubscribe from
   * @param handler - Callback function to remove
   */
  public off(eventType: WorkerEventType, handler: (event: WorkerEvent) => void): void {
    this.emitter.off(eventType, handler);
  }

  /**
   * Registers a one-time event handler for a specific worker event type.
   *
   * @param eventType - The event type to subscribe to once
   * @param handler - Callback function invoked on next occurrence of event
   */
  public once(eventType: WorkerEventType, handler: (event: WorkerEvent) => void): void {
    this.emitter.once(eventType, handler);
  }

  /**
   * Retrieves event history, optionally filtered by event type and limited by count.
   *
   * @param eventType - Optional worker event type to filter by
   * @param limit - Optional maximum number of recent events to return
   * @returns Array of matching WorkerEvent objects
   */
  public getHistory(eventType?: WorkerEventType, limit?: number): WorkerEvent[] {
    let history = eventType
      ? this.eventHistory.filter((event: WorkerEvent) => event.type === eventType)
      : [...this.eventHistory];

    if (limit !== undefined && limit > 0) {
      history = history.slice(-limit);
    }

    return history;
  }

  /**
   * Clears the event history buffer.
   */
  public clearHistory(): void {
    this.eventHistory.length = 0;
  }

  /**
   * Gets the active listener count for a specific worker event type.
   *
   * @param eventType - The worker event type
   * @returns Number of active listeners
   */
  public getListenerCount(eventType: WorkerEventType): number {
    return this.emitter.listenerCount(eventType);
  }

  /**
   * Removes all registered listeners for a specific event type or all event types if omitted.
   *
   * @param eventType - Optional event type to remove listeners for
   */
  public removeAllListeners(eventType?: WorkerEventType): void {
    this.emitter.removeAllListeners(eventType);
  }
}

export const workerEventBus = new WorkerEventBus();
