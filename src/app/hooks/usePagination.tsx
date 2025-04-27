'use client';

import { FC, useState } from 'react';
import { useParams } from 'next/navigation';
import cn from 'classnames';

import { Pagination, PaginationProps } from '@/app/ui/organisms/Pagination';

interface Props extends Omit<PaginationProps, 'pageState'> {}

const usePagination = () => {
    const { page } = (useParams() || { page: '0' }) as { page: string };
    const [currentPage, setCurrentPage] = useState<number>(parseInt(page ?? '0') || 0);

    const PaginationElement: FC<Props> = (props: Props) => (
        <Pagination
            pageState={[currentPage, setCurrentPage]}
            {...props}
            className={cn('mt-xxl lg:mt-[4.41rem]', props.className)}
        />
    );

    return PaginationElement;
};

export { usePagination };
