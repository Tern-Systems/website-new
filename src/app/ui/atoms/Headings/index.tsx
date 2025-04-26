import { FC, HTMLProps } from 'react';
import cn from 'classnames';

interface Props extends HTMLProps<HTMLHeadingElement> {}

interface TypeProps extends Props {
    type?: 'large' | 'default';
}

const H1: FC<TypeProps> = (props: TypeProps) => {
    const { children, className, type, ...h1Props } = props;

    let typeCN: string;
    switch (type) {
        default:
        case 'default':
            typeCN = 'text-32 md:text-48 lg:text-64';
            break;
        case 'large':
            typeCN = 'w-[65%] md:w-[65%] lg:w-[75%]  text-40 md:text-64 lg:text-96';
            break;
    }

    return (
        <h1
            {...h1Props}
            className={cn(typeCN, '!leading-l', className)}
        >
            {children}
        </h1>
    );
};

const H2: FC<Props> = (props: Props) => (
    <h2
        {...props}
        className={cn('!leading-l  text-18 md:text-24 lg:text-32', props.className)}
    >
        {props.children}
    </h2>
);

const H3: FC<TypeProps> = (props: TypeProps) => {
    const { children, className, type, ...h3Props } = props;

    let typeCN: string;
    switch (type) {
        default:
        case 'default':
            typeCN = 'text-21 md:text-27 md:text-32';
            break;
        case 'large':
            typeCN = 'text-24 md:text-27 lg:text-40';
            break;
    }

    return (
        <h3
            {...h3Props}
            className={cn(typeCN, '!leading-n', className)}
        >
            {children}
        </h3>
    );
};

H1.displayName = H1.name;
H2.displayName = H2.name;
H3.displayName = H3.name;

export { H1, H2, H3 };
