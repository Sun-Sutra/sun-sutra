import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { extractTextFromImage } from '../services/ocrService';
import { processOCRTextWithAI } from '../services/aiService';

// forwardRef so parent (Analysis.jsx) can call uploadToR2() on "Get Analysis" click
const UploadSection = forwardRef(({ onExtracted }, ref) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, ocr, ai, success, error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [rawText, setRawText] = useState('');
  
  const fileInputRef = useRef(null);

  // Expose uploadToR2 and getImage to parent via ref
  useImperativeHandle(ref, () => ({
    getImage: () => image,
    uploadToR2: async () => {
      if (!image) return; // optional — silently skip
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const formPayload = new FormData();
        formPayload.append('file', image);
        const res = await fetch(`${BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formPayload,
        });
        if (!res.ok) {
          const err = await res.json();
          console.warn('R2 upload failed (non-blocking):', err.error);
        }
      } catch (e) {
        console.warn('R2 upload error (non-blocking):', e.message);
      }
    },
  }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg') && file.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid JPG, PNG, or PDF file.');
      setStatus('error');
      return;
    }
    setImage(file);
    setPreview(file.type === 'application/pdf'
      ? 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg'
      : URL.createObjectURL(file));
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
    setRawText('');
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
    setRawText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtract = async () => {
    if (!image) {
      setErrorMsg('Please upload an image first.');
      setStatus('error');
      return;
    }
    try {
      // OCR
      setStatus('ocr');
      setProgress(0);
      const extractedText = await extractTextFromImage(image, (p) => {
        setProgress(Math.round(p * 100));
      });
      setRawText(extractedText);
      if (!extractedText.trim()) {
        throw new Error('No text found in the document. Please try a clearer bill.');
      }
      // AI
      setStatus('ai');
      const aiData = await processOCRTextWithAI(extractedText);
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
            {/* Image Preview with Laser Scanning Overlay */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(222,216,207,0.5)', borderRadius: '12px', background: '#090d16' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: ['ocr', 'ai'].includes(status) ? 0.7 : 1 }} />
              {['ocr', 'ai'].includes(status) && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #10b981, #38bdf8, transparent)',
                  boxShadow: '0 0 10px #10b981, 0 0 20px #10b981',
                  animation: 'laserScan 1.8s infinite ease-in-out',
                  zIndex: 10
                }} />
              )}
            </div>

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
                border: 'none', cursor: ['ocr', 'ai'].includes(status) ? 'wait' : 'pointer',
                opacity: ['ocr', 'ai'].includes(status) ? 0.7 : 1
              }}
            >
              {status === 'ocr' ? `Scanning OCR (${progress}%)...` :
               status === 'ai' ? 'AI Extracting Metrics...' : 'Extract & Auto-Fill'}
            </button>
          </div>

          {/* Futuristic Status Terminal Log */}
          {['ocr', 'ai'].includes(status) && (
            <div style={{
              marginTop: '15px',
              background: '#090d16',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: '#38bdf8',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1s infinite' }} />
                <strong>SUN SUTRA AI ENGINE ONLINE</strong>
              </div>
              {status === 'ocr' && <div>[1/3] Performing Optical Character Recognition... {progress}%</div>}
              {status === 'ocr' && progress > 50 && <div style={{ color: '#a3a3a3' }}>[2/3] Parsing account number, tariff codes & consumption units...</div>}
              {status === 'ai' && <div style={{ color: '#eab308' }}>[3/3] AI structuring billing variables & voltage tiers...</div>}
            </div>
          )}

          {status === 'error' && (
            <div style={{ color: 'var(--destructive)', marginTop: '10px', fontSize: '0.9rem' }}>
              <p>Error: {errorMsg}</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ 
              background: 'rgba(16,185,129,0.1)', 
              border: '1px solid rgba(16,185,129,0.3)', 
              borderRadius: '10px', 
              padding: '10px 14px', 
              marginTop: '12px', 
              color: '#10b981', 
              fontSize: '0.88rem', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✓</span> AI Extraction Complete — Fields Auto-Populated!
            </div>
          )}

          {/* Raw OCR Text preview removed */}

          <style>{`
            @keyframes laserScan {
              0% { top: 0%; }
              50% { top: 90%; }
              100% { top: 0%; }
            }
            @keyframes pulse {
              0% { opacity: 0.3; }
              50% { opacity: 1; }
              100% { opacity: 0.3; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
});

UploadSection.displayName = 'UploadSection';
export default UploadSection;
