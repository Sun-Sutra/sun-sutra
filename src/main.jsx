import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import App from './App.jsx'
import './index.css'

if (import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_KEY !== 'YOUR_POSTHOG_KEY') {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'dummy_key'}>
        <PostHogProvider client={posthog}>
          <App />
        </PostHogProvider>
      </GoogleReCaptchaProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
