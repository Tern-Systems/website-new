import { FC } from 'react';
import cn from 'classnames';

interface Props {
    type?: 'default' | 'thick';
}

const Gradient: FC<Props> = (props: Props) => (
    <div
        className={cn(
            'absolute -z-10 inset-0 scale-[101%] h-full',
            props.type === 'thick'
                ? 'bg-[linear-gradient(to_right,black_50%,transparent_100%)]'
                : 'bg-[linear-gradient(to_right,black_25%,transparent_50%)]',
        )}
    />
);

Gradient.displayName = Gradient.name;

export { Gradient };
