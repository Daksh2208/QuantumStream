import { memo } from 'react'

function LoginPanel({ email, error, onEmailChange, onPasswordChange, onSubmit, onSwitch, password, status, submitting }) {

  return (
    <div className="qs-auth__panel">
      <div className="qs-auth__kicker">Welcome Back</div>
      <h2 className="qs-auth__title">Log in</h2>
      <p className="qs-auth__desc">Enter your credentials to access the QuantumStream workspace.</p>

      <form className="qs-auth__form" onSubmit={onSubmit}>
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
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
          />
        </label>

        <button className="qs-auth__submit" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Continue'}
        </button>

        {error ? <div className="qs-auth__status qs-auth__status--error">{error}</div> : null}
        {status ? <div className="qs-auth__status qs-auth__status--success">{status}</div> : null}

      </form>

      <div className="qs-auth__switch">
        <span className="qs-auth__switchText">New to QuantumStream?</span>
        <button className="qs-auth__link" type="button" onClick={onSwitch}>
          Create an account
        </button>
      </div>
    </div>
  )
}

export default memo(LoginPanel)

