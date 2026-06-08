import { memo } from 'react'

import { PASSWORD_PATTERN } from '../validations/authValidation.js'

function SignupPanel({ confirmPassword, email, error, name, onConfirmPasswordChange, onEmailChange, onNameChange, onPasswordChange, onSubmit, onSwitch, password, status, submitting }) {

  return (
    <div className="qs-auth__panel">
      <div className="qs-auth__kicker">Get Started</div>
      <h2 className="qs-auth__title">Create account</h2>
      <p className="qs-auth__desc">Join developers building the future of quantum applications.</p>

      <form className="qs-auth__form" onSubmit={onSubmit}>
        <label className="qs-auth__label">
          Full Name
          <input
            className="qs-auth__input"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
            minLength={2}
          />
        </label>

        <label className="qs-auth__label">
          Email
          <input
            className="qs-auth__input"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
        </label>

        <label className="qs-auth__label">
          Password
          <input
            className="qs-auth__input"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
            minLength={8}
            pattern={PASSWORD_PATTERN}
            title="At least 8 characters with a letter, number, and special character"
          />
        </label>

        <label className="qs-auth__label">
          Confirm password
          <input
            className="qs-auth__input"
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            required
          />
        </label>

        <button className="qs-auth__submit qs-auth__submit--accent" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>

        {error ? <div className="qs-auth__status qs-auth__status--error">{error}</div> : null}
        {status ? <div className="qs-auth__status qs-auth__status--success">{status}</div> : null}

        <div className="qs-auth__fineprint">
          Passwords must be at least 8 characters long and include a letter, a number, and a special character.
        </div>
      </form>

      <div className="qs-auth__switch">
        <span className="qs-auth__switchText">Already have an account?</span>
        <button className="qs-auth__link" type="button" onClick={onSwitch}>
          Log in
        </button>
      </div>
    </div>
  )
}

export default memo(SignupPanel)

