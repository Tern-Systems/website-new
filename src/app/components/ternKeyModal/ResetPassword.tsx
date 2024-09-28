import { useState } from 'react';
import axios from 'axios';
import styles from './TernKeyModal.module.css';

interface ResetPasswordProps {
    email: string;
    setEmail: (email: string) => void;
    setMessage: (message: string) => void;
    resetToken: string; 
    setView: (view: 'login' | 'signup' | 'forgotPassword') => void; 
}

const ResetPassword: React.FC<ResetPasswordProps> = ({  setMessage, resetToken, setView }) => { //I deleted the email and setEmail for now
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${resetToken}`, { newPassword });
            setMessage(response.data.msg || 'Password has been reset successfully.');
            setView('login');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data.msg || 'An error occurred.');
            } else {
                setMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col items-start mt-4" onSubmit={handleResetPassword}>
            <label className={styles.label}>Enter your new password</label>
            <input
                type="password"
                className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                aria-label="New Password"
            />
            <input
                type="password"
                className='text-black px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                aria-label="Confirm Password"
            />
            <button type='submit' className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]' disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );
}

export default ResetPassword;

