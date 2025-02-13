import React, { FC } from 'react';
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
                className={cn(
                    'max-w-dwv absolute bottom-0 right-0 top-0 h-screen max-h-[100rem] w-dvw bg-cover bg-center bg-no-repeat',
                    'bg-right',
                    'lg:bg-bottom',
                    className,
                )}
            />
        </>
    );
};

export { MainBackground };
