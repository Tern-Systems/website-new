import React, { FC } from 'react';
import cn from 'classnames';

const PrimaryLabel: FC = () => (
    <span
        className={cn(
            `bg-control-white-d0 rounded-smallest1 col-start-2 block w-[4.15rem] py-[0.1rem]`,
            `mt-[0.62rem] text-center font-oxygen text-section-xxs text-gray`,
        )}
    >
        Primary
    </span>
);

export { PrimaryLabel };
