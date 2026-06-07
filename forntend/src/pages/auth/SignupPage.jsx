import { useState } from 'react'

import SignupPanel from '../../auth/SignupPanel.jsx'
import { registerUser } from '../../services/authService.js'
import { validateSignupForm } from '../../validations/authValidation.js'

export default function SignupPage({ onSwitch, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('')
    setError('')

    const validationError = validateSignupForm({ name, email, password, confirmPassword })
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const response = await registerUser({ name, email, password })
      setStatus(response.message || 'Account created')
      onSuccess?.(response.user)
    } catch (requestError) {
      setError(requestError.message || 'Unable to create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SignupPanel
      confirmPassword={confirmPassword}
      email={email}
      error={error}
      name={name}
      onConfirmPasswordChange={setConfirmPassword}
      onEmailChange={setEmail}
      onNameChange={setName}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onSwitch={onSwitch}
      password={password}
      status={status}
      submitting={submitting}
    />
  )
}
