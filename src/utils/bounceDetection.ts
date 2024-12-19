import { BounceType } from '../types/email';
import { hardBouncePatterns, softBouncePatterns } from './bouncePatterns';

interface BounceCheck {
  type: BounceType;
  reason?: string;
}

const parseEmail = (email: string): { localPart: string; domain: string | undefined } => {
  const parts = email.toLowerCase().split('@');
  return {
    localPart: parts[0] || '',
    domain: parts[1],
  };
};

const checkSyntaxPatterns = (email: string): boolean => {
  return hardBouncePatterns.syntax.some(pattern => pattern.test(email));
};

const isDeadDomain = (domain: string): boolean => {
  return hardBouncePatterns.domains.has(domain.toLowerCase());
};

const isHardBouncePattern = (email: string): boolean => {
  return hardBouncePatterns.patterns.some(pattern => pattern.test(email));
};

const isHardBounceLocalPart = (localPart: string): boolean => {
  return hardBouncePatterns.localParts.has(localPart.toLowerCase());
};

const isSoftBouncePattern = (email: string): boolean => {
  return softBouncePatterns.patterns.some(pattern => pattern.test(email));
};

const isSoftBounceLocalPart = (localPart: string): boolean => {
  return softBouncePatterns.localParts.has(localPart.toLowerCase());
};

const isTemporaryPattern = (email: string): boolean => {
  return softBouncePatterns.temporaryPatterns.some(pattern => pattern.test(email));
};

export const checkBounceStatus = (email: string): BounceCheck => {
  if (!email.includes('@')) {
    return { type: 'hard', reason: 'Missing @ symbol' };
  }

  const { localPart, domain } = parseEmail(email);

  // Check syntax-based hard bounces
  if (checkSyntaxPatterns(email)) {
    return { type: 'hard', reason: 'Invalid email syntax' };
  }

  // Check for dead domains
  if (domain && isDeadDomain(domain)) {
    return { type: 'hard', reason: 'Dead or inactive domain' };
  }

  // Check for hard bounce patterns
  if (isHardBouncePattern(email)) {
    return { type: 'hard', reason: 'Invalid email pattern' };
  }

  // Check for hard bounce local parts
  if (isHardBounceLocalPart(localPart)) {
    return { type: 'hard', reason: 'System email address' };
  }

  // Check for potential mailbox issues
  if (localPart.length > 64) {
    return { type: 'hard', reason: 'Local part exceeds maximum length' };
  }

  if (!domain) {
    return { type: 'hard', reason: 'Missing domain' };
  }

  // Check for soft bounce patterns
  if (isSoftBouncePattern(email)) {
    return { type: 'soft', reason: 'System or automated email address' };
  }

  // Check for soft bounce local parts
  if (isSoftBounceLocalPart(localPart)) {
    return { type: 'soft', reason: 'Role-based email address' };
  }

  // Check for temporary patterns
  if (isTemporaryPattern(email)) {
    return { type: 'soft', reason: 'Temporary email pattern' };
  }

  return { type: 'none' };
};