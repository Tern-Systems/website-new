'use client';

import { FC } from 'react';
import cn from 'classnames';

const PrimaryLabel: FC = () => (
    <span
        className={cn(
            `flex items-center justify-center`,
            `h-[0.8125rem] w-fit rounded-[0.25rem] bg-white-d0 px-5xs md:px-3xs lg:px-3xs`,
            `text-center text-8 text-gray md:x-[text-12,rounded-none,h-[1.125rem]] lg:x-[text-12,rounded-none,h-[1.125rem]]`,
        )}
    >
        Primary
    </span>
);

PrimaryLabel.displayName = PrimaryLabel.name;

export { PrimaryLabel };
