'use client';

import { Dispatch, FC, HTMLAttributes, ReactElement, ReactNode, SetStateAction, useState } from 'react';
import cn from 'classnames';

import { Route } from '@/app/static';

import { generateArray } from '@/app/utils';

import { Button } from '@/app/ui/form';

import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from '@/app/hooks';

const OVERFLOW_COUNT = 5;

const BUTTON_PROPS_CN = {
    className: 'size-7xl flex border-s border-inherit',
    classNameIcon: '[&_path]:fill-blue group-disabled:[&_path]:fill-gray',
};

interface Props extends HTMLAttributes<HTMLDivElement> {
    Items: ReactNode[];
    columns: number;
    rows: number;
    pageState: [number, Dispatch<SetStateAction<number>>];
}

const Pagination: FC<Props> = (props: Props) => {
    const { Items, columns, rows, pageState, className, ...divProps } = props;
    const [currentPage, setPage] = pageState;

    const elementCount = columns * rows;
    const pageCount = Math.ceil(Items.length / elementCount);

    const [navigate, _, route] = useNavigate();

    const [batchIdx, setBatchIdx] = useState(Math.trunc(currentPage / OVERFLOW_COUNT));

    const maxBatchIdx = Math.ceil(pageCount / OVERFLOW_COUNT) - 1;
    const lastBatchIdx = maxBatchIdx === batchIdx;

    const requireHandleSelect = (getPage: (prev: number) => number, page?: boolean) => () => {
        if (page) {
            setPage((prevState) => {
                const page = getPage(prevState);
                const newPage = page <= 0 ? 0 : page >= pageCount - 1 ? pageCount - 1 : page;
                if (route) navigate((route + '?' + new URLSearchParams({ page: (page + 1).toString() })) as Route);
                return newPage;
            });
        } else {
            setBatchIdx((prevState) => {
                const batchIdx = getPage(prevState);
                return batchIdx <= 0 ? 0 : batchIdx >= maxBatchIdx ? maxBatchIdx : batchIdx;
            });
        }
    };

    const overflow = pageCount > OVERFLOW_COUNT;
    const pagination = (
        overflow
            ? generateArray(OVERFLOW_COUNT).slice(0, (lastBatchIdx && pageCount % OVERFLOW_COUNT) || OVERFLOW_COUNT)
            : generateArray(Math.ceil(pageCount))
    ).map((_, idx) => OVERFLOW_COUNT * batchIdx + idx);

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

    return ItemsLi.length ? (
        <div>
            <ul
                style={{ gridTemplateColumns: `repeat(${columns},1fr)` }}
                className={cn(
                    'grid gap-x-xs  sm:mx-auto',
                    'gap-y-xl md:gap-y-xxl lg:gap-y-5xl',
                    'sm:!grid-cols-[minmax(0,20.937rem)]',
                    'sm:w-fit w-full',
                )}
            >
                {ItemsLi}
            </ul>
            <div
                {...divProps}
                className={cn('flex h-7xl w-fit border-gray-l2', className)}
            >
                <Button
                    icon={faAngleDoubleLeft}
                    onClick={requireHandleSelect((prev) => prev - 1, !overflow)}
                    disabled={(overflow ? batchIdx : currentPage) - 1 < 0}
                    {...BUTTON_PROPS_CN}
                />
                <ul className={'flex border-y-s'}>{PageButtonsLi}</ul>
                <Button
                    icon={faAngleDoubleRight}
                    onClick={requireHandleSelect((prev) => prev + 1, !overflow)}
                    disabled={overflow ? batchIdx >= maxBatchIdx : currentPage >= pageCount - 1}
                    {...BUTTON_PROPS_CN}
                />
            </div>
        </div>
    ) : null;
};

interface PaginationProps extends Omit<Props, 'pageState'> {}

export type { PaginationProps };
export { Pagination };
