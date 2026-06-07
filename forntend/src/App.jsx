
import { lazy, Suspense, startTransition, useEffect, useState } from 'react'

import { fetchCurrentUser, logoutUser } from './services/authService.js'
import './App.css'

const QuantumScene = lazy(() => import('./quantum/QuantumScene.jsx'))
const QuantumOverlay = lazy(() => import('./quantum/QuantumOverlay.jsx'))
const AuthModal = lazy(() => import('./auth/AuthModal.jsx'))

function SceneFallback() {
  return <div className="qs-root__fallback" aria-hidden="true" />
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    let active = true

    async function hydrateSession() {
      try {
        const user = await fetchCurrentUser()
        if (active) {
          startTransition(() => setCurrentUser(user))
        }
      } catch (error) {
        if (active) {
          startTransition(() => setCurrentUser(null))
        }
      } finally {
        if (active) {
          startTransition(() => setSessionReady(true))
        }
      }
    }

    hydrateSession()

    const onOpen = () => {
      if (!currentUser) {
        setAuthOpen(true)
      }
    }

    window.addEventListener('qs:authOpen', onOpen)

    return () => {
      active = false
      window.removeEventListener('qs:authOpen', onOpen)
    }
  }, [currentUser])

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (error) {
      // Clear client state even if the cookie is already gone.
    } finally {
      startTransition(() => {
        setCurrentUser(null)
        setAuthOpen(false)
      })
    }
  }

  return (
    <div className="qs-root">
      <Suspense fallback={<SceneFallback />}>
        <QuantumScene />
        <QuantumOverlay
          user={sessionReady ? currentUser : null}
          onOpenAuth={() => setAuthOpen(true)}
          onLogout={handleLogout}
        />

        <AuthModal
          open={authOpen}
          onOpenChange={setAuthOpen}
          onAuthenticated={(user) => startTransition(() => setCurrentUser(user))}
        />
      </Suspense>

      <div className="qs-scrollSpace" aria-hidden="true" />
    </div>
  )
}



