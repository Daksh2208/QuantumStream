import { useEffect, useMemo, useState } from 'react'


const SCENES = [
  { title: 'Initialization', caption: 'Qubits begin to orbit. Probability states appear.' },
  { title: 'Circuit Formation', caption: 'Particles reorganize into a quantum circuit.' },
  { title: 'Simulation', caption: 'State evolution. Measurement collapse begins.' },
  { title: 'Intelligence Layer', caption: 'Simulation outputs organize into structured knowledge.' },
  { title: 'Security Layer', caption: 'Quantum-safe cryptography prepares an audit trail.' },
  { title: 'Quantum Collapse', caption: 'The measured state resolves into QuantumStream.' },
]

export default function QuantumOverlay({ user, onOpenAuth, onLogout }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      setProgress(Math.max(0, Math.min(1, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const active = useMemo(() => {
    const scaled = progress * SCENES.length
    const idx = Math.min(SCENES.length - 1, Math.floor(scaled))
    return { idx, ...SCENES[idx] }
  }, [progress])

  return (
    <div className="qs-ui" aria-hidden={false}>
      <div className="qs-ui__top">
        <div className="qs-ui__brand">QuantumStream</div>
        <div className="qs-ui__meta">
          {user ? `Secured session for ${user.name}` : 'Quantum research platform'}
        </div>
      </div>

      <div className="qs-ui__center" role="presentation">
        <h1 className="qs-ui__headline">Design. Simulate. Secure. The Quantum Future.</h1>
        <p className="qs-ui__subhead">
          Build quantum circuits visually, execute simulations, and benchmark post-quantum cryptography through a unified research platform.
        </p>

        <div className="qs-ui__ctas">
          <button
            className="qs-ui__cta qs-ui__cta--primary"
            type="button"
            onClick={() => {
              if (user) {
                window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })
                return
              }

              onOpenAuth()
            }}
          >
            {user ? 'Enter Quantum Lab' : 'Launch Quantum Lab'}
          </button>
          <button
            className="qs-ui__cta qs-ui__cta--secondary"
            type="button"
            onClick={() => {
              if (user) {
                onLogout()
                return
              }

              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            }}
          >
            {user ? 'Sign out' : 'Explore Architecture'}
          </button>
        </div>

      </div>

      <div className="qs-ui__bottom">
        <div className="qs-ui__sceneLabel">{String(active.idx + 1).padStart(2, '0')} / 06</div>
        <div className="qs-ui__sceneTitle">{active.title}</div>
        <div className="qs-ui__sceneCaption">{active.caption}</div>
      </div>

      <div className="qs-ui__scrollHint">Scroll to continue the experiment</div>
    </div>
  )
}

