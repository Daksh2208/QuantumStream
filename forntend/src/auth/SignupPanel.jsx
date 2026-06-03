export default function SignupPanel({ onSwitch }) {

  return (
    <div className="qs-auth__panel">
      <div className="qs-auth__kicker">QuantumStream / Research Access</div>
      <h2 className="qs-auth__title">Create account</h2>
      <p className="qs-auth__desc">Request access to simulate quantum circuits and validate post‑quantum security workflows.</p>

      <form className="qs-auth__form" onSubmit={(e) => e.preventDefault()}>
        <label className="qs-auth__label">
          Name
          <input className="qs-auth__input" type="text" placeholder="Dr. Ronak Patel" required />
        </label>

        <label className="qs-auth__label">
          Email
          <input className="qs-auth__input" type="email" placeholder="name@institution.edu" required />
        </label>

        <label className="qs-auth__label">
          Password
          <input className="qs-auth__input" type="password" placeholder="Create a strong password" required />
        </label>

        <button className="qs-auth__submit qs-auth__submit--accent" type="submit">
          Request access
        </button>

        <div className="qs-auth__fineprint">
          Access is verified for research institutions.
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

