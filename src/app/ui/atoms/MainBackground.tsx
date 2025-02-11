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
            'absolute top-0 right-0 bottom-0 w-dvw max-w-dwv h-screen max-h-[100rem] bg-cover bg-center bg-no-repeat',
            'bg-right',
            'lg:bg-center',
        )}
    />
);


export { MainBackground };
