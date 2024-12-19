import { EmailValidationResult, ValidationStats } from '../types/email';
import { validateEmailSyntax, isRoleBasedEmail, calculateEmailQuality, calculateRiskScore } from './emailValidation';
import { checkBounceStatus } from './bounceDetection';

export const createInitialStats = (): ValidationStats => ({
  total: 0,
  valid: 0,
  invalid: 0,
  duplicates: 0,
  highQuality: 0,
  mediumQuality: 0,
  lowQuality: 0,
  hardBounces: 0,
  softBounces: 0,
});

export const validateEmail = (
  email: string,
  isDuplicate: boolean
): EmailValidationResult => {
  const isValid = validateEmailSyntax(email);
  const hasMX = isValid; // In production, this would be an API call
  const isDisposable = email.toLowerCase().includes('temp') || 
                      email.toLowerCase().includes('disposable');
  const isRoleBased = isRoleBasedEmail(email);
  const bounceCheck = checkBounceStatus(email);

  const quality = calculateEmailQuality(
    hasMX,
    isDisposable,
    isRoleBased,
    bounceCheck.type
  );

  const riskScore = calculateRiskScore(
    hasMX,
    isDisposable,
    isRoleBased,
    bounceCheck.type
  );

  const errors: string[] = [];
  if (!isValid) errors.push('Invalid email format');
  if (bounceCheck.reason) errors.push(bounceCheck.reason);

  return {
    email,
    isValid,
    quality,
    riskScore,
    errors,
    details: {
      hasMX,
      isDisposable,
      isRoleBased,
      isDuplicate,
      bounceType: bounceCheck.type,
      bounceReason: bounceCheck.reason,
    },
  };
};