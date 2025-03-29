'use client';

import { FC } from 'react';
import Image from 'next/image';

import { BaseModal } from '@/app/ui/modals';

import SVG_DECLINED from '@/assets/images/declined.svg';

const DeclinedModal: FC = () => (
    <BaseModal
        isSimple
        title={'Payment Declined'}
        className={`bottom-[7.1875rem] right-l max-w-[19.3125rem] border-gray-l0 [&_hr]:border-gray-l0`}
        classNameContent={'flex px-xxs gap-4xs'}
    >
        <Image
            src={SVG_DECLINED}
            alt={'declined'}
            className={'mb-s h-auto w-s'}
        />
        <span>
            There was an issue processing your payment. Please review your card and billing information, or try an
            alternative payment method to confirm your subscription.
        </span>
    </BaseModal>
);

DeclinedModal.displayName = DeclinedModal.name;

export { DeclinedModal };
