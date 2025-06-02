'use client';

import { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { Route } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

enum CardsPerPage {
    AltDefault = 4,
    Default = 3,
    MD = 2,
    SM = 1,
}

const getAltSpinnerBtnCn = (alt?: true) =>
    cn('p-xs sm:p-4xs-1 border-s border-blue text-blue disabled:x-[border-gray-l0,text-gray]', {
        'md:p-4xs': alt,
    });

interface Props extends PropsWithChildren {
    altData?: { title: string; link: Route; cards: ReactElement[]; altSpinner?: true };
    cardsPerPage?: { default: number; md: number; sm: number };
    className?: string;
    classNameUl?: string;
    classNameTitle?: string;
    classNameArrow?: string;
    type?: true;
}

const Carousel: FC<Props> = (props: Props) => {
    const { altData, cardsPerPage, className, classNameTitle, classNameUl, classNameArrow, children, type } = props;

    const breakpoint = useBreakpointCheck();
    const isMD = breakpoint <= Breakpoint.md;
    const isSM = breakpoint <= Breakpoint.sm;

    const defaultSpinner = !altData?.altSpinner;
    const perPage =
        cardsPerPage?.[breakpoint <= Breakpoint.sm ? 'sm' : breakpoint <= Breakpoint.md ? 'md' : 'default'] ??
        (defaultSpinner
            ? isSM
                ? CardsPerPage.SM
                : isMD
                  ? CardsPerPage.MD
                  : CardsPerPage.Default
            : isMD
              ? CardsPerPage.MD
              : CardsPerPage.AltDefault);

    const cardCount: number | undefined = altData?.cards.length;

    const [page, setPage] = useState<number>(0);
    const [maxPage, setMaxPage] = useState<number>(0);

    const carouselRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (cardCount) setMaxPage(Math.ceil(cardCount / perPage));
    }, [cardCount, perPage]);

    const scroll = (right = false) => {
        if (!carouselRef.current) return;
        const offset = (right ? 0.5 : -0.5) * window.outerWidth;
        carouselRef.current.scrollLeft += offset;
    };

    // Elements
    const renderCarouselBtn = (right?: true) => (
        <Button
            onClick={() => {
                scroll(right);
            }}
            className={cn(
                'absolute top-1/2 z-50 !-translate-y-1/2 size-5xl',
                right ? 'right-0 -rotate-90' : 'left-0 rotate-90',
                classNameArrow,
            )}
        />
    );

    const startIdx: number = page * perPage;
    const AltCardsPage: ReactElement[] = altData?.cards.slice(startIdx, startIdx + perPage) ?? [];

    const Spinner: FC<{ className: string }> = (props: { className: string }) => (
        <span className={cn('ml-auto', props.className)}>
            <Button
                onClick={() => setPage((prevState) => (prevState <= 0 ? prevState : prevState - 1))}
                disabled={page <= 0}
                className={getAltSpinnerBtnCn(altData?.altSpinner)}
            >
                ◀
            </Button>
            <span className={'mx-xxs sm:mx-5xs text-16 sm:text-10'}>
                {page + 1} / {maxPage}
            </span>
            <Button
                onClick={() => setPage((prevState) => (prevState >= maxPage - 1 ? prevState : prevState + 1))}
                disabled={page >= maxPage - 1}
                className={getAltSpinnerBtnCn(altData?.altSpinner)}
            >
                ▶
            </Button>
        </span>
    );

    const showAltHeader = altData;
    const showSpinnerInHeader = altData && !altData.altSpinner;
    const showFlexHeader = altData && altData.altSpinner;
    const showPrevArrow = !altData;
    const showPagination = !type && altData && !altData.altSpinner;
    const showNextArrow = !type && !altData;

    return (
        <div
            className={cn(
                'relative',
                showSpinnerInHeader && 'border-b-s border-white sm:border-0 md:pb-n lg:pb-xl',
                showFlexHeader && 'flex flex-col flex-grow',
                className,
            )}
        >
            {showAltHeader ? (
                <div
                    className={cn(
                        classNameTitle,
                        type ? 'flex justify-between' : 'contents justify-between',
                        !type && (showSpinnerInHeader ? 'mx-auto max-w-card sm:flex' : 'md:flex'),
                    )}
                >
                    <h3
                        className={cn(
                            type ? 'mt-auto text-21 md:text-18 sm:text-16' : 'text-40 sm:text-27 sm:text-center',
                        )}
                    >
                        {altData?.title}
                    </h3>
                    <Spinner className={cn(!type && 'hidden', showSpinnerInHeader ? 'sm:inline' : 'md:inline')} />
                </div>
            ) : (
                renderCarouselBtn()
            )}
            <ul
                ref={carouselRef}
                className={cn(
                    'mx-auto grid w-fit max-w-full flex-grow grid-rows-1 gap-xl justify-items-center overflow-x-scroll',
                    type ? 'mt-xxs md:mt-xs lg:mt-s' : 'mt-s md:mt-n lg:mt-xl',
                    altData?.altSpinner ? 'flex-grow' : 'h-full',
                    classNameUl,
                )}
            >
                {altData ? AltCardsPage : children}
            </ul>

            {showPagination ? (
                defaultSpinner ? (
                    <div className='flex items-center sm:mt-0 md:mt-s lg:mt-n'>
                        <PageLink
                            icon='arrow-right-long'
                            className='hidden lg:flex flex-row-reverse text-blue text-16'
                            iconClassName='ml-xxs [&_*]:size-5xs [&_path]:fill-blue'
                        >
                            See All
                        </PageLink>
                        <Spinner className='sm:hidden' />
                    </div>
                ) : null
            ) : (
                renderCarouselBtn(true)
            )}
        </div>
    );
};

Carousel.displayName = Carousel.name;

export { Carousel };
