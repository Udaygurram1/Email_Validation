import { EmailQuality, BounceType } from '../types/email';

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

const ROLE_BASED_PREFIXES = new Set([
  'admin',
  'info',
  'support',
  'sales',
  'contact',
  'help',
  'billing',
  'marketing',
  'webmaster',
  'hostmaster',
  'postmaster',
]);

export const validateEmailSyntax = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const isRoleBasedEmail = (email: string): boolean => {
  const [localPart = ''] = email.split('@');
  const normalizedLocal = localPart.toLowerCase();
  return Array.from(ROLE_BASED_PREFIXES).some(prefix => 
    normalizedLocal.includes(prefix)
  );
};

export const calculateEmailQuality = (
  hasMX: boolean,
  isDisposable: boolean,
  isRoleBased: boolean,
  bounceType: BounceType
): EmailQuality => {
  if (!hasMX || isDisposable || bounceType === 'hard') return 'low';
  if (isRoleBased || bounceType === 'soft') return 'medium';
  return 'high';
};

export const calculateRiskScore = (
  hasMX: boolean,
  isDisposable: boolean,
  isRoleBased: boolean,
  bounceType: BounceType
): number => {
  let score = 100;
  
  if (!hasMX) score -= 40;
  if (isDisposable) score -= 30;
  if (isRoleBased) score -= 15;
  
  // Bounce-related deductions
  if (bounceType === 'hard') score -= 50;
  if (bounceType === 'soft') score -= 25;
  
  return Math.max(0, score);
};