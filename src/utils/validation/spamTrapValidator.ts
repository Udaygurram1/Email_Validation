import { ValidationResult } from '../../types/validation';
import { spamTrapPatterns } from '../data/spamTraps';

export const validateSpamTrap = (email: string): ValidationResult => {
  const normalizedEmail = email.toLowerCase();
  
  for (const pattern of spamTrapPatterns) {
    if (pattern.test(normalizedEmail)) {
      return { 
        isValid: false, 
        reason: 'Potential spam trap detected',
        quality: 'low',
        risk: 'high'
      };
    }
  }

  return { isValid: true };
};