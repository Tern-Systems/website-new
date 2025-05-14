'use client';

import { FC, useEffect } from 'react';
import { useUser, useModal } from '@/app/hooks';
import { AuthenticationCode } from '@/app/ui/modals/AuthenticationCode';

const TwoFactorRestorer: FC = () => {
    const userCtx = useUser();
    const modalCtx = useModal();

    useEffect(() => {
        if (typeof window !== 'undefined' && userCtx.isLoggedIn && userCtx.token) {
            const tfaData = userCtx.get2FAInProgressData();
            
            if (tfaData) {
                console.log('Found 2FA in progress state, reopening modal', tfaData);
                
                // Reopen the authentication modal
                modalCtx.openModal(
                    <AuthenticationCode
                        isLogin={true}
                        token={userCtx.token}
                        email={tfaData.email}
                        phone={tfaData.phone}
                        twoFAEmail={tfaData.twoFAEmail}
                        is2FA={true}
                        codeSent={true}
                    />
                );
            }
        }
    }, [userCtx.isLoggedIn, userCtx.token]);

    // This component doesn't render anything
    return null;
};

export { TwoFactorRestorer }; 