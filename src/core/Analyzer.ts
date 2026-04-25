import { ThreatEvent, UserBaseline, RiskScore } from '../models/ThreatEvent.js';

export class ThreatAnalyzer {
  private static readonly WEIGHTS = {
    GEOGRAPHIC_ANOMALY: 40,
    VELOCITY_ANOMALY: 30,
    TEMPORAL_ANOMALY: 20,
    PATTERN_ANOMALY: 10,
  };

  /**
   * Analyzes an event against a user's baseline and returns a Risk Score.
   */
  public static analyze(event: ThreatEvent, baseline: UserBaseline): RiskScore {
    let score = 0;
    const reasons: string[] = [];

    // 1. Geographic Anomaly
    if (event.metadata.location) {
      if (baseline.typicalCountries.length > 0 && !baseline.typicalCountries.includes(event.metadata.location.country)) {
        score += this.WEIGHTS.GEOGRAPHIC_ANOMALY;
        reasons.push(`Login from unusual country: ${event.metadata.location.country}`);
      } else if (baseline.typicalCountries.length === 0) {
        reasons.push(`Initial location established: ${event.metadata.location.country}`);
      }
    }

    // 2. Velocity Anomaly (Time since last event)
    if (baseline.lastLogin > 0) {
      const timeSinceLastAction = event.timestamp - baseline.lastLogin;
      if (timeSinceLastAction < 1000) { // Less than 1 second since last action
        score += this.WEIGHTS.VELOCITY_ANOMALY;
        reasons.push('High-frequency access detected (potential bot/automation)');
      }
    }

    // 3. Temporal Anomaly (Check if active hours match)
    const currentHour = new Date(event.timestamp).getHours();
    if (baseline.activeHours.length > 0 && !baseline.activeHours.includes(currentHour)) {
      score += this.WEIGHTS.TEMPORAL_ANOMALY;
      reasons.push(`Action at unusual hour: ${currentHour}:00`);
    }

    // 4. IP Anomaly
    if (!baseline.typicalIPs.includes(event.metadata.ip)) {
      score += 5; // Minor bump for new IP
      reasons.push('Access from new IP address');
    }

    // Determine level
    let level: RiskScore['level'] = 'LOW';
    if (score >= 80) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 20) level = 'MEDIUM';

    return {
      score: Math.min(score, 100),
      reasons,
      level,
    };
  }
}
