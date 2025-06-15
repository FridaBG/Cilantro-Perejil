import React, { useState } from 'react';
import { Camera as CameraIcon, Leaf, AlertTriangle } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { Camera } from './Camera';
import { ResultDisplay } from './ResultDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { classifyImage } from '../utils/classify';
import { ClassificationResult } from '../types';

type AppState = 'idle' | 'camera' | 'processing' | 'result' | 'error';

export function ImageClassifier() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = async (imageData: string) => {
    setSelectedImage(imageData);
    setState('processing');
    setError(null);

    try {
      const classification = await classifyImage(imageData);
      setResult(classification);
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setError(null);
    setSelectedImage(null);
  };

  const handleCameraCapture = (imageData: string) => {
    handleImageSelect(imageData);
  };

  const isCameraSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

  if (state === 'camera') {
    return (
      <Camera
        onCapture={handleCameraCapture}
        onClose={() => setState('idle')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
              <Leaf className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Herb Identifier
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Can't tell if it's parsley or cilantro? We got you 🍃
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {state === 'idle' && (
            <div className="space-y-4">
              <ImageUpload onImageSelect={handleImageSelect} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-emerald-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              {isCameraSupported ? (
                <button
                  onClick={() => setState('camera')}
                  className="w-full px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <CameraIcon className="w-6 h-6" />
                    <span className="font-medium">Use Camera</span>
                  </div>
                </button>
              ) : (
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Camera not supported on this device
                  </p>
                </div>
              )}
            </div>
          )}

          {state === 'processing' && (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" message="Analyzing your herb..." />
            </div>
          )}

          {state === 'result' && result && (
            <ResultDisplay result={result} onReset={handleReset} />
          )}

          {state === 'error' && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm mb-4">
                  {error || 'Could not detect leaf, try again!'}
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}