interface RiskFactor {
  name: string;
  score: number;
}

const RISK_FACTORS: Record<string, RiskFactor> = {
  // Critical Issues (-100 points each, makes email invalid)
  HARD_BOUNCE: { name: 'Hard bounce detected', score: -100 },
  SOFT_BOUNCE: { name: 'Soft bounce detected', score: -100 }, // Updated to critical
  SYNTAX_ERROR: { name: 'Invalid email syntax', score: -100 },
  DEAD_DOMAIN: { name: 'Dead or inactive domain', score: -100 },
  SPAM_TRAP: { name: 'Potential spam trap', score: -100 },

  // Major Issues (-50 points each)
  DISPOSABLE_DOMAIN: { name: 'Disposable email provider', score: -50 },
  NO_MX_RECORD: { name: 'Missing MX record', score: -50 },

  // Moderate Issues (-25 points each)
  ROLE_BASED: { name: 'Role-based email', score: -25 },
  CATCH_ALL_DOMAIN: { name: 'Catch-all domain', score: -25 },
  TEMPORARY_FAILURE: { name: 'Temporary validation failure', score: -25 },

  // Positive Factors (+10 points each)
  VALID_SYNTAX: { name: 'Valid email syntax', score: 10 },
  ACTIVE_DOMAIN: { name: 'Active domain', score: 10 },
  VALID_MX: { name: 'Valid MX records', score: 10 },
};

export const calculateRiskScore = (validationResults: ValidationResult[]): {
  score: number;
  factors: string[];
  isValid: boolean;
} => {
  let score = 100;
  const factors: string[] = [];

  // Process all validation results
  for (const result of validationResults) {
    // Critical issues make the email invalid immediately
    if (result.hardBounce || result.softBounce) { // Check both bounce types
      factors.push(result.hardBounce ? RISK_FACTORS.HARD_BOUNCE.name : RISK_FACTORS.SOFT_BOUNCE.name);
      score += result.hardBounce ? RISK_FACTORS.HARD_BOUNCE.score : RISK_FACTORS.SOFT_BOUNCE.score;
    }

    if (!result.isValid && result.reason?.includes('syntax')) {
      factors.push(RISK_FACTORS.SYNTAX_ERROR.name);
      score += RISK_FACTORS.SYNTAX_ERROR.score;
    }

    if (result.reason?.includes('inactive domain')) {
      factors.push(RISK_FACTORS.DEAD_DOMAIN.name);
      score += RISK_FACTORS.DEAD_DOMAIN.score;
    }

    if (result.risk === 'high' && result.reason?.includes('spam trap')) {
      factors.push(RISK_FACTORS.SPAM_TRAP.name);
      score += RISK_FACTORS.SPAM_TRAP.score;
    }

    // Major issues
    if (result.reason?.includes('Disposable')) {
      factors.push(RISK_FACTORS.DISPOSABLE_DOMAIN.name);
      score += RISK_FACTORS.DISPOSABLE_DOMAIN.score;
    }

    if (result.reason?.includes('no valid mail servers')) {
      factors.push(RISK_FACTORS.NO_MX_RECORD.name);
      score += RISK_FACTORS.NO_MX_RECORD.score;
    }

    // Moderate issues
    if (result.reason?.includes('Role-based')) {
      factors.push(RISK_FACTORS.ROLE_BASED.name);
      score += RISK_FACTORS.ROLE_BASED.score;
    }

    if (result.reason?.includes('Catch-all')) {
      factors.push(RISK_FACTORS.CATCH_ALL_DOMAIN.name);
      score += RISK_FACTORS.CATCH_ALL_DOMAIN.score;
    }

    if (result.temporary) {
      factors.push(RISK_FACTORS.TEMPORARY_FAILURE.name);
      score += RISK_FACTORS.TEMPORARY_FAILURE.score;
    }

    // Positive factors
    if (result.isValid) {
      factors.push(RISK_FACTORS.VALID_SYNTAX.name);
      score += RISK_FACTORS.VALID_SYNTAX.score;
    }
  }

  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));

  // Email is considered invalid if:
  // 1. Score is below 50
  // 2. Has any critical issues
  // 3. Has any bounce (hard or soft)
  const isValid = score >= 50 && !factors.some(factor => 
    [
      RISK_FACTORS.HARD_BOUNCE.name,
      RISK_FACTORS.SOFT_BOUNCE.name,
      RISK_FACTORS.SYNTAX_ERROR.name,
      RISK_FACTORS.DEAD_DOMAIN.name,
      RISK_FACTORS.SPAM_TRAP.name
    ].includes(factor)
  );

  return {
    score,
    factors,
    isValid
  };
};