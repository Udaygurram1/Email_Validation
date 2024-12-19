import React from 'react';
import { Download, CheckCircle, XCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { EmailValidationResult, ValidationStats } from '../types/email';

interface ValidationResultsProps {
  results: EmailValidationResult[];
  stats: ValidationStats;
  onExport: () => void;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  results,
  stats,
  onExport,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Validation Results</h2>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700">Valid</span>
          </div>
          <p className="text-2xl font-bold text-green-800">{stats.valid}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">Invalid</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{stats.invalid}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700">Duplicates</span>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{stats.duplicates}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertOctagon className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">Hard Bounces</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{stats.hardBounces}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-orange-700">Soft Bounces</span>
          </div>
          <p className="text-2xl font-bold text-orange-800">{stats.softBounces}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bounce Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.isValid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.quality === 'high'
                        ? 'bg-green-100 text-green-800'
                        : result.quality === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.quality.charAt(0).toUpperCase() + result.quality.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.details.bounceType === 'none'
                        ? 'bg-green-100 text-green-800'
                        : result.details.bounceType === 'soft'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.details.bounceType === 'none'
                      ? 'None'
                      : `${result.details.bounceType.charAt(0).toUpperCase()}${result.details.bounceType.slice(1)} Bounce`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {result.riskScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};