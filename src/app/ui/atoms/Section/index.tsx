import { FC, HTMLAttributes } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { Gradient, MainBackground } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
    type?: 'full-screen' | 'short';
    background?: { image: StaticImageData; gradient?: 'left' };
    className?: {
        section?: string;
        content?: string;
        background?: string;
    };
}

const Section: FC<Props> = (props: Props) => {
    const { children, className, type, background, ...sectionProps } = props;

    let typeCN: string | undefined;
    switch (type) {
        default:
            break;
        case 'full-screen':
            typeCN = styles.fullHeightSection;
            break;
        case 'short':
            typeCN = 'h-[21.625rem]';
            break;
    }

    return (
        <section
            {...sectionProps}
            className={cn(styles.section, typeCN, className?.section)}
        >
            {background ? (
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
