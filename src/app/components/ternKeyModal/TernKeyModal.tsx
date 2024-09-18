import React from 'react';
import styles from './TernKeyModal.module.css';
import Image from 'next/image';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TernKeyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`flex flex-col ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-center w-[100%] my-[0.625rem]'>
                    <Image src="/images/ternkey-logo.png" alt="TernKey Logo" width={83} height={96} />
                </div>              
                <button className={styles.closeButton} onClick={onClose}>x</button>
                <form className="flex flex-col items-start mt-4">
                    <label className={styles.label}>Please enter credential to create a TernKey account</label>
                    <input className='px-[0.875rem] w-[30rem] h-[2.43rem] mb-[1.875rem] rounded-[6px] mx-[0.9375rem]' placeholder='Email'></input>
                    <button type='submit'className='bg-[#878D96] w-[30rem] h-[2.43rem] rounded-[6px] mx-[0.9375rem]'>Sign Up</button>
                </form>
                <footer className='text-black'>
                <div className="flex items-center justify-center mt-[1.25rem]">
                    <p className={styles.textUnderButton}>Already have an account?</p>
                    <a href="#" className={`text-[#17a8b7] pl-[4px] ${styles.textUnderButton}`}>Login</a>
                </div>
                <div className={styles.copywrite}>
                    <p>&copy; 2024 Tern Systems</p>
                </div>
                </footer>
            </div>
        </div>
    )
}

export default TernKeyModal;