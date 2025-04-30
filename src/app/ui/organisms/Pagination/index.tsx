'use client';

import { FC, HTMLAttributes, ReactElement, ReactNode, useState } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { generateArray } from '@/app/utils';

import { Button } from '@/app/ui/form';

import { useBreakpointCheck, useNavigate } from '@/app/hooks';
import { useSearchParams } from 'next/navigation';

import { faAngleDoubleLeft, faAngleDoubleRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const OVERFLOW_COUNT = { regular: 5, sm: 2 };

const BUTTON_PROPS_CN = {
    className: 'size-7xl flex border-s border-inherit',
    classNameIcon: '[&_path]:fill-blue group-disabled:[&_path]:fill-gray',
};

const Ellipsis = (
    <Button
        icon={faEllipsisH}
        {...BUTTON_PROPS_CN}
        className={cn(BUTTON_PROPS_CN.className, '!border-x-0')}
    />
);

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
    Items: ReactNode[];
    columns?: number;
    rows: number;
    className?: {
        wrapper?: string;
        list?: string;
        pagination?: string;
    };
}

const Pagination: FC<Props> = (props: Props) => {
    const { Items, rows, columns = 1, className, ...divProps } = props;

    const params = useSearchParams();
    const sm = useBreakpointCheck() <= Breakpoint.sm;
    const currentPage = parseInt(params?.get('page') ?? '0') || 0;

    const [_, router, route] = useNavigate();

    const overflowCount = sm ? OVERFLOW_COUNT.sm : OVERFLOW_COUNT.regular;
    const elementCount = columns * rows;
    const pageCount = Math.ceil(Items.length / elementCount);

    const [batchIdx, setBatchIdx] = useState(Math.trunc(currentPage / overflowCount));

    const maxBatchIdx = Math.ceil(pageCount / overflowCount) - 1;
    const lastBatchIdx = maxBatchIdx === batchIdx;

    const requireHandleSelect = (getPage: (prev: number) => number, page?: boolean) => () => {
        if (page) {
            const page = getPage(currentPage);
            const newPage = page <= 0 ? 0 : page >= pageCount - 1 ? pageCount - 1 : page;
            if (route) router.push(route + '?' + new URLSearchParams({ page: newPage.toString() }));
        } else {
            setBatchIdx((prevState) => {
                const batchIdx = getPage(prevState);
                return batchIdx <= 0 ? 0 : batchIdx >= maxBatchIdx ? maxBatchIdx : batchIdx;
            });
        }
    };

    const overflow = pageCount > overflowCount;
    const pagination = (
        overflow
            ? generateArray(overflowCount).slice(0, (lastBatchIdx && pageCount % overflowCount) || overflowCount)
            : generateArray(Math.ceil(pageCount))
    ).map((_, idx) => overflowCount * batchIdx + idx);

    // Elements
    const ItemsLi: ReactNode[] = Items.slice(currentPage * elementCount, (currentPage + 1) * elementCount);

    const PageButtonsLi: ReactElement[] = pagination.map((page, idx) => (
        <li
            key={idx}
            className={'contents'}
        >
            <Button
                onClick={requireHandleSelect(() => page, true)}
                className={cn('h-full w-5xl', page === currentPage ? 'bg-blue text-white' : 'text-blue ')}
            >
                {page + 1}
            </Button>
        </li>
    ));

    const lastBatchLeft: boolean = batchIdx <= 0;
    const lastBatchRight: boolean = batchIdx >= maxBatchIdx;

    return ItemsLi.length ? (
        <div className={className?.wrapper}>
            <ul
                style={{ gridTemplateColumns: `repeat(${columns},1fr)` }}
                className={cn(
                    'grid gap-x-xs  sm:mx-auto',
                    'gap-y-xl md:gap-y-xxl lg:gap-y-5xl',
                    'sm:!grid-cols-[minmax(0,20.937rem)]',
                    'sm:w-fit w-full',
                    className?.list,
                )}
            >
                {ItemsLi}
            </ul>
            <div
                {...divProps}
                className={cn('flex h-7xl w-fit border-gray-l2', className?.pagination)}
            >
                <Button
                    icon={faAngleDoubleLeft}
                    onClick={requireHandleSelect((prev) => prev - 1, !overflow)}
                    disabled={overflow ? lastBatchLeft : currentPage <= 0}
                    {...BUTTON_PROPS_CN}
                />
                {lastBatchLeft ? null : Ellipsis}
                <ul className={'flex border-y-s border-inherit'}>{PageButtonsLi}</ul>
                {lastBatchRight ? null : Ellipsis}
                <Button
                    icon={faAngleDoubleRight}
                    onClick={requireHandleSelect((prev) => prev + 1, !overflow)}
                    disabled={overflow ? lastBatchRight : currentPage >= pageCount - 1}
                    {...BUTTON_PROPS_CN}
                />
            </div>
        </div>
    ) : null;
};

interface PaginationProps extends Omit<Props, 'pageState'> {}

export type { PaginationProps };
export { Pagination };
