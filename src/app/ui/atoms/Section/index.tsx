import { FC, HTMLAttributes } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { MainBackground } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
    screenHeight?: true;
    background?: { image: StaticImageData; gradient?: 'left' };
    className?: {
        section?: string;
        content?: string;
        background?: string;
    };
}

const Section: FC<Props> = (props: Props) => {
    const { children, className, screenHeight, background } = props;
    return (
        <section
            {...props}
            className={cn(styles.section, { [styles.fullHeightSection]: screenHeight }, className?.section)}
        >
            {background ? (
                <MainBackground
                    url={background.image}
                    className={cn('-z-10', className?.background)}
                />
            ) : null}
            <div className={cn(styles.content, '[&_*]:leading-n', className?.content)}>{children}</div>
            {background?.gradient ? (
                <div className='absolute -z-10 inset-0 h-full  bg-gradient-to-r from-black to-transparent to-50%' />
            ) : null}
        </section>
    );
};

Section.displayName = Section.name;

export { Section };
