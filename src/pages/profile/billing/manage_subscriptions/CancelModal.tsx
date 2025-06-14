'use client';

import { FC } from 'react';

import { DataTestID } from '@/tests/static';

import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

const TestID = DataTestID.modal.cancelSubscription;

const BTN_CN = 'px-[min(2.7dvw,1rem)] h-button-n rounded-full';

interface Props {
    plan: string | undefined;
}

const CancelModal: FC<Props> = (props: Props) => {
    const { plan } = props;

    const { userData, setupSession } = useUser();
    const modalCtx = useModal();

    const handleDelete = async () => {
        if (!userData || !plan) throw 'Error setting up operation - no required plan data';
        try {
            const { message } = await BillingService.postCancelSubscription(userData.email, plan);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            await setupSession(true);
        } catch (err: unknown) {
            if (typeof err === 'string') modalCtx.openModal(<MessageModal>{err}</MessageModal>);
        }
    };

    return (
        <BaseModal
            data-testid={TestID.modal}
            title={'Cancel Plan'}
            className={
                'w-[90dvw] max-w-[33rem] bg-white [&_h2+button]:brightness-50 [&_h2]:text-gray [&_hr]:border-gray-l0'
            }
            classNameContent={'text-gray text-center text-16'}
        >
            <div className={'inline-block max-w-[25rem]'}>
                <p className={'mb-xxs place-self-center text-nowrap sm:max-w-[70%] sm:whitespace-pre-wrap'}>
                    You&apos;re about to cancel your {props.plan} Pro Plan subscription.
                </p>
                <p>
                    If you wish to proceed, please click the red&nbsp;
                    <span className={'font-bold'}>Cancel Subscription</span> button. Otherwise, click the
                    <span className={'font-bold'}> Return to Billing</span> button to return to managing your&nbsp;
                    {plan ?? '-- missing name --'}
                    subscription billing settings.
                </p>
                <span className={'mt-s flex justify-center gap-4xs text-20 font-bold text-primary'}>
                    <Button
                        data-testid={TestID.submitButton}
                        onClick={handleDelete}
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
