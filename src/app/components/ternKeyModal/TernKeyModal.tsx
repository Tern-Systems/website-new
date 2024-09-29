import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TernKeyModal.module.css';
import Image from 'next/image';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import ForgotPassword from './ForgotPassword';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TernKeyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter(); 
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [view, setView] = useState<'signup' | 'login' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleToggle = () => {
    setIsSignUpComplete(false);
    setMessage('');
    setEmail('');
    setPassword('');
    setView(view === 'signup' ? 'login' : 'signup');
  };

  const renderForm = () => {
    switch (view) {
      case 'signup':
        return (
          <SignupForm 
            setIsSignUpComplete={setIsSignUpComplete} 
            setMessage={setMessage}
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword}
          />
        );
      case 'login':
        return (
          <LoginForm 
            setMessage={setMessage} 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword}
            setView={setView}
          />
        );
      case 'forgot':
        return (
          <ForgotPassword 
            setMessage={setMessage} 
            email={email} 
            setEmail={setEmail} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`flex flex-col ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-center w-[100%] my-[0.625rem]'>
          <Image src="/images/Ternkey-Logo.png" alt="TernKey Logo" width={83} height={96} />
        </div>

        {isSignUpComplete ? (
          <div className="flex flex-col items-center mt-4">
            <label className={styles.label} style={{ textAlign: 'center' }}>{message}</label>
            <p className={styles.label} style={{ textAlign: 'center' }}>Your email has been verified. Please log in.</p>
          </div>
        ) : (
          renderForm()
        )}

        {message && <p className={`${styles.message} text-red-500`}>{message}</p>}

        <footer className='text-black'>
          <div className="flex items-center justify-center mt-[1.25rem]">
            {view === 'signup' ? (
              <>
                <p className={styles.textUnderButton}>Already have an account?</p>
                <a href="#" className={`text-[#178AB7] pl-[4px] ${styles.textUnderButton}`} onClick={handleToggle}>Login</a>
              </>
            ) : view === 'login' ? (
              <>
                <p className={styles.textUnderButton}>Don&apos;t have an account?</p>
                <a href="#" className={`text-[#178AB7] pl-[4px] ${styles.textUnderButton}`} onClick={handleToggle}>Sign Up</a>
              </>
            ) : (
              <>
                <p className={styles.textUnderButton}>Remembered your password?</p>
                <a href="#" className={`text-[#178AB7] pl-[4px] ${styles.textUnderButton}`} onClick={() => setView('login')}>Login</a>
              </>
            )}
          </div>
          <div className={styles.copywrite}>
            <p>&copy; 2024 Tern Systems</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TernKeyModal;
