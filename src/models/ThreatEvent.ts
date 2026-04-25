import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  userId: z.string().min(3).max(50),
  type: z.enum(['LOGIN', 'FILE_ACCESS', 'API_CALL', 'PASSWORD_CHANGE', 'SENSITIVE_ACTION']),
  timestamp: z.number().int().positive(),
  metadata: z.object({
    ip: z.string().ip(),
    userAgent: z.string().min(1),
    location: z.object({
      country: z.string(),
      city: z.string(),
    }).optional(),
    actionValue: z.number().optional(),
    resourceId: z.string().optional(),
  }),
});

export type ThreatEvent = z.infer<typeof EventSchema>;

export interface RiskScore {
  score: number; // 0 to 100
  reasons: string[];
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UserBaseline {
  userId: string;
  typicalIPs: string[];
  typicalCountries: string[];
  lastLogin: number;
  averageVelocity: number; // requests per minute
  activeHours: number[]; // hours of the day (0-23)
}
