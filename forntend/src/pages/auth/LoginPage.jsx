import { useState } from 'react'

import LoginPanel from '../../auth/LoginPanel.jsx'
import { loginUser } from '../../services/authService.js'
import { validateLoginForm } from '../../validations/authValidation.js'

export default function LoginPage({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('')
    setError('')

    const validationError = validateLoginForm({ email, password })
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const response = await loginUser({ email, password })
      setStatus(response.message || 'Logged in')
      onSuccess?.(response.user)
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <LoginPanel
      email={email}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onSwitch={onSwitch}
      password={password}
      status={status}
      submitting={submitting}
    />
  )
}
