import { ValidationResult } from '../../types/validation';

// RFC 5322 compliant email regex
const RFC_5322_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

// Additional syntax checks
const INVALID_PATTERNS = [
  /\.{2,}/, // Consecutive dots
  /[@.]$/, // Ends with @ or dot
  /^[.-]/, // Starts with dot or hyphen
  /[.-]@/, // Dot or hyphen before @
];

export const validateSyntax = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, reason: 'Email is empty' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!RFC_5322_REGEX.test(normalizedEmail)) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  for (const pattern of INVALID_PATTERNS) {
    if (pattern.test(normalizedEmail)) {
      return { isValid: false, reason: 'Contains invalid characters or patterns' };
    }
  }

  const [localPart, domain] = normalizedEmail.split('@');

  if (localPart.length > 64) {
    return { isValid: false, reason: 'Local part exceeds 64 characters' };
  }

  if (domain.length > 255) {
    return { isValid: false, reason: 'Domain exceeds 255 characters' };
  }

  return { isValid: true };
};