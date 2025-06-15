import { ApiResponse, ClassificationResult } from '../types';

export async function classifyImage(imageData: string): Promise<ClassificationResult> {
  try {
    // Convert base64 to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');

    const apiResponse = await fetch('/api/classify-image', {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResponse.status}`);
    }

    const result: ApiResponse = await apiResponse.json();
    
    return {
      label: result.label.toLowerCase() as 'parsley' | 'cilantro',
      confidence: result.confidence
    };
  } catch (error) {
    console.error('Classification error:', error);
    throw new Error('Failed to classify image. Please try again.');
  }
}

export const herbFacts = {
  parsley: "Parsley is rich in vitamins A, C, and K! It's been used for over 2,000 years and was once considered sacred by the ancient Greeks.",
  cilantro: "Cilantro contains natural antibacterial compounds! Fun fact: some people have a genetic variant that makes cilantro taste like soap."
};