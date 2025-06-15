import React from 'react';
import { ImageClassifier } from './components/ImageClassifier';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  // Initialize theme hook to ensure dark mode is applied on load
  useTheme();

  return (
    <div className="relative">
      <ThemeToggle />
      <ImageClassifier />
    </div>
  );
}

export default App;