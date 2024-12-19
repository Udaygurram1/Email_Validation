import { ValidationResult } from '../../types/validation';
import { validateSyntax } from './syntaxValidator';
import { validateDomain } from './domainValidator';
import { validateSMTP } from './smtpValidator';
import { validateRoleBased } from './roleBasedValidator';
import { validateDisposable } from './disposableValidator';
import { validateSpamTrap } from './spamTrapValidator';
import { validateCatchAll } from './catchAllValidator';
import { calculateRiskScore } from './riskScorer';

export const validateEmail = async (email: string): Promise<ValidationResult> => {
  const results: ValidationResult[] = [];

  // Perform all validations
  results.push(validateSyntax(email));
  
  const [, domain] = email.split('@');
  if (domain) {
    results.push(await validateDomain(domain));
    results.push(await validateCatchAll(domain));
  }
  
  results.push(await validateSMTP(email));
  results.push(validateRoleBased(email));
  results.push(validateDisposable(email));
  results.push(validateSpamTrap(email));

  // Calculate final risk score
  const { score, factors, isValid } = calculateRiskScore(results);

  // Combine all validation results
  const finalResult: ValidationResult = {
    isValid,
    riskScore: score,
    riskFactors: factors,
    reason: factors.join(', '),
    quality: score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low',
    hardBounce: results.some(r => r.hardBounce),
    softBounce: results.some(r => r.softBounce),
    temporary: results.some(r => r.temporary)
  };

  return finalResult;
};