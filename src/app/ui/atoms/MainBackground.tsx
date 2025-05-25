'use client';

import { FC } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

// TODO rework to be section + gradients
interface Props {
    url: StaticImageData | string;
    className?: string;
    gradient?: string;
    style?: React.CSSProperties;
}

const MainBackground: FC<Props> = (props: Props) => {
    const { className, gradient, style } = props;
    const url = typeof props.url === 'string' ? props.url : props.url.src;
    const backgroundImage = gradient ? `${gradient}, url("${url}")` : `url("${url}")`;

    return (
        <>
            <div
                style={{
                    backgroundImage,
                    ...style,
                }}
                className={cn(
                    'absolute max-w-dwv min-h-full h-screen max-h-[100rem] w-dvw',
                    'bg-fixed bg-cover bg-center bottom-0 right-0 top-0',
                    className,
                )}
            />
        </>
    );
};

MainBackground.displayName = MainBackground.name;

export { MainBackground };
