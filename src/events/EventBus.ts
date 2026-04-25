import { EventEmitter } from 'events';
import { ThreatEvent, RiskScore } from '../models/ThreatEvent.js';

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Helper methods to emit typed events
  public emitThreat(event: ThreatEvent, risk: RiskScore) {
    this.emit('threat_detected', { event, risk });
  }

  public emitLog(message: string) {
    this.emit('system_log', { message, timestamp: Date.now() });
  }
}
