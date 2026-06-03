
import * as Dialog from '@radix-ui/react-dialog'

import LoginPanel from './LoginPanel.jsx'
import SignupPanel from './SignupPanel.jsx'
import useAuthTransition from './useAuthTransition.js'
import './auth.css'

export default function AuthModal({ open, onOpenChange }) {
  const { mode, phase, classes, switchMode } = useAuthTransition()

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
                <LoginPanel onSwitch={() => switchMode('signup')} />
              ) : (
                <SignupPanel onSwitch={() => switchMode('signin')} />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


