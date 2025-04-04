'use client';

import { FC } from 'react';
import cn from 'classnames';

const PrimaryLabel: FC = () => (
    <span
        className={cn(
            `flex items-center justify-center bg-white-d0 px-5xs`,
            `text-center text-8 text-gray rounded-xxs-1`,
            `md:x-[h-4xs,px-3xs,text-12,rounded-none]`,
            `lg:x-[h-4xs,px-3xs,text-12,rounded-none]`,
        )}
    >
        Primary
    </span>
);

PrimaryLabel.displayName = PrimaryLabel.name;

export { PrimaryLabel };
