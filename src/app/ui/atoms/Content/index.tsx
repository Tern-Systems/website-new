import { FC, HTMLProps } from 'react';
import cn from 'classnames';

import styles from '@/app/common.module.css';

interface Props extends HTMLProps<HTMLDivElement> {}

const Content: FC<Props> = (props: Props) => {
    const { children, className } = props;
    return (
        <div
            {...props}
            className={cn(styles.content, 'pt-[9.375rem] pb-[25.625rem]', className)}
        >
            <div
                className={
                    'absolute -z-10 inset-0 bg-[linear-gradient(to_bottom,var(--bg-blue)_50rem,transparent_60rem)]'
                }
            />
            {children}
            <div
                className={'absolute -z-10 inset-0 bg-[linear-gradient(to_top,var(--bg-blue)_20rem,transparent_40rem)]'}
            />
        </div>
    );
};
Content.displayName = Content.name;

export { Content };
