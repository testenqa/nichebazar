'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name || !email || !message) {
      setStatus('error')
      setErrorMsg('Please fill in your name, email, and message.')
      return
    }

    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    }, 500)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-lg text-gray-600">We'd love to hear from you. Reach out with any enquiries or feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
          <address className="not-italic text-gray-700 space-y-1">
            <p>Living Collective Community</p>
            <p>123 Community Lane</p>
            <p>San Francisco, CA 94105</p>
            <p>United States</p>
          </address>
          <div className="mt-4 text-gray-600 text-sm">
            <p>Email: contact@livingcollective.org</p>
            <p>Phone: (415) 555-0123</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enquiry Form</h2>

          {status === 'success' && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-green-800">
              Thank you! Your message has been recorded locally.
            </div>
          )}

          {status === 'error' && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-800">
              {errorMsg || 'Please fill in your name, email, and message.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject (optional)</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Send Enquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
