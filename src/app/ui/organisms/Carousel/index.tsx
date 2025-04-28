'use client';

import { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Breakpoint, Route } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';

import { H3 } from '@/app/ui/atoms';
import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

enum CardsPerPage {
    DefaultAlt = 4,
    Default = 3,
    MD = 2,
    SM = 1,
}

const getAltSpinnerBtnCn = (alt?: string) =>
    cn('border-s  border-blue text-blue disabled:x-[border-gray-l0,text-gray]  p-xs sm:p-4xs-1', { ['md:p-4xs']: alt });

interface Props extends PropsWithChildren {
    altData?: { title: string; link: Route; cards: ReactElement[]; altSpinner?: 'default' | 'alt' };
    rowsCount?: number;
    className?: string;
    classNameUl?: string;
    classNameArrow?: string;
}

const Carousel: FC<Props> = (props: Props) => {
    const { altData, rowsCount = 1, className, classNameUl, classNameArrow, children } = props;

    const breakpoint = useBreakpointCheck();
    const md = breakpoint <= Breakpoint.md;

    const defaultSpinner = !altData?.altSpinner;
    const colsPerPage = defaultSpinner
        ? breakpoint <= Breakpoint.sm
            ? CardsPerPage.SM
            : md
              ? CardsPerPage.MD
              : CardsPerPage.Default
        : md
          ? altData?.altSpinner === 'alt'
              ? CardsPerPage.SM
              : CardsPerPage.MD
          : CardsPerPage.DefaultAlt;

    const cardCount: number | undefined = altData?.cards.length;

    const [page, setPage] = useState<number>(0);
    const [maxPage, setMaxPage] = useState<number>(0);

    const carouselRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (cardCount) setMaxPage(Math.ceil(cardCount / rowsCount / colsPerPage));
    }, [cardCount, colsPerPage]);

    useEffect(() => {
        if (carouselRef.current) carouselRef.current.scrollLeft = page * carouselRef.current.scrollWidth;
    }, [page]);

    // Elements
    const renderCarouselBtn = (right?: true) => (
        <Button
            onClick={() => {
                if (carouselRef.current) {
                    carouselRef.current.scrollLeft =
                        carouselRef.current.scrollLeft + (right ? 0.5 : -0.5) * window.outerWidth;
                }
            }}
            className={cn(
                'absolute top-1/2 z-50 !-translate-y-1/2 size-5xl',
                right ? 'right-0 -rotate-90' : 'left-0 rotate-90',
                classNameArrow,
            )}
        />
    );

    const Spinner: FC<{ className: string }> = (props: { className: string }) => (
        <span className={cn('ml-auto flex items-center', props.className)}>
            <Button
                icon={faCaretLeft}
                onClick={() => setPage((prevState) => (prevState <= 0 ? prevState : prevState - 1))}
                disabled={page <= 0}
                className={getAltSpinnerBtnCn(altData?.altSpinner)}
            />
            <span className={'mx-xxs sm:mx-5xs  text-16 sm:text-10'}>
                {page + 1} / {maxPage}
            </span>
            <Button
                icon={faCaretRight}
                onClick={() => setPage((prevState) => (prevState >= maxPage - 1 ? prevState : prevState + 1))}
                disabled={page >= maxPage - 1}
                className={getAltSpinnerBtnCn(altData?.altSpinner)}
            />
        </span>
    );

    return (
        <div
            className={cn(
                'relative',
                {
                    [defaultSpinner
                        ? 'border-white  md:pb-n lg:pb-xl  border-b-s sm:border-0'
                        : 'flex-grow flex flex-col']: altData,
                },
                className,
            )}
        >
            {altData ? (
                <div
                    className={cn(
                        'contents justify-between',
                        defaultSpinner ? 'sm:flex  mx-auto max-w-card' : 'md:flex',
                    )}
                >
                    <H3
                        type={'large'}
                        className={'max-w-fit overflow-x-hidden text-ellipsis text-nowrap  sm:text-center'}
                    >
                        {altData?.title}
                    </H3>
                    <Spinner className={cn('hidden', defaultSpinner ? 'sm:flex' : 'md:flex')} />
                </div>
            ) : (
                renderCarouselBtn()
            )}
            <ul
                ref={carouselRef}
                style={
                    altData?.altSpinner === 'default' || !altData
                        ? {}
                        : {
                              gridTemplateColumns: `repeat(${altData.cards.length / rowsCount}, calc(${100 / colsPerPage}% - ${altData.altSpinner === 'alt' || breakpoint <= Breakpoint.sm ? '0px' : 'var(--p-xl) + 1px'}))`,
                          }
                }
                className={cn(
                    'mx-auto grid w-fit max-w-full !min-h-fit flex-grow justify-items-center',
                    'sm:gap-x-5xl gap-xl',
                    'mt-s md:mt-n lg:mt-xl',
                    altData
                        ? cn('grid-flow-col overflow-x-hidden', defaultSpinner ? 'h-full' : 'flex-grow', {
                              [!page ? 'sm:ml-0 ml-xs' : 'sm:ml-0 -ml-xs']: defaultSpinner,
                          })
                        : 'overflow-scroll',
                    classNameUl,
                )}
            >
                {altData?.cards ?? children}
            </ul>
            {altData ? (
                !defaultSpinner || rowsCount > 1 ? null : (
                    <div className={'flex items-center  mt-s lg:mt-n  sm:mx-auto  sm:max-w-card'}>
                        <PageLink
                            href={altData.link}
                            icon={'arrow-right-long'}
                            className={'flex-row-reverse text-blue text-16'}
                            iconClassName={'ml-xxs [&_*]:size-5xs [&_path]:fill-blue'}
                        >
                            See All
                        </PageLink>
                        <Spinner className={'sm:hidden'} />
                    </div>
                )
            ) : (
                renderCarouselBtn(true)
            )}
        </div>
    );
};

Carousel.displayName = Carousel.name;

export { Carousel };
