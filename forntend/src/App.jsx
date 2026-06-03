
import { useEffect, useState } from 'react'

import QuantumScene from './quantum/QuantumScene.jsx'
import QuantumOverlay from './quantum/QuantumOverlay.jsx'
import AuthModal from './auth/AuthModal.jsx'
import './App.css'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setAuthOpen(true)
    window.addEventListener('qs:authOpen', onOpen)

    return () => {
      window.removeEventListener('qs:authOpen', onOpen)
    }
  }, [])

  return (
    <div className="qs-root">
      <QuantumScene />
      <QuantumOverlay />

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      <div className="qs-scrollSpace" aria-hidden="true" />
    </div>
  )
}



