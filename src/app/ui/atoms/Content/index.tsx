'use client';

import { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import { H3 } from '@/app/ui/atoms';

interface Props extends HTMLAttributes<HTMLDivElement> {
    heading?: string;
}

const Content: FC<Props> = (props: Props) => {
    const { children, heading, className, ...divProps } = props;
    return (
        <div
            {...divProps}
            className={cn('relative pb-[25.625rem]', { ['pt-[9.375rem]']: !heading }, className)}
        >
            <div
                className={
                    'absolute -z-10 inset-0 bg-[linear-gradient(to_bottom,var(--bg-blue)_5rem,transparent_9rem)]'
                }
            />
            {heading ? (
                <H3
                    type={'large'}
                    className={'mt-xl text-center font-light'}
                >
                    {heading}
                </H3>
            ) : null}
            {children}
            <div
                className={'absolute -z-10 inset-0 bg-[linear-gradient(to_top,var(--bg-blue)_5rem,transparent_40rem)]'}
            />
        </div>
    );
};
Content.displayName = Content.name;

export { Content };
