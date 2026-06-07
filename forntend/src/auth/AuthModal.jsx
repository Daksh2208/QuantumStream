
import * as Dialog from '@radix-ui/react-dialog'

import LoginPage from '../pages/auth/LoginPage.jsx'
import SignupPage from '../pages/auth/SignupPage.jsx'
import useAuthTransition from './useAuthTransition.js'
import './auth.css'

export default function AuthModal({ open, onOpenChange, onAuthenticated }) {
  const { mode, phase, classes, switchMode } = useAuthTransition()

  function handleSuccess(user) {
    onAuthenticated?.(user)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="qs-authModal__overlay" />
        <Dialog.Content className="qs-authModal__content" aria-label="Authentication dialog">
          <div className="qs-authModal__glass">
            <div
              className={`qs-auth__panel ${phase === 'leaving' ? classes.leaving : ''} ${phase === 'entering' ? classes.entering : ''}`}
            >
              {mode === 'signin' ? (
                <LoginPage onSwitch={() => switchMode('signup')} onSuccess={handleSuccess} />
              ) : (
                <SignupPage onSwitch={() => switchMode('signin')} onSuccess={handleSuccess} />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


