import React from 'react';
import { Camera as CameraIcon, X, Circle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function Camera({ onCapture, onClose }: CameraProps) {
  const { videoRef, isActive, error, startCamera, stopCamera, captureImage } = useCamera();

  const handleCapture = () => {
    const imageData = captureImage();
    if (imageData) {
      onCapture(imageData);
      stopCamera();
      onClose();
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center">
          <div className="text-red-500 mb-4">
            <CameraIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Camera Access Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-2xl max-h-2xl m-4 flex flex-col">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex-1 relative rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        {isActive && (
          <div className="flex justify-center pt-6">
            <button
              onClick={handleCapture}
              className="p-4 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Circle className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}