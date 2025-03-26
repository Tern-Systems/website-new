'use client';

import { FC } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks';

import SVG_LOGO from '@/assets/images/tern-logo.svg';

interface Props {
    className?: string;
}

const Insignia: FC<Props> = (props: Props) => {
    const [navigate] = useNavigate();
    return (
        <div className={'contents'}>
            <ReactSVG
                src={SVG_LOGO.src}
                onClick={() => navigate(Route.Home)}
                className={cn('cursor-pointer [&_*]:x-[w-fit,!h-insignia]', props.className)}
            />
        </div>
    );
};

export { Insignia };
