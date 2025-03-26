'use client';

import { FC, useEffect } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { useModal } from '@/app/hooks';

import { BaseModal } from '@/app/ui/modals/Base';
import { AuthModal } from '@/app/ui/modals/Auth';
import { Button } from '@/app/ui/form';
import { useBreakpointCheck } from '@/app/hooks';

const PreAuthModal: FC = () => {
    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();

    useEffect(() => {
        if (breakpoint > Breakpoint.sm) modalCtx.closeModal();
    }, [breakpoint]);

    return (
        <BaseModal
            adaptedDefault
            title={'Tern Account'}
            classNameTitle={'justify-self-start text-heading   sm:landscape:ml-0'}
            classNameContent={cn(
                'w-full items-start mx-auto px-xs py-n place-items-center text-basic',
                'max-w-[23rem]',
                'sm:landscape:x-[max-w-[73rem],px-4xl]',
            )}
        >
            <div className={'flex w-full flex-col sm:landscape:flex-row sm:landscape:justify-between'}>
                <div>
                    <p>Your Tern account provides you with:</p>
                    <ul className={'mb-n mt-xs flex list-inside list-disc flex-col gap-y-xs'}>
                        <li>Single sign-on to the Tern ecosystem</li>
                        <li>Personalized recommendations</li>
                        <li>Test drives and other trials</li>
                        <li>And many more exclusive benefits</li>
                    </ul>
                </div>
                <div className={'w-full max-w-[19rem] place-self-center text-section-s font-bold sm:portrait:w-[85%]'}>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal />)}
                        className={'mb-xxs h-[2.7rem] w-full rounded-full bg-blue text-primary'}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal registration />)}
                        className={'h-[2.7rem] w-full rounded-full border-s border-blue'}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export { PreAuthModal };
