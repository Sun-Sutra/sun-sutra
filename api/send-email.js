import nodemailer from 'nodemailer'

// ─── Constants ───
const MAX_PAYLOAD_BYTES = 10_000 // 10 KB hard limit on request body
const ALLOWED_ORIGINS = [
  'https://sunsutragroup.com',
  'https://www.sunsutragroup.com',
]

// ─── Input Validation ───
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function validateInput({ name, email, message }) {
  const errors = []
  if (!name || !name.trim()) errors.push('Name is required')
  if (!email || !email.trim()) {
    errors.push('Email is required')
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required')
  }
  if (!message || !message.trim()) errors.push('Message is required')
  return errors
}

// ─── Sanitize user input to prevent HTML injection in emails ───
function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─── SMTP Transporter (reused across invocations) ───
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Missing SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS)')
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false, // false for port 587 (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  })
}

// ─── Email Templates ───
function buildAdminNotification({ name, email, company, phone, bill, location, message }) {
  const s = escapeHtml
  return {
    subject: `New Contact Form Submission`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FDFCF8; border: 1px solid #DED8CF; border-radius: 12px; overflow: hidden;">
        <div style="background: #5D7052; padding: 24px 32px;">
          <h1 style="margin: 0; color: #F3F4F1; font-size: 20px; font-weight: 600;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; font-weight: 600; color: #5D7052; width: 35%; vertical-align: top;">Name</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; color: #2C2C24;">${s(name)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; font-weight: 600; color: #5D7052; vertical-align: top;">Email</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5;"><a href="mailto:${s(email)}" style="color: #C18C5D; text-decoration: none;">${s(email)}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; font-weight: 600; color: #5D7052; vertical-align: top;">Phone</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; color: #2C2C24;">${s(phone)}</td>
            </tr>` : ''}
            ${company ? `<tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; font-weight: 600; color: #5D7052; vertical-align: top;">Company</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; color: #2C2C24;">${s(company)}</td>
            </tr>` : ''}
            ${location ? `<tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; font-weight: 600; color: #5D7052; vertical-align: top;">Location</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; color: #2C2C24;">${s(location)}</td>
            </tr>` : ''}
            ${bill ? `<tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; font-weight: 600; color: #5D7052; vertical-align: top;">Monthly Bill</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #F0EBE5; color: #2C2C24;">${s(bill)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #5D7052; vertical-align: top;">Message</td>
              <td style="padding: 12px 16px; color: #2C2C24; white-space: pre-wrap;">${s(message)}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 16px 32px; background: #F0EBE5; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #78786C;">Sent from the Sun Sutra website contact form</p>
        </div>
      </div>
    `,
  }
}

function buildAutoReply({ name, email }) {
  const s = escapeHtml
  return {
    subject: `We received your message`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FDFCF8; border: 1px solid #DED8CF; border-radius: 12px; overflow: hidden;">
        <div style="background: #5D7052; padding: 24px 32px;">
          <h1 style="margin: 0; color: #F3F4F1; font-size: 20px; font-weight: 600;">Sun Sutra</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #2C2C24; margin-top: 0;">Hello ${s(name)},</p>
          <p style="font-size: 15px; color: #2C2C24; line-height: 1.7;">
            Thank you for contacting Sun Sutra. We have received your message and will get back to you shortly.
          </p>
          <p style="font-size: 15px; color: #2C2C24; line-height: 1.7;">
            Our team typically responds within 48 business hours. If your matter is urgent, please reach us directly at
            <a href="mailto:contact@sunsutragroup.com" style="color: #C18C5D; text-decoration: none;">contact@sunsutragroup.com</a>.
          </p>
          <hr style="border: 0; border-top: 1px solid #DED8CF; margin: 28px 0;" />
          <p style="font-size: 14px; color: #78786C; margin-bottom: 0;">
            Best regards,<br />
            <strong style="color: #2C2C24;">Sun Sutra Team</strong>
          </p>
        </div>
        <div style="padding: 16px 32px; background: #F0EBE5; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #78786C;">© ${new Date().getFullYear()} Sun Sutra Group. All rights reserved.</p>
        </div>
      </div>
    `,
  }
}

// ─── API Handler ───
export default async function handler(req, res) {
  // CORS — restrict to production origins
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  // Guard against oversized payloads
  const bodyStr = JSON.stringify(req.body || {})
  if (bodyStr.length > MAX_PAYLOAD_BYTES) {
    return res.status(413).json({ success: false, error: 'Request payload too large' })
  }

  // Parse and validate input
  const { name, email, company, phone, bill, location, message } = req.body || {}
  const validationErrors = validateInput({ name, email, message })

  if (validationErrors.length > 0) {
    console.warn('[send-email] Validation failed:', validationErrors)
    return res.status(400).json({ success: false, errors: validationErrors })
  }

  const fromAddress = `"Sun Sutra" <${process.env.SMTP_USER}>`

  try {
    const transporter = createTransporter()

    // Verify SMTP connection before sending
    await transporter.verify()
    console.log('[send-email] SMTP connection verified successfully')

    // Build email payloads
    const adminEmail = buildAdminNotification({ name, email, company, phone, bill, location, message })
    const autoReply = buildAutoReply({ name, email })

    // Send both emails concurrently
    const [adminResult, replyResult] = await Promise.all([
      transporter.sendMail({
        from: fromAddress,
        to: process.env.SMTP_USER, // contact@sunsutragroup.com
        replyTo: email.trim(),
        subject: adminEmail.subject,
        html: adminEmail.html,
      }),
      transporter.sendMail({
        from: fromAddress,
        to: email.trim(),
        subject: autoReply.subject,
        html: autoReply.html,
      }),
    ])

    console.log('[send-email] Admin notification sent:', adminResult.messageId)
    console.log('[send-email] Auto-reply sent to:', email, '—', replyResult.messageId)

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully',
    })
  } catch (error) {
    console.error('[send-email] SMTP Error:', {
      code: error.code,
      command: error.command,
      message: error.message,
    })

    return res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.',
    })
  }
}
