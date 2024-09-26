import { useState } from 'react';
import axios from 'axios';
import styles from './TernKeyModal.module.css'

interface ForgotPasswordFormProps {
    email: string;
    setEmail: (email: string) => void;
    setMessage: (message: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordFormProps> = ({ email, setEmail, setMessage }) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
     
        try {
            const response = await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage(response.data.msg || 'Check your email for reset instructions.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data.msg || 'An error occurred.');
            } else {
                setMessage('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    
    return (
         <form className="flex flex-col items-start mt-4" onSubmit={handleForgotPassword}>
            <label className={styles.label}>Please enter your email to reset password</label>
            <input
                className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]' disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
        </form>
    )
}

export default ForgotPassword