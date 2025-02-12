import React, { FC } from 'react';

import { PlanName } from '@/app/types/subscription';
import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { useModal, useUser } from '@/app/context';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

const BTN_CN = 'px-[min(2.7dvw,1rem)] h-h-button-n rounded-full';

interface Props {
    plan: PlanName;
}

const CancelModal: FC<Props> = (props: Props) => {
    const { userData, fetchUserData } = useUser();
    const modalCtx = useModal();

    const handleDelete = async () => {
        if (!userData) return;
        try {
            const { message } = await BillingService.postCancelSubscription(userData.email, props.plan);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            await fetchUserData();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    return (
        <BaseModal
            title={'Cancel Plan'}
            className={
                'w-[90dvw] max-w-[33rem] bg-white [&_h2+button]:brightness-50 [&_h2]:text-gray [&_hr]:border-gray-l0'
            }
            classNameContent={'text-gray text-center text-basic'}
        >
            <div className={'inline-block max-w-[25rem]'}>
                <p className={'mb-xxs place-self-center text-nowrap sm:max-w-[70%] sm:whitespace-pre-wrap'}>
                    You&apos;re about to cancel your {props.plan} Pro Plan subscription.
                </p>
                <p>
                    If you wish to proceed, please click the red{' '}
                    <span className={'font-bold'}>Cancel Subscription</span> button. Otherwise, click the
                    <span className={'font-bold'}> Return to Billing</span> button to return to managing your{' '}
                    {props.plan}
                    subscription billing settings.
                </p>
                <span className={'mt-s flex justify-center gap-4xs text-section font-bold text-[#FFFFFF]'}>
                    <Button
                        onClick={() => handleDelete()}
                        className={`bg-red ${BTN_CN}`}
                    >
                        Cancel Subscription
                    </Button>
                    <PageLink href={Route.Billing}>
                        <Button className={`bg-gray-l0 ${BTN_CN}`}>Return to Billing</Button>
                    </PageLink>
                </span>
            </div>
        </BaseModal>
    );
};

export { CancelModal };
