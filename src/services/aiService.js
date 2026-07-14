// Frontend AI service — sends OCR text to the backend for processing
// The Groq API key is kept securely on the backend server

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const processOCRTextWithAI = async (ocrText) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ocrText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to communicate with backend.');
    }

    const parsedJSON = await response.json();
    return parsedJSON;
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error('Failed to extract data from the text: ' + error.message);
  }
};
