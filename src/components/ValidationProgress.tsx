import React from 'react';
import { Loader2 } from 'lucide-react';

interface ValidationProgressProps {
  current: number;
  total: number;
}

export const ValidationProgress: React.FC<ValidationProgressProps> = ({
  current,
  total,
}) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          Validating emails...
        </span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        Processed {current} of {total} emails
      </div>
    </div>
  );
};