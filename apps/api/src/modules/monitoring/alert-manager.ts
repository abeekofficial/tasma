import { AlertDefinition, ActiveAlert } from './monitoring.types';
import { v4 as uuid } from 'uuid';
import { AppError } from '@/shared/errors/app-error';

/**
 * Manages the registration of alert definitions and evaluates metrics against them to manage active alerts.
 */
export class AlertManager {
  private readonly definitions: Map<string, AlertDefinition> = new Map();
  private readonly activeAlerts: Map<string, ActiveAlert> = new Map();

  /**
   * Registers a new alert definition.
   * @param def The alert definition to register.
   */
  public registerDefinition(def: AlertDefinition): void {
    this.definitions.set(def.id, def);
  }

  /**
   * Retrieves all registered alert definitions.
   * @returns An array of all alert definitions.
   */
  public getDefinitions(): AlertDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * Evaluates a metric value against a specific alert definition's threshold.
   * Triggers or resolves alerts based on the evaluation.
   * @param definitionId The ID of the alert definition to evaluate against.
   * @param value The value to evaluate.
   * @param triggeredAt The timestamp of when this evaluation occurred.
   */
  public evaluateCondition(definitionId: string, value: number, triggeredAt: Date): void {
    const definition = this.definitions.get(definitionId);

    if (!definition) {
      throw AppError.notFound(`Alert definition with id ${definitionId}`);
    }

    if (value >= definition.threshold) {
      if (!this.activeAlerts.has(definitionId)) {
        const newAlert: ActiveAlert = {
          id: uuid(),
          definitionId: definition.id,
          name: definition.name,
          severity: definition.severity,
          message: `${definition.name} triggered. Value ${value} exceeded threshold ${definition.threshold}.`,
          triggerValue: value,
          triggeredAt: triggeredAt,
        };
        this.activeAlerts.set(definitionId, newAlert);
      } else {
        const existingAlert = this.activeAlerts.get(definitionId)!;
        existingAlert.triggerValue = value;
        existingAlert.message = `${definition.name} triggered. Value ${value} exceeded threshold ${definition.threshold}.`;
      }
    } else {
      if (this.activeAlerts.has(definitionId)) {
        this.activeAlerts.delete(definitionId);
      }
    }
  }

  /**
   * Retrieves all currently active alerts.
   * @returns An array of active alerts.
   */
  public getActiveAlerts(): ActiveAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Retrieves a specific active alert by its alert ID.
   * @param id The ID of the active alert to retrieve.
   * @returns The active alert or undefined if not found.
   */
  public getAlert(id: string): ActiveAlert | undefined {
    for (const alert of this.activeAlerts.values()) {
      if (alert.id === id) {
        return alert;
      }
    }
    return undefined;
  }

  /**
   * Clears all active alerts.
   */
  public clearAlerts(): void {
    this.activeAlerts.clear();
  }
}

export const alertManager = new AlertManager();
