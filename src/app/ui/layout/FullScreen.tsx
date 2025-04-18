'use client';

import { FC, PropsWithChildren } from 'react';

import { Route } from '@/app/static';

import { PageLink } from '@/app/ui/layout/Link';
import { useNavigate } from '@/app/hooks';
import { useLayout, useModal } from '@/app/hooks';

import { Insignia } from '@/app/ui/organisms';
import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface Props extends PropsWithChildren {
    backButtonSection: Route;
}

const FullScreenLayout: FC<Props> = (props: Props) => {
    const { children, backButtonSection } = props;
    const layoutCtx = useLayout();
    const modalCtx = useModal();
    const [navigate] = useNavigate();

    return (
        <div
            className={`relative h-dvh max-h-dvh bg-white text-21 text-gray ${modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'}`}
        >
            <div className={`flex h-heading items-center justify-between p-xs md:hidden lg:hidden`}>
                <Insignia className={'[&_path]:fill-black'} />
                <Button
                    icon={faX}
                    onClick={() => navigate(backButtonSection)}
                    classNameIcon={'[&_path]:fill-blue [&_*]:w-4xs sm:[&_*]:w-7xs'}
                />
            </div>
            <hr className={`md:hidden lg:hidden`} />
            <div
                className={`relative h-full overflow-y-scroll sm:h-[calc(100dvh-var(--h-heading-modal))] sm:landscape:h-[76dvh] ${layoutCtx.isFade ? styles.fadeOut : styles.fadeIn}`}
            >
                <PageLink
                    href={backButtonSection}
                    icon={'back'}
                    className={'absolute left-[1.8rem] top-[1.7rem] z-50 font-bold sm:hidden'}
                    iconClassName={'mr-4xs-1'}
                />
                {children}
            </div>
        </div>
    );
};

FullScreenLayout.displayName = FullScreenLayout.name;

export { FullScreenLayout };
