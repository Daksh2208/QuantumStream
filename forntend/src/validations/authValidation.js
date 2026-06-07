export const PASSWORD_PATTERN = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'

export function validateEmail(email) {
  const value = String(email || '').trim()

  if (!value) {
    return 'Email is required'
  }

  if (!value.includes('@')) {
    return 'Enter a valid email address'
  }

  return ''
}

export function validateName(name) {
  const value = String(name || '').trim()

  if (value.length < 2) {
    return 'Name must be at least 2 characters long'
  }

  return ''
}

export function validatePassword(password) {
  const value = String(password || '')

  if (value.length < 8) {
    return 'Password must be at least 8 characters long'
  }

  if (!/[A-Za-z]/.test(value)) {
    return 'Password must include a letter'
  }

  if (!/\d/.test(value)) {
    return 'Password must include a number'
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return 'Password must include a special character'
  }

  return ''
}

export function validatePasswordConfirmation(password, confirmPassword) {
  if (String(password || '') !== String(confirmPassword || '')) {
    return 'Passwords do not match'
  }

  return ''
}

export function validateLoginForm({ email, password }) {
  return validateEmail(email) || (String(password || '') ? '' : 'Password is required')
}

export function validateSignupForm({ name, email, password, confirmPassword }) {
  return validateName(name) || validateEmail(email) || validatePassword(password) || validatePasswordConfirmation(password, confirmPassword)
}
