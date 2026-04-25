import { ThreatEvent, RiskScore } from '../models/ThreatEvent.js';
import { ThreatAnalyzer } from './Analyzer.js';
import { BaselineManager } from './BaselineManager.js';
import { EventBus } from '../events/EventBus.js';

export class DetectionSystem {
  private baselineManager: BaselineManager;
  private eventBus: EventBus;

  constructor() {
    this.baselineManager = new BaselineManager();
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Processes an incoming event, analyzes it, and reacts.
   */
  public async processEvent(event: ThreatEvent): Promise<RiskScore> {
    const baseline = this.baselineManager.getBaseline(event.userId);
    
    // Analyze the event
    const riskScore = ThreatAnalyzer.analyze(event, baseline);

    // If risk is low, we "learn" from this behavior as trusted
    if (riskScore.level === 'LOW') {
      this.baselineManager.updateBaseline(event);
    }

    // Always record activity for velocity tracking
    this.baselineManager.recordActivity(event.userId, event.timestamp);

    // Emit event for real-time monitoring/action
    this.eventBus.emitThreat(event, riskScore);

    // Log action
    console.log(`[Event Processed] User: ${event.userId} | Risk: ${riskScore.level} (${riskScore.score})`);
    if (riskScore.reasons.length > 0) {
      console.log(`Reasons: ${riskScore.reasons.join(', ')}`);
    }

    return riskScore;
  }
}
