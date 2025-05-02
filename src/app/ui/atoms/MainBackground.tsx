'use client';

import { FC } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

// TODO rework to be section + gradients
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
                className={cn(
                    'absolute max-w-dwv min-h-full h-screen max-h-[100rem] w-dvw',
                    'bg-fixed bg-cover bg-top bottom-0 right-0 top-0',
                    className,
                )}
            />
        </>
    );
};

MainBackground.displayName = MainBackground.name;

export { MainBackground };
