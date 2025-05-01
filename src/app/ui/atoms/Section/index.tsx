import { FC, HTMLAttributes } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { Gradient, MainBackground } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';

type SectionType = 'full-screen' | 'short';

const TYPE_CN: Record<SectionType, string> = {
    short: 'h-[21.625rem]',
    'full-screen': styles.fullHeightSection,
};

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
    type?: SectionType;
    background?: { image?: StaticImageData; gradient?: 'left' };
    className?: {
        section?: string;
        content?: string;
        background?: string;
    };
}

const Section: FC<Props> = (props: Props) => {
    const { children, className, type, background, ...sectionProps } = props;

    return (
        <section
            {...sectionProps}
            className={cn(styles.section, type ? TYPE_CN[type] : '', className?.section)}
        >
            {background?.image ? (
                <MainBackground
                    url={background.image}
                    className={cn('-z-10', className?.background)}
                />
            ) : null}
            <div className={cn(styles.content, 'flex flex-col justify-between  [&_*]:leading-n', className?.content)}>
                {children}
            </div>
            {background?.gradient ? <Gradient /> : null}
        </section>
    );
};

Section.displayName = Section.name;

export { Section };
