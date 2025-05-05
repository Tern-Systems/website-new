'use client';

import { FC, PropsWithChildren } from 'react';
import Image, { StaticImageData } from 'next/image';

import { Gradient, H3 } from '@/app/ui/atoms';

interface Props extends PropsWithChildren {
    image: StaticImageData;
    heading: string;
}

const ImageCard: FC<Props> = (props: Props) => {
    const { image, heading, children } = props;

    return (
        <div className={'lg:relative  grid grid-flow-row  sm:gap-y-xs gap-y-n'}>
            <div className={'contents'}>
                <Gradient />
                <Image
                    src={image}
                    alt={heading}
                    className={'-z-50 w-full h-auto  row-start-2 lg:row-start-1'}
                />
            </div>
            <div className={'contents lg:flex  lg:x-[absolute,top-[6.44rem],left-xxl,flex-col,gap-y-n]'}>
                <H3>{heading}</H3>
                <p className={'!leading-l text-16'}>{children}</p>
            </div>
        </div>
    );
};

ImageCard.displayName = ImageCard.name;

export { ImageCard };
