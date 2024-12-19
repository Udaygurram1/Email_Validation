export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  quality?: 'high' | 'medium' | 'low';
  risk?: 'high' | 'medium' | 'low';
  temporary?: boolean;
  hardBounce?: boolean;
  softBounce?: boolean;
  riskScore?: number;
  riskFactors?: string[];
}