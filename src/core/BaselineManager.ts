import { UserBaseline, ThreatEvent } from '../models/ThreatEvent.js';

export class BaselineManager {
  private baselines: Map<string, UserBaseline> = new Map();

  public getBaseline(userId: string): UserBaseline {
    if (!this.baselines.has(userId)) {
      // Create a default baseline for new users (cold start)
      this.baselines.set(userId, {
        userId,
        typicalIPs: [],
        typicalCountries: [],
        lastLogin: 0, // Set to 0 to indicate no previous login
        averageVelocity: 0,
        activeHours: [],
      });
    }
    return this.baselines.get(userId)!;
  }

  /**
   * Records the timestamp of an activity, regardless of risk.
   * Crucial for velocity detection.
   */
  public recordActivity(userId: string, timestamp: number) {
    const baseline = this.getBaseline(userId);
    baseline.lastLogin = timestamp;
    this.baselines.set(userId, baseline);
  }

  /**
   * Updates the behavior profile based on a trusted event.
   */
  public updateBaseline(event: ThreatEvent) {
    const baseline = this.getBaseline(event.userId);

    // Update IPs (keep last 5)
    if (!baseline.typicalIPs.includes(event.metadata.ip)) {
      baseline.typicalIPs.push(event.metadata.ip);
      if (baseline.typicalIPs.length > 5) baseline.typicalIPs.shift();
    }

    // Update Countries
    if (event.metadata.location && !baseline.typicalCountries.includes(event.metadata.location.country)) {
      baseline.typicalCountries.push(event.metadata.location.country);
      if (baseline.typicalCountries.length > 3) baseline.typicalCountries.shift();
    }

    // Update Active Hours
    const hour = new Date(event.timestamp).getHours();
    if (!baseline.activeHours.includes(hour)) {
      baseline.activeHours.push(hour);
    }

    this.baselines.set(event.userId, baseline);
  }
}
