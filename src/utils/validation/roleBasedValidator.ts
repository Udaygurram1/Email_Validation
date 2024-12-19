import { ValidationResult } from '../../types/validation';
import { roleBasedPrefixes } from '../data/emailPrefixes';

export const validateRoleBased = (email: string): ValidationResult => {
  const [localPart] = email.toLowerCase().split('@');
  
  for (const prefix of roleBasedPrefixes) {
    if (localPart.startsWith(prefix) || localPart.endsWith(prefix) || localPart === prefix) {
      return { 
        isValid: false, 
        reason: 'Role-based email address',
        quality: 'low'
      };
    }
  }

  return { isValid: true };
};