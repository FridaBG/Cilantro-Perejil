import React from 'react';
import { CheckCircle, XCircle, Leaf, AlertCircle } from 'lucide-react';
import { ClassificationResult } from '../types';
import { herbFacts } from '../utils/classify';

interface ResultDisplayProps {
  result: ClassificationResult;
  onReset: () => void;
}

export function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const isHighConfidence = result.confidence >= 0.7;
  const confidencePercentage = Math.round(result.confidence * 100);
  
  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="mb-4">
          {isHighConfidence ? (
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          ) : (
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isHighConfidence ? "It's" : "Probably"} {result.label.charAt(0).toUpperCase() + result.label.slice(1)}!
        </h2>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {confidencePercentage}% confident
          </span>
        </div>
        
        {!isHighConfidence && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
            Low confidence - you might want to try another photo
          </p>
        )}
      </div>
      
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center">
          <Leaf className="w-4 h-4 mr-2" />
          Did you know?
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {herbFacts[result.label]}
        </p>
      </div>
      
      <button
        onClick={onReset}
        className="w-full px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Try Another Image
      </button>
    </div>
  );
}