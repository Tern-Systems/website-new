'use client';

import { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { Route } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';

import { Button } from '@/app/ui/form';

enum CardsPerPage {
    AltDefault = 4,
    Default = 3,
    MD = 2,
    SM = 1,
}

const getAltSpinnerBtnCn = (alt?: true) =>
    cn('border-s border-blue text-blue disabled:x-[border-gray-l0,text-gray]  p-xs sm:p-4xs-1', {
        ['md:p-4xs']: alt,
    });

interface Props extends PropsWithChildren {
    data?: { title: string; link: Route; cards: ReactElement[]; altSpinner?: true };
    cardsPerPage?: { default: number; md: number; sm: number };
    className?: string;
    classNameTitle?: string;
    classNameUl?: string;
    classNameArrow?: string;
}

const SeriesCarousel: FC<Props> = (props: Props) => {
    const { data, cardsPerPage, className, classNameTitle, classNameUl, classNameArrow, children } = props;

    const breakpoint = useBreakpointCheck();
    const md = breakpoint <= Breakpoint.md;

    const defaultSpinner = !data?.altSpinner;
    const altCardsPerPage =
        cardsPerPage?.[breakpoint <= Breakpoint.sm ? 'sm' : breakpoint <= Breakpoint.md ? 'md' : 'default'] ??
        (defaultSpinner
            ? breakpoint <= Breakpoint.sm
                ? CardsPerPage.SM
                : md
                  ? CardsPerPage.MD
                  : CardsPerPage.Default
            : md
              ? CardsPerPage.MD
              : CardsPerPage.AltDefault);

    const cardCount: number | undefined = data?.cards.length;

    const [page, setPage] = useState<number>(0);
    const [maxPage, setMaxPage] = useState<number>(0);

    const carouselRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (cardCount) setMaxPage(Math.ceil(cardCount / altCardsPerPage));
    }, [cardCount, altCardsPerPage]);

    // Elements
    const renderCarouselBtn = (right?: true) => (
        <Button
            onClick={() => {
                if (carouselRef.current)
                    carouselRef.current.scrollLeft =
                        carouselRef.current.scrollLeft + (right ? 0.5 : -0.5) * window.outerWidth;
            }}
            className={cn(
                'absolute top-1/2 z-50 !-translate-y-1/2 size-5xl',
                right ? 'right-0 -rotate-90' : 'left-0 rotate-90',
                classNameArrow,
            )}
        />
    );

    const startIdx: number = page * altCardsPerPage;
    const AltCardsPage: ReactElement[] = data?.cards.slice(startIdx, startIdx + altCardsPerPage) ?? [];

    const Spinner: FC<{ className: string }> = (props: { className: string }) => (
        <span className={cn('ml-auto', props.className)}>
            <Button
                onClick={() => setPage((prevState) => (prevState <= 0 ? prevState : prevState - 1))}
                disabled={page <= 0}
                className={getAltSpinnerBtnCn(data?.altSpinner)}
            >
                ◀
            </Button>
            <span className={'mx-xxs sm:mx-5xs  text-16 sm:text-10'}>
                {page + 1} / {maxPage}
            </span>
            <Button
                onClick={() => setPage((prevState) => (prevState >= maxPage - 1 ? prevState : prevState + 1))}
                disabled={page >= maxPage - 1}
                className={getAltSpinnerBtnCn(data?.altSpinner)}
            >
                ▶
            </Button>
        </span>
    );

    return (
        <div
            className={cn(
                'relative',
                {
                    [defaultSpinner ? 'border-white md:p-n lg:p-xl border-b-s sm:border-0' : 'flex-grow flex flex-col']:
                        data,
                },
                className,
            )}
        >
            {data ? (
                <div className={cn(classNameTitle, 'justify-between flex')}>
                    <h3 className={cn('text-21 md:text-18 sm:text-16 mt-auto')}>{data?.title}</h3>
                    <Spinner className={cn()} />
                </div>
            ) : (
                renderCarouselBtn()
            )}
            <ul
                ref={carouselRef}
                className={cn(
                    'mx-auto grid w-fit max-w-full flex-grow grid-rows-1 gap-xl justify-items-center overflow-x-scroll',
                    'mt-xxs md:mt-xs lg:mt-s',
                    data?.altSpinner ? 'flex-grow' : 'h-full',
                    classNameUl,
                )}
            >
                {data ? AltCardsPage : children}
            </ul>
        </div>
    );
};

SeriesCarousel.displayName = SeriesCarousel.name;

export { SeriesCarousel };
