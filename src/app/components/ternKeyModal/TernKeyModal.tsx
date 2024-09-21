import React, { useState } from 'react';
import axios from 'axios';
import styles from './TernKeyModal.module.css';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TernKeyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup01', { email, password });
      console.log(response.data);
  
      if (response.data.msg) {
        alert(response.data.msg);
        setOtpSent(true);
        setIsSignUp(false);
      } else {
        alert('Sign-up successful, but no message returned.');
        setOtpSent(true);
        setIsSignUp(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.msg || 'An error occurred during sign-up');
      } else {
        alert('An unexpected error occurred');
      }
    }
  };
  
  

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/verify-otp', { email, otp });
      alert(response.data.msg);
      onClose();
    } catch (error: unknown) {
      if(axios.isAxiosError(error)) {
        alert(error.response?.data.msg || 'An error occurred during sign-up');
      } else {
        alert('An unexpected error occured')
      }    
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`flex flex-col ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-center w-[100%] my-[0.625rem]'>
          <Image src="/images/ternkey-logo.png" alt="TernKey Logo" width={83} height={96} />
        </div>

        {isSignUp ? (
          <form className="flex flex-col items-start mt-4" onSubmit={handleSignUp}>
          <label className={styles.label}>Please enter your credentials to create a TernKey account</label>
          <input
            className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Sign Up</button>
          </form>
        ) : otpSent ? (
          <form className="flex flex-col items-start mt-4" onSubmit={handleOtpSubmit}>
            <label className={styles.label}>Enter the OTP sent to your email</label>
            <input
              className='px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
              placeholder='OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Verify OTP</button>
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
                <a href="#" className={`text-[#178AB7] pl-[4px] ${styles.textUnderButton}`} onClick={() => setIsSignUp(false)}>Login</a>
              </>
            ) : (
              <>
                <p className={styles.textUnderButton}>Don't have an account?</p>
                <a href="#" className={`text-[#178AB7] pl-[4px] ${styles.textUnderButton}`} onClick={() => setIsSignUp(true)}>Sign Up</a>
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

