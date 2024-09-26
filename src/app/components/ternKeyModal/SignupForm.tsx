import { useState } from "react";
import axios from "axios";
import styles from './TernKeyModal.module.css';

interface SignupFormProps {
  setIsSignUpComplete: (value: boolean) => void; 
  setMessage: (message: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ setIsSignUpComplete, setMessage, email, setEmail, password, setPassword }) => {

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/signup01', { email, password });
      console.log(response.data);
      setMessage(response.data.msg || 'Please check your email for verification.');
      setIsSignUpComplete(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.msg || 'An error occurred during sign-up.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };


  return (
    <form className="flex flex-col items-start mt-4" onSubmit={handleSignUp}>
      <label className={styles.label}>Please enter your credentials to create a TernKey account</label>
      <input
        className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Sign Up</button>
    </form>
  );
};

export default SignupForm;
