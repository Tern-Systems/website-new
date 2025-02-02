import React, {FC, PropsWithChildren, useRef} from "react";
import cn from "classnames";

import {Button} from "@/app/ui/form";


interface Props extends PropsWithChildren {
    className?: string;
    classNameUl?: string;
}

const Carousel: FC<Props> = (props: Props) => {
    const {className, classNameUl, children} = props;

    const carouselRef = useRef<HTMLUListElement | null>(null);

    const renderCarouselBtn = (right?: true) => (
        <Button
            onClick={() => {
                if (carouselRef.current)
                    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft + (right ? 0.5 : -0.5) * window.outerWidth
            }}
            icon={'chevron'}
            className={cn('absolute z-50 top-1/2 !-translate-y-1/2 [&_*]:size-[2.875rem]  lg:hidden', right ? 'right-0' : 'left-0')}
            classNameIcon={right ? '-rotate-90' : 'rotate-90'}
        />
    );

    return (
        <div className={cn('relative', className)}>
            {renderCarouselBtn()}
            <ul
                ref={carouselRef}
                className={cn(classNameUl,
                    'flex-grow grid grid-rows-1 mx-auto w-fit gap-[--p-content-xl] h-full max-w-full overflow-x-scroll',
                    'grid-cols-[repeat(3,22rem)]',
                )}
            >
                {children}
            </ul>
            {renderCarouselBtn(true)}
        </div>
    )
}


export {Carousel};
