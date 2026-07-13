import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for pdfjs in a Vite environment
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const extractTextFromImage = async (file, onProgress) => {
  try {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
        
        if (onProgress) {
           onProgress(i / pdf.numPages * 0.5); 
        }
      }
      
      if (fullText.trim().length > 50) {
        if (onProgress) onProgress(1); 
        return fullText;
      }
      
      if (onProgress) onProgress(0); 
      
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 }); 
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress);
          }
        }
      });
      const { data: { text } } = await worker.recognize(canvas);
      await worker.terminate();
      
      return text;
      
    } else {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress);
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      return text;
    }
  } catch (error) {
    console.error('Extraction Error:', error);
    throw new Error('Failed to extract text. Please try a valid file.');
  }
};
