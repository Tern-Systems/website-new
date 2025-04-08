'use client';

import { FC, PropsWithChildren } from 'react';

import styles from '@/app/common.module.css';

interface Props extends PropsWithChildren {
    heading: string;
    className?: string;
    classNameContentWrapper?: string;
    classNameWrapper?: string;
}

const Highlighted: FC<Props> = (props: Props) => {
    const { heading, className, classNameContentWrapper, classNameWrapper, children } = props;

    return (
        <div
            className={`${styles.highlight} max-h-[80%] max-w-[62.5rem] sm:max-h-[75vh] sm:portrait:h-[calc(100%-2*3.06rem)] sm:landscape:my-xs sm:landscape:h-[calc(100%-calc(2*var(--p-xs)))] ${classNameWrapper} flex flex-col justify-center`}
        >
            <h1 className={`flex-none text-36 sm:text-27 sm:landscape:text-20`}>{heading}</h1>
            <div className={`mt-xxl flex-1 overflow-y-auto sm:mt-xs ${classNameContentWrapper}`}>
                <div
                    className={`flex h-full flex-col gap-y-l whitespace-pre-line text-27 font-bold leading-[120%] sm:text-18 sm:landscape:gap-y-xs ${className}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

Highlighted.displayName = Highlighted.name;

export { Highlighted };
