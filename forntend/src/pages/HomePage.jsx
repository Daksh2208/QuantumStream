import { useEffect, useState } from 'react'

import './HomePage.css'

const MODULES = [
  {
    title: 'Identity Guard',
    label: 'Auth + access control',
    copy: 'JWT sessions, token revocation, rate limits, and usage quotas keep expensive simulations protected.',
  },
  {
    title: 'Visual Circuit Architect',
    label: 'Drag-and-drop builder',
    copy: 'Design multi-qubit circuits, export OpenQASM, and persist JSON circuit snapshots for later runs.',
  },
  {
    title: 'Quantum Simulation Engine',
    label: 'Qiskit execution',
    copy: 'Parse circuits, run Aer simulations, and inspect probability distributions and measurement counts.',
  },
  {
    title: 'Result Storage & Analytics',
    label: 'MongoDB + GridFS',
    copy: 'Save experiment history, store large artifacts, and compare simulation outcomes across sessions.',
  },
  {
    title: 'PQC Compliance Auditor',
    label: 'Quantum-safe security',
    copy: 'Benchmark RSA against post-quantum algorithms and generate reports for future-ready security reviews.',
  },
]

const WORKFLOW = [
  'Authenticate securely',
  'Design a circuit',
  'Run the simulation',
  'Store the result',
  'Audit quantum risk',
]

const THEMES = [
  {
    id: 'light',
    name: 'Light',
    note: 'Bright glass shell with the original splash-screen feel.',
  },
  {
    id: 'dark',
    name: 'Dark',
    note: 'Midnight glass with cyan and indigo highlights.',
  },
]

export default function HomePage({ user, theme, onThemeChange, onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || 'Researcher')

  useEffect(() => {
    setProfileName(user?.name || 'Researcher')
  }, [user])

  const displayName = profileName || 'Researcher'
  const email = user?.email || 'QuantumStream user'

  function handleLogout() {
    const confirmed = window.confirm('Are you sure you want to log out of QuantumStream?')
    if (confirmed) {
      onLogout?.()
    }
  }

  function handleThemeToggle() {
    onThemeChange?.(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <main className="qs-home" data-theme={theme}>
      <section className="qs-home__shell">
        <header className="qs-home__topbar">
          <div>
            <div className="qs-home__eyebrow">QuantumStream Control Center</div>
            <div className="qs-home__brand">Build, simulate, and secure quantum workflows in one workspace.</div>
          </div>

          <div className="qs-home__actions">
            <button
              className="qs-home__settingsButton"
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
              aria-expanded={settingsOpen}
              aria-controls="qs-home-settings"
              aria-label="Open settings"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19.14 12.94a7.88 7.88 0 0 0 .05-.94 7.88 7.88 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.14 7.14 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.23-1.13.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.7 7.84a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.62-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.4 1.05.71 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.58-.23 1.13-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
              </svg>
            </button>

            {settingsOpen ? (
              <div className="qs-home__settingsPanel" id="qs-home-settings" role="menu" aria-label="User settings">
                <div className="qs-home__profileCard">
                  <div className="qs-home__avatar">{displayName.slice(0, 1).toUpperCase()}</div>
                  <div>
                    <div className="qs-home__profileName">{displayName}</div>
                    <div className="qs-home__profileEmail">{email}</div>
                  </div>
                </div>

                <div className="qs-home__settingsGroup">
                  <div className="qs-home__settingsLabel">Name</div>
                  <input
                    className="qs-home__nameInput"
                    type="text"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="qs-home__settingsGroup">
                  <div className="qs-home__settingsLabel">Theme</div>
                  <button
                    className="qs-home__themeToggle"
                    type="button"
                    onClick={handleThemeToggle}
                    aria-pressed={theme === 'dark'}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                  >
                    <span className="qs-home__themeToggleTrack" aria-hidden="true">
                      <span className="qs-home__themeToggleThumb" />
                    </span>
                    <span className="qs-home__themeToggleText">
                      <strong>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</strong>
                      <span>{theme === 'dark' ? 'System is in dark presentation mode' : 'System is in light presentation mode'}</span>
                    </span>
                  </button>
                </div>

                <button className="qs-home__logout" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <section className="qs-home__hero">
          <div className="qs-home__heroCopy">
            <p className="qs-home__badge">Welcome back, {displayName}</p>
            <h1 className="qs-home__title">
              Your quantum lab is ready for circuit design, simulation, and post-quantum security work.
            </h1>
            <p className="qs-home__lede">
              QuantumStream unifies visual circuit building, Qiskit execution, secure storage, and quantum-safe audit tools in a single research dashboard.
            </p>

            <div className="qs-home__stats" aria-label="Project highlights">
              <div className="qs-home__stat">
                <span>5 modules</span>
                <strong>Full-stack architecture</strong>
              </div>
              <div className="qs-home__stat">
                <span>1 workflow</span>
                <strong>Design to audit</strong>
              </div>
              <div className="qs-home__stat">
                <span>Secured session</span>
                <strong>{email}</strong>
              </div>
            </div>
          </div>

          <aside className="qs-home__signalPanel" aria-label="QuantumStream architecture summary">
            <div className="qs-home__signalTitle">Platform focus</div>
            <ul className="qs-home__signalList">
              <li>Quantum circuit authoring</li>
              <li>Simulation and measurement analytics</li>
              <li>Redis-backed identity protection</li>
              <li>MongoDB experiment history</li>
              <li>Post-quantum compliance reporting</li>
            </ul>
            <div className="qs-home__signalFooter">
              Built for final-year demos, portfolio walkthroughs, and research presentations.
            </div>
          </aside>
        </section>

        <section className="qs-home__workflow">
          <div className="qs-home__sectionLabel">Research flow</div>
          <div className="qs-home__steps">
            {WORKFLOW.map((step, index) => (
              <div className="qs-home__step" key={step}>
                <span>0{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="qs-home__modules">
          <div className="qs-home__sectionLabel">Major modules</div>
          <div className="qs-home__grid">
            {MODULES.map((module) => (
              <article className="qs-home__card" key={module.title}>
                <div className="qs-home__cardLabel">{module.label}</div>
                <h2>{module.title}</h2>
                <p>{module.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}