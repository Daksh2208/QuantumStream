import { lazy, startTransition, useEffect, useRef, useState } from 'react'

import { fetchCurrentUser, refreshSession } from './services/authService.js'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './App.css'

const AuthModal = lazy(() => import('./auth/AuthModal.jsx'))

let sessionHydrationPromise = null

async function hydrateSessionOnce() {
  if (!sessionHydrationPromise) {
    sessionHydrationPromise = (async () => {
      try {
        return await fetchCurrentUser()
      } catch {
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
  const [theme] = useState('light')
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
      } catch {
        if (active) {
          startTransition(() => setCurrentUser(null))
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

  return (
    <div className="qs-root" data-theme={theme}>
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={() => startTransition(() => setCurrentUser(null))} />
      ) : (
        <LandingPage
          theme={theme}
          onLogin={() => setAuthOpen(true)}
          onStartBuilding={() => setAuthOpen(true)}
          hideCtas={false}
          showTopDivider={true}
        />
      )}

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthenticated={(user) => startTransition(() => setCurrentUser(user))}
      />
    </div>
  )
}
