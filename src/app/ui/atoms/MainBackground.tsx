import React, { FC } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

interface Props {
    url: StaticImageData;
}

const MainBackground: FC<Props> = (props: Props) => (
    <div
        style={{ backgroundImage: `url("${props.url.src}")` }}
        className={cn(
            'max-w-dwv absolute bottom-0 right-0 top-0 h-screen max-h-[100rem] w-dvw bg-cover bg-center bg-no-repeat',
            'bg-right',
            'lg:bg-center',
        )}
    />
);

export { MainBackground };
