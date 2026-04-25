import crypto from 'crypto';

export class SecurityUtils {
  /**
   * Validates an API Key against the environment configuration.
   */
  public static validateApiKey(apiKey: string | undefined): boolean {
    const validKey = process.env.API_KEY;
    if (!validKey || !apiKey) return false;
    
    // Constant time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(apiKey),
      Buffer.from(validKey)
    );
  }

  /**
   * Generates a signature for a payload using a secret.
   * Useful for ensuring data integrity between systems.
   */
  public static signPayload(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Validates a payload signature.
   */
  public static verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.signPayload(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Sanitizes sensitive data for logging.
   * Example: Masking IP addresses.
   */
  public static maskIP(ip: string): string {
    return ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.X.X');
  }
}
