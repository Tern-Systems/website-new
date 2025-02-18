import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { LAYOUT } from '@/app/static';

import { Breakpoint, useBreakpointCheck } from '@/app/hooks/useBreakpointCheck';
import { useModal, useUser } from '@/app/context';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout/Link';
import { AuthModal } from '@/app/ui/modals';

import SVG_PROFILE from '/public/images/icons/profile.svg';
import { useOuterClickClose } from '@/app/hooks/useOuterClickClose';

const AUTH_BTNS: { title: string; action: string; description: string }[] = [
    { title: 'Tern Account', action: 'Login', description: 'Log in to access your Tern Account' },
    { title: 'Register for an account', action: 'Sign Up', description: 'Create a Tern account for richer experience' },
];

const ProfileMenu: FC = () => {
    const modalCtx = useModal();
    const userCtx = useUser();
    const isSm = useBreakpointCheck() <= Breakpoint.xxs;

    const [opened, setOpened] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null);

    useOuterClickClose(ref, opened, setOpened);

    let ProfileMenu: ReactElement | null = null;
    if (opened) {
        if (userCtx.isLoggedIn) {
            const ProfileMenuLi: ReactElement[] = LAYOUT.profileLinks.map((link, idx) => (
                <li
                    key={link + idx}
                    className={cn(`w-full pb-xs`, `[&:not(:last-of-type)]:x-[border-b-s,pt-xs]`)}
                >
                    <PageLink
                        href={link}
                        className={`bg-control relative flex justify-center`}
                        onClick={() => setOpened(false)}
                    />
                </li>
            ));

            ProfileMenuLi.push(
                <li
                    key={'logout' + LAYOUT.profileLinks.length}
                    onClick={() => {
                        setOpened(false);
                        userCtx.removeSession();
                    }}
                    className={`cursor-pointer pt-xs`}
                >
                    Log Out
                </li>,
            );
            ProfileMenu = (
                <ul
                    className={cn(
                        `absolute right-0 top-[calc(1px+var(--h-heading))] z-10 w-[9.1875rem] text-nowrap bg-gray-d1 text-basic`,
                        `[&>li]:x-[px-xs,py-xxs]`,
                    )}
                >
                    {ProfileMenuLi}
                </ul>
            );
        } else {
            const ProfileMenuLi: ReactElement[] = AUTH_BTNS.map((entry, idx) => (
                <li
                    key={entry.title + idx}
                    className={'flex flex-col gap-y-4xs'}
                >
                    <p className={'text-section-s'}>{entry.title}</p>
                    <p className={'text-gray'}>{entry.description}</p>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal registration={idx === 1} />, { darkenBg: !isSm })}
                        className={cn(
                            `w-full rounded-full border-s border-gray py-5xs text-section font-bold capitalize`,
                            idx ? 'bg-black text-primary' : 'bg-white text-black',
                        )}
                    >
                        {entry.action}
                    </Button>
                </li>
            ));
            ProfileMenu = (
                <div
                    className={cn(
                        'absolute right-0 z-10 mt-5xs rounded-n border-s p-n',
                        'text-nowrap border-gray-l0 bg-black',
                    )}
                >
                    <h2 className={'text-heading font-bold'}>Tern Account</h2>
                    <ul className={'mt-xs flex flex-col gap-y-xs'}>{ProfileMenuLi}</ul>
                </div>
            );
        }
    }

    const userBtns: ReactElement | ReactElement[] = (
        <div
            ref={ref}
            onClick={() => setOpened((prevState) => !prevState)}
            className={'relative'}
        >
            <div className={cn('h-full content-center px-s', { ['bg-gray-d1']: opened })}>
                <Image
                    src={userCtx.userData?.photo ? userCtx.userData?.photo : SVG_PROFILE}
                    width={29}
                    height={29}
                    alt={'profile icon'}
                    className={'!w-heading-icon cursor-pointer rounded-full'}
                />
            </div>
            {ProfileMenu}
        </div>
    );

    return <div className={'ml-auto flex h-full gap-[0.75rem]'}>{userBtns}</div>;
};

export { ProfileMenu };
