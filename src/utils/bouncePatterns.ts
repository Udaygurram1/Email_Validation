// Hard bounce patterns
export const hardBouncePatterns = {
  syntax: [
    /@.*@/,  // Multiple @ symbols
    /[<>]/,  // Contains angle brackets
    /\s/,    // Contains whitespace
    /\.{2,}/, // Multiple consecutive dots
    /^[.-]/, // Starts with dot or hyphen
    /[.-]@/, // Dot or hyphen before @
  ],
  domains: new Set([
    // Known dead domains
    'geocities.com',
    'compuserve.com',
    'netscape.net',
    'aol.com',
    'yahoo.gr',
    'yahoo.co.uk',
    'hotmail.co.uk',
    'yahoo.de',
    'yahoo.dk',
    'yahoo.es',
    'yahoo.fr',
    'yahoo.ie',
    'yahoo.it',
    'yahoo.no',
    'yahoo.pl',
    'yahoo.se',
    'yahoo.com.br',
    'yahoo.com.mx',
    'caramail.com',
    'spray.se',
    'spray.net',
    'swipnet.se',
    'easynet.nl',
  ]),
  patterns: [
    // Invalid or test patterns
    /@example\./i,
    /@test\./i,
    /devnull@/i,
    /nowhere@/i,
    /invalid@/i,
    /spam@/i,
    /abuse@/i,
    /noreply@/i,
    /no-reply@/i,
    /donotreply@/i,
    /do-not-reply@/i,
    /blackhole@/i,
    /void@/i,
    /null@/i,
    /delete@/i,
    /remove@/i,
    /fake@/i,
    /test\d*@/i,
    /sample@/i,
    /example\d*@/i,
  ],
  localParts: new Set([
    'noreply',
    'no-reply',
    'donotreply',
    'do-not-reply',
    'postmaster',
    'mailer-daemon',
    'mailerdaemon',
    'hostmaster',
    'abuse',
    'spam',
    'blackhole',
    'void',
    'null',
    'delete',
    'remove',
  ])
};

// Soft bounce patterns
export const softBouncePatterns = {
  patterns: [
    /^bounce/i,
    /^return/i,
    /^delivery/i,
    /^auto.*reply/i,
    /^notify/i,
    /^notification/i,
    /^list.*owner/i,
    /^owner.*list/i,
    /^subscription/i,
    /^support/i,
    /^feedback/i,
  ],
  localParts: new Set([
    'bounce',
    'return',
    'delivery',
    'autoreply',
    'notify',
    'notification',
    'listowner',
    'ownerlist',
    'subscription',
    'support',
    'feedback',
    'help',
    'info',
    'admin',
    'administrator',
    'webmaster',
  ]),
  temporaryPatterns: [
    /^temp.*\d+/i,
    /^tmp.*\d+/i,
    /^temporary/i,
    /^test.*\d+/i,
    /^demo.*\d+/i,
  ]
};