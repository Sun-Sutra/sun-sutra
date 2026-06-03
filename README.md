<div align="center">
  <img src="sun sutra logo.png" alt="Sun Sutra Logo" width="200" />
</div>

# Sun Sutra

Sun Sutra is dedicated to building the future of industrial energy. The company provides personalized renewable energy cost analysis and sustainable solutions for industrial facilities, helping them maximize savings and optimize their energy consumption.

## About the Website

The Sun Sutra website serves as the primary digital presence and client portal. 

How to use the website:
- Navigation: Use the top navigation bar to explore different sections of the site, including company information, services, and the portfolio of previous industrial energy projects.
- Cost Analysis Form: Prospective clients can navigate to the Contact section to request a free renewable cost analysis. Users must provide their facility details, monthly electricity bill range, and industrial location.
- Communication: Upon submitting the contact form, the website automatically logs the inquiry and sends out confirmation and notification emails.

## Developer Documentation

This project is built using React and Vite. It features a modern, responsive user interface and integrates serverless backend functionality for form processing.

### Tech Stack
- Frontend: React, Vite
- Routing: React Router
- Deployment: Vercel

### Local Development
To run the project locally, install dependencies and start the development server using the Vercel CLI to ensure API routes function correctly:

1. Install dependencies:
   npm install

2. Start the local server:
   npx vercel dev

The Vercel CLI is required locally because it correctly routes API requests to the serverless functions in the /api directory.

### APIs and Serverless Functions

The application uses Vercel Serverless Functions to handle backend processes without requiring a dedicated server.

- POST /api/send-email: This endpoint handles submissions from the contact form. It validates the user input and triggers the email notification system.

### Domain and Email Infrastructure

- Domain: The primary domain for the application is sunsutragroup.com.
- Email Provider: Email services are configured through Namecheap Private Email.
- Email Dispatch: The /api/send-email function uses Nodemailer to connect to the Namecheap SMTP server. It sends an administrative notification to the company and an automated reply to the user.

Environment variables required for the email API:
- SMTP_HOST: The Namecheap SMTP host.
- SMTP_PORT: Port for SMTP connection (e.g., 587 for STARTTLS).
- SMTP_USER: The sending email address.
- SMTP_PASS: The password for the email account.
