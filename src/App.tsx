import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ValidationProgress } from './components/ValidationProgress';
import { ValidationResults } from './components/ValidationResults';
import { createInitialStats, validateEmail } from './utils/validation';
import type { EmailValidationResult, ValidationStats } from './types/email';

function App() {
  const [results, setResults] = useState<EmailValidationResult[]>([]);
  const [stats, setStats] = useState<ValidationStats>(createInitialStats());
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isValidating, setIsValidating] = useState(false);

  const validateEmails = useCallback(async (content: string) => {
    const emails = content
      .split(/[\n,]/)
      .map((email) => email.trim())
      .filter((email) => email);

    if (emails.length > 10000) {
      alert('Maximum limit of 10,000 emails exceeded');
      return;
    }

    setIsValidating(true);
    setProgress({ current: 0, total: emails.length });

    const seen = new Set<string>();
    const validationResults: EmailValidationResult[] = [];
    const stats = createInitialStats();
    stats.total = emails.length;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i].toLowerCase();
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 50));

      const isDuplicate = seen.has(email);
      if (isDuplicate) {
        stats.duplicates++;
      }
      seen.add(email);

      const result = validateEmail(email, isDuplicate);
      validationResults.push(result);

      // Update stats
      if (result.isValid) stats.valid++;
      else stats.invalid++;

      if (result.quality === 'high') stats.highQuality++;
      else if (result.quality === 'medium') stats.mediumQuality++;
      else stats.lowQuality++;

      if (result.details.bounceType === 'hard') stats.hardBounces++;
      if (result.details.bounceType === 'soft') stats.softBounces++;

      setProgress({ current: i + 1, total: emails.length });
    }

    setResults(validationResults);
    setStats(stats);
    setIsValidating(false);
  }, []);

  const handleExport = useCallback(() => {
    const csv = [
      [
        'Email',
        'Status',
        'Quality',
        'Risk Score',
        'Bounce Type',
        'Bounce Reason',
        'Errors',
        'Details',
      ].join(','),
      ...results.map((result) =>
        [
          result.email,
          result.isValid ? 'Valid' : 'Invalid',
          result.quality,
          result.riskScore,
          result.details.bounceType,
          result.details.bounceReason || '',
          result.errors.join('; '),
          Object.entries(result.details)
            .map(([key, value]) => `${key}:${value}`)
            .join('; '),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-validation-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Email Validation System
        </h1>

        {!isValidating && results.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <FileUpload onFileSelect={validateEmails} />
          </div>
        )}

        {isValidating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <ValidationProgress
              current={progress.current}
              total={progress.total}
            />
          </div>
        )}

        {!isValidating && results.length > 0 && (
          <ValidationResults
            results={results}
            stats={stats}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
}

export default App;