import { FC } from 'react';
import cn from 'classnames';

type GradientType =
    | 'default-black-to-right'
    | 'thick-black-to-right'
    | 'blue-to-right'
    | 'blue-to-top'
    | 'long-blue-to-bottom'
    | 'blue-to-bottom';

const TYPE_CN: Record<GradientType, string> = {
    'default-black-to-right': 'bg-[linear-gradient(to_right,black_25%,transparent_50%)]',
    'thick-black-to-right': 'bg-[linear-gradient(to_right,black_50%,transparent_100%)]',
    'blue-to-right': 'bg-[linear-gradient(to_right,var(--bg-blue)_0,transparent_60%)]',
    'long-blue-to-bottom': 'bg-[linear-gradient(to_bottom,var(--bg-blue)_1rem,transparent_25rem)]',
    'blue-to-top': 'bg-[linear-gradient(to_top,var(--bg-blue)_5rem,transparent_40rem)]',
    'blue-to-bottom': 'bg-[linear-gradient(to_bottom,var(--bg-blue)_5rem,transparent_9rem)]',
};

interface Props {
    type?: GradientType;
}

const Gradient: FC<Props> = (props: Props) => (
    <div
        className={cn('absolute -z-10 inset-0 scale-[100.02%] h-full', TYPE_CN[props.type ?? 'default-black-to-right'])}
    />
);

Gradient.displayName = Gradient.name;

export type { GradientType };
export { Gradient };
