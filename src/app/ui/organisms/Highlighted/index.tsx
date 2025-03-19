import React, { FC, PropsWithChildren } from 'react';

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
            <h1 className={`flex-none text-heading-l sm:text-heading sm:landscape:text-section`}>{heading}</h1>
            <div className={`mt-[3rem] flex-1 overflow-y-auto sm:mt-xs ${classNameContentWrapper}`}>
                <div
                    className={`flex h-full flex-col gap-y-[2rem] whitespace-pre-line text-heading font-bold leading-[120%] sm:text-section-s sm:landscape:gap-y-[1.2rem] ${className}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

Highlighted.displayName = 'Highlighted';

export { Highlighted };
