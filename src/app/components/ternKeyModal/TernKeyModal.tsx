import React, { useState } from 'react';
import styles from './TernKeyModal.module.css';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TernKeyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between sign-up and login

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`flex flex-col ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-center w-[100%] my-[0.625rem]'>
          <Image src="/images/ternkey-logo.png" alt="TernKey Logo" width={83} height={96} />
        </div>

        {isSignUp ? (
          <form className="flex flex-col items-start mt-4">
            <label className={styles.label}>Please enter your credentials to create a TernKey account</label>
            <input className='px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]' placeholder='Email' />
            <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Sign Up</button>
          </form>
        ) : (
          <form className="flex flex-col items-start mt-4">
            <label className={styles.label}>Please enter your login credentials</label>
            <input className='px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]' placeholder='Email' />
            <input className='px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]' type='password' placeholder='Password' />
            <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Login</button>
          </form>
        )}

        <footer className='text-black'>
          <div className="flex items-center justify-center mt-[1.25rem]">
            {isSignUp ? (
              <>
                <p className={styles.textUnderButton}>Already have an account?</p>
                <a href="#" className={`text-[#17a8b7] pl-[4px] ${styles.textUnderButton}`} onClick={() => setIsSignUp(false)}>Login</a>
              </>
            ) : (
              <>
                <p className={styles.textUnderButton}>Don't have an account?</p>
                <a href="#" className={`text-[#17a8b7] pl-[4px] ${styles.textUnderButton}`} onClick={() => setIsSignUp(true)}>Sign Up</a>
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
