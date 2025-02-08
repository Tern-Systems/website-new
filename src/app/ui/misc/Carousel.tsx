import React, {FC, PropsWithChildren, useRef} from "react";
import cn from "classnames";

import {Button} from "@/app/ui/form";


interface Props extends PropsWithChildren {
    className?: string;
    classNameUl?: string;
    classNameArrow?: string;
}

const Carousel: FC<Props> = (props: Props) => {
    const {className, classNameUl, classNameArrow, children} = props;

    const carouselRef = useRef<HTMLUListElement | null>(null);

    const renderCarouselBtn = (right?: true) => (
        <Button
            onClick={() => {
                if (carouselRef.current)
                    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft + (right ? 0.5 : -0.5) * window.outerWidth
            }}
            icon={'chevron'}
            className={cn(
                'absolute z-50 top-1/2 !-translate-y-1/2 [&_*]:size-[2.875rem]',
                right ? 'right-0 -rotate-90' : 'left-0 rotate-90',
                classNameArrow
            )}
        />
    );

    return (
        <div className={cn('relative', className)}>
            {renderCarouselBtn()}
            <ul
                ref={carouselRef}
                className={cn('flex-grow grid grid-rows-1 mx-auto w-fit gap-xl h-full max-w-full overflow-x-scroll', classNameUl)}
            >
                {children}
            </ul>
            {renderCarouselBtn(true)}
        </div>
    )
}


export {Carousel};
