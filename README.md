<div align="center">
  <img src="src/assets/nav.png" alt="Sun Sutra Logo" width="200" />
</div>

# Sun Sutra

Sun Sutra is dedicated to building the future of industrial energy. The company provides personalized renewable energy cost analysis and sustainable solutions for industrial facilities, helping them maximize savings and optimize their energy consumption.

## About the Project

The Sun Sutra web application serves as the primary digital presence and client portal. It features a modern frontend and a dedicated backend for processing AI-driven energy analysis and secure cloud storage.

### Key Features
- **Company Showcase**: Navigate through beautifully designed pages (Home, About, Solutions, Market, Contact) to explore services and past projects.
- **AI-Powered Energy Analysis (`/analysis`)**: A specialized portal for industrial clients to request renewable cost analysis.
- **Smart OCR Auto-Fill**: Users can upload their electricity bills (JPG, PNG, PDF). The application uses client-side OCR (Tesseract.js) to extract text, and a backend AI service (Groq LLaMA 3.1) to intelligently parse the text and auto-fill the complex 18-field energy form.
- **Secure Cloud Storage**: When users submit an analysis request with an attached bill, the document is securely uploaded and stored in Cloudflare R2 for company records.

---

## Architecture & Tech Stack

This project is separated into a frontend client and an Express backend.

### Frontend (`/files`)
- **Framework**: React, Vite
- **Routing**: React Router
- **OCR Engine**: Tesseract.js, PDF.js
- **Styling**: Vanilla CSS with custom design system

### Backend (`/backend`)
- **Server**: Node.js, Express.js
- **AI Integration**: Groq API (LLaMA 3.1)
- **Cloud Storage**: Cloudflare R2 (via AWS S3 SDK)
- **File Handling**: Multer

---

## Local Development & Setup Process

To run this project locally, you need to start both the backend server and the frontend development server.

### 1. Backend Setup

The backend handles the AI processing (to keep the Groq API key secure) and the Cloudflare R2 file uploads.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   Duplicate `.env.example` and rename it to `.env`. Fill in your API keys:
   ```env
   # Server port
   PORT=3001
   
   # Groq API Key (for AI text parsing)
   GROQ_API_KEY=your_groq_api_key_here
   
   # Cloudflare R2 Storage (for saving uploaded bills)
   R2_ACCOUNT_ID=your_cloudflare_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:3001`.*

### 2. Frontend Setup

The frontend runs the user interface and the client-side OCR.

1. Navigate to the frontend directory:
   ```bash
   cd files
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   Duplicate `.env.example` and rename it to `.env`. Ensure the backend URL is properly set:
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   # (Include any other required Firebase keys here)
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. You can also access it on your local network using the provided Network URL for mobile testing.*

---

## API Endpoints (Backend)

- `GET /api/health`: Health check endpoint.
- `POST /api/analyze`: Accepts raw OCR text, prompts the Groq AI, and returns structured JSON for the frontend form.
- `POST /api/upload`: Accepts a multipart/form-data file upload and securely stores it in the configured Cloudflare R2 bucket.
