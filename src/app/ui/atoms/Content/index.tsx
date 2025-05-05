import { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import { ArrayOfLength } from '@/app/types/utils';
import { GradientType } from '@/app/ui/atoms/Gradient';

import { Gradient, H3 } from '@/app/ui/atoms';

type ContentGradientType = 'default-double' | 'to-top' | 'long-to-bottom' | 'blue-to-right';

const GRADIENT_CN: Record<ContentGradientType, ArrayOfLength<GradientType | undefined, 2>> = {
    'default-double': ['blue-to-bottom', 'blue-to-top'],
    'to-top': [undefined, 'blue-to-top'],
    'long-to-bottom': ['long-blue-to-bottom', undefined],
    'blue-to-right': ['blue-to-right', undefined],
};

interface Props extends HTMLAttributes<HTMLDivElement> {
    type?: ContentGradientType;
    heading?: ReactNode;
}

const Content: FC<Props> = (props: Props) => {
    const { children, type, heading, className, ...divProps } = props;

    const [main, toTop] = GRADIENT_CN[type ?? 'default-double'];

    return (
        <div
            {...divProps}
            className={cn(
                'relative pb-[25.625rem] min-h-screen',
                { ['pt-[9.375rem]']: !heading && main !== 'blue-to-right' },
                className,
            )}
        >
            {main ? <Gradient type={main} /> : null}
            {heading ? (
                <H3
                    type={'large'}
                    className={'mt-xl text-center font-light'}
                >
                    {heading}
                </H3>
            ) : null}
            {children}
            {toTop ? <Gradient type={toTop} /> : null}
        </div>
    );
};

Content.displayName = Content.name;

export { Content };
