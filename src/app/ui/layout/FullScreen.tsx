import React, { FC, PropsWithChildren } from 'react';

import { Route } from '@/app/static';

import { PageLink } from '@/app/ui/layout/Link';
import { useNavigate } from '@/app/hooks';
import { useLayout, useModal } from '@/app/context';

import { Insignia } from '@/app/ui/misc';
import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

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
            className={`relative h-dvh max-h-dvh bg-white text-heading-s text-gray ${modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'}`}
        >
            <div className={`flex h-heading items-center justify-between p-[1.25rem] md:hidden lg:hidden`}>
                <Insignia />
                <Button
                    icon={'close'}
                    onClick={() => navigate(backButtonSection)}
                    classNameIcon={'[&_path]:fill-blue [&&_*]:w-[1.125rem] h-auto'}
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
                    iconClassName={'mr-[0.5rem]'}
                />
                {children}
            </div>
        </div>
    );
};

export { FullScreenLayout };
