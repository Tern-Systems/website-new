'use client';

import { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import { H3 } from '@/app/ui/atoms';

interface Props extends HTMLAttributes<HTMLDivElement> {
    type?: 'bottom' | 'default' | 'long';
    heading?: ReactNode;
}

const Content: FC<Props> = (props: Props) => {
    const { children, type = 'default' as Props['type'], heading, className, ...divProps } = props;

    const top = type !== 'bottom';

    return (
        <div
            {...divProps}
            className={cn('relative pb-[25.625rem] min-h-screen', { ['pt-[9.375rem]']: !heading && top }, className)}
        >
            {top ? (
                <div
                    className={cn(
                        'absolute -z-10 inset-0',
                        type === 'long'
                            ? 'bg-[linear-gradient(to_bottom,var(--bg-blue)_1rem,transparent_25rem)]'
                            : 'bg-[linear-gradient(to_bottom,var(--bg-blue)_5rem,transparent_9rem)]',
                    )}
                />
            ) : null}
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
