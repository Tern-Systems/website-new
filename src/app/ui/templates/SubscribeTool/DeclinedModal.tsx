'use client';

import { FC } from 'react';
import Image from 'next/image';

import { BaseModal } from '@/app/ui/modals';

import SVG_DECLINED from '@/assets/images/declined.svg';

const DeclinedModal: FC = (props) => (
    <BaseModal
        {...props}
        simple
        title={'Payment Declined'}
        className={`bottom-[7.19rem] right-l max-w-[19.3125rem] border-gray-l0 [&_hr]:border-gray-l0`}
        classNameContent={'flex px-[1rem] gap-[0.69rem]'}
    >
        <Image
            src={SVG_DECLINED}
            alt={'declined'}
            className={'mb-[1.76rem] h-auto w-[1.6875rem]'}
        />
        <span>
            There was an issue processing your payment. Please review your card and billing information, or try an
            alternative payment method to confirm your subscription.
        </span>
    </BaseModal>
);

export { DeclinedModal };
