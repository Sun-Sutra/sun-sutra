import React, { useState, useRef } from 'react';
import { extractTextFromImage } from '../services/ocrService';
import { processOCRTextWithAI } from '../services/aiService';

const UploadSection = ({ onExtracted }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, ocr, ai, success, error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [rawText, setRawText] = useState('');
  const [aiJson, setAiJson] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg') && file.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid JPG, PNG, or PDF file.');
      setStatus('error');
      return;
    }
    
    setImage(file);
    if (file.type === 'application/pdf') {
      setPreview('https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg'); 
    } else {
      setPreview(URL.createObjectURL(file));
    }
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
    setRawText('');
    setAiJson('');
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
    setRawText('');
    setAiJson('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExtract = async () => {
    if (!image) {
      setErrorMsg('Please upload an image first.');
      setStatus('error');
      return;
    }

    try {
      setStatus('ocr');
      setProgress(0);
      const extractedText = await extractTextFromImage(image, (p) => {
        setProgress(Math.round(p * 100));
      });
      
      setRawText(extractedText);
      
      if (!extractedText.trim()) {
        throw new Error('No text found in the document. Please try a clearer bill.');
      }

      setStatus('ai');
      const aiData = await processOCRTextWithAI(extractedText);
      setAiJson(JSON.stringify(aiData, null, 2));
      
      setStatus('success');
      onExtracted(aiData);
      
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ marginBottom: '2rem', background: 'var(--surface)', border: '1px dashed rgba(222,216,207,0.8)', padding: '1.5rem', borderRadius: '1.5rem' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--ff-display)', color: 'var(--foreground)' }}>Auto-Fill from Bill (OCR)</h3>
      
      {!image ? (
        <div>
          <label style={{
            display: 'inline-block', padding: '12px 24px', background: 'var(--muted)',
            borderRadius: '9999px', color: 'var(--primary)', cursor: 'pointer',
            fontSize: '0.95rem', fontWeight: 600, border: '1px solid rgba(222,216,207,0.5)'
          }}>
            Upload Bill (JPG, PNG, PDF)
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf" 
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '1rem', alignItems: 'center' }}>
            <img src={preview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid rgba(222,216,207,0.5)', borderRadius: '8px', background: '#fff' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--foreground)' }}>{image.name}</p>
              <button type="button" onClick={removeImage} style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer', padding: 0, fontSize: '0.85rem', marginTop: '4px' }}>Remove File</button>
            </div>
          </div>
          
          <div>
            <button 
              type="button"
              onClick={handleExtract}
              disabled={status === 'ocr' || status === 'ai'}
              className="btn-organic"
              style={{
                padding: '10px 20px', background: 'var(--primary)',
                color: 'var(--primary-foreground)', fontSize: '0.95rem',
                border: 'none', cursor: (status === 'ocr' || status === 'ai') ? 'wait' : 'pointer',
                opacity: (status === 'ocr' || status === 'ai') ? 0.7 : 1
              }}
            >
              {status === 'ocr' ? `Scanning (${progress}%)...` : 
               status === 'ai' ? 'AI Analyzing...' : 'Extract & Auto-Fill'}
            </button>
          </div>

          {status === 'error' && (
            <div style={{ color: 'var(--destructive)', marginTop: '10px', fontSize: '0.9rem' }}>
              <p>Error: {errorMsg}</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ color: '#5D7052', marginTop: '10px', fontSize: '0.9rem', fontWeight: 500 }}>
              <p>Successfully extracted data! Please review the fields below.</p>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            {rawText && (
              <details style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>Raw OCR Text</summary>
                <pre style={{ background: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '8px', maxHeight: '150px', overflow: 'auto', border: '1px solid rgba(222,216,207,0.5)' }}>
                  {rawText}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
