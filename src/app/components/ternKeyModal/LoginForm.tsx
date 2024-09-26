import { useState } from "react";
import axios from "axios";
import styles from './TernKeyModal.module.css'

interface LoginFormProps {
    setMessage: (message: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    setView: (view: 'login' | 'signup' | 'forgot') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setMessage,  email, setEmail, password, setPassword, setView }) => {

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
    
        try {
          const response = await axios.post('http://localhost:5000/login', { email, password });
          console.log(response.data);
          setMessage(response.data.msg || 'Login successful!');
    
          if (response.data.success) {
            console.log('Redirecting to: https://www.tern.ac/ternkey');
            window.location.href = 'https://www.tern.ac/ternkey';
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            setMessage(error.response?.data.msg || 'An error occurred during login.');
          } else {
            setMessage('An unexpected error occurred.');
          }
        }
      };

      const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
      };
    

return (
    <>
    <form className="flex flex-col items-start mt-4" onSubmit={handleLogin}>
            <label className={styles.label}>Please enter your login credentials</label>
            <input
              className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className='flex mb-[1.875rem] ml-[0.9375rem] mt-[0.625rem]'>
              <p className={`text-black ${styles.textUnderButton}`}>Forgot your password?</p>
              <a 
                className={`text-[#178AB7] pl-[4px] ${styles.textUnderButton}`} 
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  setView('forgot'); // Change the view to forgot password
              }}
              >Reset</a>
            </div>       
            <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Login</button>

            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center">
                <span className="text-black mr-2 mb-4">OR</span>
              </div>
              <button
                className='bg-[#178AB7] text-white w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'
                onClick={handleGoogleLogin}
              >
                Login with Google
              </button>
            </div>
          </form>
    </>
)
}

export default LoginForm