import { useEffect, useMemo, useState } from 'react'


// A small, framework-agnostic page transition controller.
export default function useAuthTransition() {
  const [mode, setMode] = useState('signin')
  const [phase, setPhase] = useState('idle') // idle | leaving | entering

  const classes = useMemo(() => {
    // uses plain CSS classes from App.css
    return {
      leaving: 'qs-auth__panel--leaving',
      entering: 'qs-auth__panel--entering',
    }
  }, [])

  function switchMode(next) {
    if (next === mode) return
    setPhase('leaving')

    // match transition duration in css
    window.setTimeout(() => {
      setMode(next)
      setPhase('entering')
      window.setTimeout(() => setPhase('idle'), 210)
    }, 140)
  }


  useEffect(() => {
    // cleanup timers not needed for this simple implementation
  }, [])

  return { mode, phase, classes, switchMode }
}

