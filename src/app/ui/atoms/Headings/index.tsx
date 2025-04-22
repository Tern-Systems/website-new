import { FC, HTMLProps } from 'react';
import cn from 'classnames';

interface Props extends HTMLProps<HTMLHeadingElement> {}

const H1: FC<Props> = (props: Props) => (
    <h1
        {...props}
        className={cn('text-32 md:text-48 lg:text-64', props.className)}
    >
        {props.children}
    </h1>
);

const H2: FC<Props> = (props: Props) => (
    <h1
        {...props}
        className={cn('text-18 md:text-24 lg:text-32', props.className)}
    >
        {props.children}
    </h1>
);

const H3: FC<Props> = (props: Props) => (
    <h1
        {...props}
        className={cn('text-27 md:text-32', props.className)}
    >
        {props.children}
    </h1>
);

H1.displayName = H1.name;
H2.displayName = H2.name;
H3.displayName = H3.name;

export { H1, H2, H3 };
