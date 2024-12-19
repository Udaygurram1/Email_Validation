import { ValidationResult } from '../../types/validation';
import { disposableDomains } from '../data/disposableDomains';

export const validateDisposable = (email: string): ValidationResult => {
  const [, domain] = email.toLowerCase().split('@');
  
  if (disposableDomains.has(domain)) {
    return { 
      isValid: false, 
      reason: 'Disposable email provider',
      quality: 'low'
    };
  }

  return { isValid: true };
};