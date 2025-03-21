import React, { FC } from 'react';
import cn from 'classnames';

const PrimaryLabel: FC = () => (
    <span
        className={cn(
            `flex items-center justify-center`,
            `h-[.8125rem] w-fit rounded-[4px] bg-white-d0 px-5xs md:px-3xs lg:px-3xs`,
            `text-center text-[.5rem] text-gray md:x-[text-12,rounded-none,h-[1.125rem]] lg:x-[text-12,rounded-none,h-[1.125rem]]`,
        )}
    >
        Primary
    </span>
);

export { PrimaryLabel };
