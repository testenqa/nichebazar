import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const subject = String(body.subject || '').trim()
    const message = String(body.message || '').trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
    const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false') === 'true'
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@nichebazar.local'
    const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || 'ammuthalib@gmail.com'

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    const mailSubject = subject || `New enquiry from ${name}`

    const text = [
      `You have received a new enquiry via the contact form:`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      subject ? `Subject: ${subject}` : undefined,
      '',
      `Message:`,
      message,
      '',
      `— NicheBazar Contact Form`,
    ].filter(Boolean).join('\n')

    const html = `
      <div>
        <p>You have received a new enquiry via the contact form:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${message}</pre>
        <hr/>
        <p style="color:#6b7280">— NicheBazar Contact Form</p>
      </div>
    `

    await transporter.sendMail({
      from: SMTP_FROM,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: mailSubject,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('CONTACT_POST_ERROR', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
