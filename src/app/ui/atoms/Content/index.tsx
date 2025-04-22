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
                    'absolute -z-10 inset-0 h-full  bg-gradient-to-b from-blue via-blue via-10% to-transparent to-15%'
                }
            />
            {children}
            <div
                className={
                    'absolute -z-10 inset-0 h-full  bg-gradient-to-t from-blue via-blue via-10% to-transparent to-20%'
                }
            />
        </div>
    );
};
Content.displayName = Content.name;

export { Content };
