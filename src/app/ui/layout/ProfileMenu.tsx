'use client';

import { FC, ReactElement, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { DataTestID } from '@/tests/static';

import { Breakpoint } from '@/app/static';

import { LAYOUT } from '@/app/static';

import { useBreakpointCheck, useModal, useOuterClickClose, useUser } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout/Link';
import { AuthModal } from '@/app/ui/modals';

import SVG_PROFILE from '@/assets/images/icons/profile.svg';

const TestID = DataTestID.layout.profile;

// Helper function to determine if current page requires member info
const checkIfPageRequiresMemberInfo = () => {
    // Get current path
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // List of paths that require member info
    const memberPaths = [
        '/profile',
        '/account',
        '/dashboard',
        '/settings',
        // Add other member-only paths
    ];

    // Check if current path starts with any member path
    return memberPaths.some((path) => currentPath.startsWith(path));
};

const AUTH_BUTTONS: {
    testID: string;
    title: string;
    action: string;
    description: string;
}[] = [
    {
        testID: TestID.loginButton,
        title: 'Tern Account',
        action: 'Login',
        description: 'Log in to access your Tern Account',
    },
    {
        testID: TestID.signUpButton,
        title: 'Register for an account',
        action: 'Sign Up',
        description: 'Create a Tern account for richer experience',
    },
];

const ProfileMenu: FC = () => {
    const modalCtx = useModal();
    const userCtx = useUser();
    const sm = useBreakpointCheck() <= Breakpoint.xxs;
    const pathname = usePathname();

    const [opened, setOpened] = useState(false);
    const [previousLoginState, setPreviousLoginState] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null);

    // Create a custom handler for the outer click that safely sets opened
    const handleOuterClick = (event: MouseEvent) => {
        if (opened && ref.current && !ref.current.contains(event.target as Node)) {
            setOpened(false);
        }
    };

    // Set up the event listener manually
    useEffect(() => {
        document.addEventListener('mousedown', handleOuterClick);
        return () => {
            document.removeEventListener('mousedown', handleOuterClick);
        };
    }, [opened]);

    // Track login state changes to detect logout
    useEffect(() => {
        // If user was logged in but now isn't, they just logged out
        if (previousLoginState && userCtx.isLoggedIn === false) {
            // Close the dropdown menu on logout
            setOpened(false);

            // If on a page requiring member info, show login modal
            if (checkIfPageRequiresMemberInfo()) {
                modalCtx.openModal(<AuthModal registration={false} />, {
                    darkenBg: !sm,
                });
            }
        }

        // Update the previous login state - ensure it's a boolean
        setPreviousLoginState(!!userCtx.isLoggedIn);
    }, [userCtx.isLoggedIn, modalCtx, sm]);

    // If the user is not logged in and the page requires member info,
    // don't render the profile menu at all
    if (userCtx.isLoggedIn === false && checkIfPageRequiresMemberInfo()) {
        return null;
    }

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
                    />
                </li>
            ));

            ProfileMenuLi.push(
                <li
                    data-testid={TestID.logoutButton}
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
                    data-testid={TestID.menu}
                    className={cn(
                        `absolute right-0 top-[calc(1px+var(--h-heading))] z-10 w-[9.1875rem] text-nowrap bg-gray-d1 text-16`,
                        `[&>li]:x-[px-xs,py-xxs]`,
                    )}
                >
                    {ProfileMenuLi}
                </ul>
            );
        } else {
            // If not logged in, only show login dropdown on pages that don't require member info
            if (!checkIfPageRequiresMemberInfo()) {
                const ProfileMenuLi: ReactElement[] = AUTH_BUTTONS.map((entry, idx) => (
                    <li
                        key={entry.title + idx}
                        className={'flex flex-col gap-y-4xs'}
                    >
                        <p className={'text-18'}>{entry.title}</p>
                        <p className={'text-gray'}>{entry.description}</p>
                        <Button
                            data-testid={entry.testID}
                            onClick={() =>
                                modalCtx.openModal(<AuthModal registration={idx === 1} />, {
                                    darkenBg: !sm,
                                })
                            }
                            className={cn(
                                `w-full rounded-full border-s border-gray py-5xs text-20 font-bold capitalize`,
                                idx ? 'bg-black text-primary' : 'bg-white text-black',
                            )}
                        >
                            {entry.action}
                        </Button>
                    </li>
                ));
                ProfileMenu = (
                    <div
                        data-testid={TestID.menuUnlogged}
                        className={cn(
                            'absolute right-0 z-10 mt-5xs rounded-n border-s p-n',
                            'text-nowrap border-gray-l0 bg-black',
                        )}
                    >
                        <h2 className={'text-27 font-bold'}>Tern Account</h2>
                        <ul className={'mt-xs flex flex-col gap-y-xs'}>{ProfileMenuLi}</ul>
                    </div>
                );
            }
        }
    }

    const userBtns: ReactElement | ReactElement[] = (
        <div
            onClick={() => setOpened((prevState) => !prevState)}
            className={'relative'}
        >
            <div
                data-testid={TestID.toggle}
                className={cn('flex items-center h-full px-s', {
                    ['bg-gray-d1']: opened,
                })}
            >
                <Image
                    src={userCtx.userData?.photo ? userCtx.userData?.photo : SVG_PROFILE}
                    width={29}
                    height={29}
                    alt={'profile icon'}
                    className={'!w-heading-icon cursor-pointer'}
                />
            </div>
            {ProfileMenu}
        </div>
    );

    return (
        <div
            ref={ref}
            className={'ml-auto flex h-full gap-3xs'}
        >
            {userBtns}
        </div>
    );
};

ProfileMenu.displayName = ProfileMenu.name;

export { ProfileMenu };
