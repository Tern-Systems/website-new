import React, { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
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
    cn('border-s   border-blue text-blue disabled:x-[border-gray-l0,text-gray]  p-[1.375rem] sm:p-[0.4375rem]', {
        ['md:p-[0.6875rem]']: alt,
    });

interface Props extends PropsWithChildren {
    altData?: { title: string; link: Route; cards: ReactElement[]; altSpinner?: true };
    className?: string;
    classNameUl?: string;
    classNameArrow?: string;
}

const Carousel: FC<Props> = (props: Props) => {
    const { altData, className, classNameUl, classNameArrow, children } = props;

    const breakpoint = useBreakpointCheck();
    const md = breakpoint <= Breakpoint.md;

    const defaultSpinner = !altData?.altSpinner;
    const altCardsPerPage = defaultSpinner
        ? breakpoint <= Breakpoint.sm
            ? CardsPerPage.SM
            : md
              ? CardsPerPage.MD
              : CardsPerPage.Default
        : md
          ? CardsPerPage.MD
          : CardsPerPage.AltDefault;

    const cardCount: number | undefined = altData?.cards.length;

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
                'absolute top-1/2 z-50 !-translate-y-1/2 [&_*]:size-[2.875rem]',
                right ? 'right-0 -rotate-90' : 'left-0 rotate-90',
                classNameArrow,
            )}
        />
    );

    const startIdx: number = page * altCardsPerPage;
    const AltCardsPage: ReactElement[] = altData?.cards.slice(startIdx, startIdx + altCardsPerPage) ?? [];

    const Spinner: FC<{ className: string }> = (props: { className: string }) => (
        <span className={cn('ml-auto', props.className)}>
            <Button
                onClick={() => setPage((prevState) => (prevState <= 0 ? prevState : prevState - 1))}
                disabled={page <= 0}
                className={getAltSpinnerBtnCn(altData?.altSpinner)}
            >
                ◀
            </Button>
            <span className={'mx-xxs sm:mx-5xs  text-basic sm:text-section-3xs'}>
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
                    <h3 className={'sm:text-center  text-heading-xl sm:text-heading'}>{altData?.title}</h3>
                    <Spinner className={cn('hidden', defaultSpinner ? 'sm:inline' : 'md:inline')} />
                </div>
            ) : (
                renderCarouselBtn()
            )}
            <ul
                ref={carouselRef}
                className={cn(
                    'mx-auto grid w-fit max-w-full flex-grow grid-rows-1 gap-xl justify-items-center overflow-x-scroll',
                    'mt-s md:mt-n lg:mt-xl',
                    altData?.altSpinner ? 'flex-grow' : 'h-full',
                    classNameUl,
                )}
            >
                {altData ? AltCardsPage : children}
            </ul>
            {altData ? (
                defaultSpinner ? (
                    <div className={'flex items-center sm:mt-0 md:mt-s lg:mt-n'}>
                        <PageLink
                            icon={'arrow-right-long'}
                            className={'flex-row-reverse text-blue text-basic  hidden lg:flex'}
                            iconClassName={'ml-xxs [&_*]:size-[1.06rem] [&_path]:fill-blue'}
                        >
                            See All
                        </PageLink>
                        <Spinner className={'sm:hidden'} />
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
