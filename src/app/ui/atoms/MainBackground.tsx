'use client';

import { FC } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

interface Props {
    url: StaticImageData | string;
    className?: string;
}

const MainBackground: FC<Props> = (props: Props) => {
    const { className } = props;

    const url = typeof props.url === 'string' ? props.url : props.url.src;

    return (
        <>
            <div
                style={{ backgroundImage: `url("${url}")` }}
                className={cn('absolute inset-0 bg-no-repeat bg-cover', className)}
            />
        </>
    );
};

MainBackground.displayName = MainBackground.name;

export { MainBackground };
