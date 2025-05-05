'use client';

import { FC, ReactElement } from 'react';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

import { H4 } from '@/app/ui/atoms';

interface Props {
    image: StaticImageData;
    items: { title: string; description: string }[];
}

const ImageList: FC<Props> = (props: Props) => {
    const { image, items } = props;

    const ItemsLi: ReactElement[] = items.map((item, idx) => (
        <li
            key={item.title + idx}
            className={cn(
                '[&:not(:last-of-type)]:border-b-s border-gray-l2',
                'md:px-3xs lg:px-s',
                'py-xs md:py-[1.31rem] lg:py-[2.31rem]',
            )}
        >
            <H4>{item.title}</H4>
            <p className={'mt-xs md:mt-s lg:mt-n'}>{item.description}</p>
        </li>
    ));

    return (
        <div
            className={cn(
                'grid  sm:grid-cols-1 grid-cols-2',
                'sm:gap-y-xl  md:gap-x-[1rem] lg:gap-x-s',
                'sm:bg-transparent bg-gray',
            )}
        >
            <div className={'contents'}>
                <Image
                    src={image}
                    alt={'chip microscope'}
                    className={'object-cover h-full'}
                />
            </div>
            <ul className={'flex flex-col  py-xs md:py-[1.1rem] lg:py-[2.88rem]  sm:px-xs  sm:bg-gray'}>{ItemsLi}</ul>
        </div>
    );
};

export type { Props as ImageListProps };
export { ImageList };
