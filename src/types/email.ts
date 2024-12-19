export type EmailQuality = 'high' | 'medium' | 'low';
export type BounceType = 'none' | 'hard' | 'soft';

export interface EmailDetails {
  hasMX: boolean;
  isDisposable: boolean;
  isRoleBased: boolean;
  isDuplicate: boolean;
  bounceType: BounceType;
  bounceReason?: string;
}

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  quality: EmailQuality;
  errors: string[];
  riskScore: number;
  details: EmailDetails;
}

export interface ValidationStats {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  highQuality: number;
  mediumQuality: number;
  lowQuality: number;
  hardBounces: number;
  softBounces: number;
}