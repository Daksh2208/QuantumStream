
import { lazy, Suspense, startTransition, useEffect, useRef, useState } from 'react'

import { fetchCurrentUser, logoutUser, refreshSession } from './services/authService.js'
import HomePage from './pages/HomePage.jsx'
import './App.css'

const QuantumScene = lazy(() => import('./quantum/QuantumScene.jsx'))
const QuantumOverlay = lazy(() => import('./quantum/QuantumOverlay.jsx'))
const AuthModal = lazy(() => import('./auth/AuthModal.jsx'))

let sessionHydrationPromise = null

function SceneFallback() {
  return <div className="qs-root__fallback" aria-hidden="true" />
}

async function hydrateSessionOnce() {
  if (!sessionHydrationPromise) {
    sessionHydrationPromise = (async () => {
      try {
        return await fetchCurrentUser()
      } catch (primaryError) {
        const response = await refreshSession()
        return response.user
      }
    })()
  }

  return sessionHydrationPromise
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [theme, setTheme] = useState('light')
  const currentUserRef = useRef(null)

  useEffect(() => {
    currentUserRef.current = currentUser
  }, [currentUser])

  useEffect(() => {
    let active = true

    async function hydrateSession() {
      try {
        const user = await hydrateSessionOnce()

        if (active && user) {
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
      if (!currentUserRef.current) {
        setAuthOpen(true)
      }
    }

    window.addEventListener('qs:authOpen', onOpen)

    return () => {
      active = false
      window.removeEventListener('qs:authOpen', onOpen)
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (error) {
      // Clear client state even if the cookie is already gone.
    } finally {
      startTransition(() => {
        setCurrentUser(null)
        setAuthOpen(false)
        setTheme('light')
      })
    }
  }

  return (
    <div className="qs-root" data-theme={theme}>
      <Suspense fallback={<SceneFallback />}>
        <QuantumScene />

        {sessionReady && currentUser ? (
          <HomePage user={currentUser} theme={theme} onThemeChange={setTheme} onLogout={handleLogout} />
        ) : (
          <QuantumOverlay
            user={sessionReady ? currentUser : null}
            onOpenAuth={() => setAuthOpen(true)}
            onLogout={handleLogout}
          />
        )}

        <AuthModal
          open={authOpen}
          onOpenChange={setAuthOpen}
          onAuthenticated={(user) => startTransition(() => setCurrentUser(user))}
        />
      </Suspense>

      {!currentUser ? <div className="qs-scrollSpace" aria-hidden="true" /> : null}
    </div>
  )
}



