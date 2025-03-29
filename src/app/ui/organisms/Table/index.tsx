'use client';

import { FC, PropsWithChildren, ReactElement } from 'react';
import cn from 'classnames';

import { TableSection } from '@/app/types/layout';

interface RowProps<T extends object> {
    className?: string;
    row: T;
}

interface Props<T extends object> extends PropsWithChildren {
    table: TableSection<T>;
    Row: FC<RowProps<T>>;
    cnTable?: string;
}

const Table = <T extends object>(props: Props<T>) => {
    const { table, Row, children, cnTable } = props;

    const TableRows: ReactElement[] = table.data.map((row, idx) => (
        <Row
            key={JSON.stringify(row) + idx}
            row={row}
            className={cn('align-middle', '[&_td]:x-[max-w-0,text-nowrap,overflow-hidden,overflow-ellipsis]')}
        />
    ));

    return (
        <div className={`bg-gray p-l sm:p-s`}>
            <h3 className={`text-heading font-bold`}>{table.title}</h3>
            <hr
                className={cn(
                    `relative border-white-d0`,
                    `-left-4xs my-xs w-[calc(100%+2*var(--p-3xs))]`,
                    'sm:w-[calc(100%+2*var(--p-4xs))] sm:x-[-left-4xs,mt-xxs,mb-4xs]',
                )}
            />
            <div className={cn('max-h-fit overflow-y-scroll', cnTable)}>
                {!TableRows.length ? (
                    table.fallback
                ) : (
                    <table className={`w-full text-heading-s  sm:text-section-xs`}>
                        <thead className={`sticky top-0 z-10 bg-gray text-heading-s  sm:text-section-s`}>
                            <tr className={'[&_td]:x-[pb-4xs,text-section-xs]  sm:[&_td]:x-[pb-5xs,text-section-xxs]'}>
                                {children}
                            </tr>
                        </thead>
                        <tbody className={'text-heading-s  capitalize sm:text-section-xs'}>{TableRows}</tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

Table.displayName = Table.name;

export type { RowProps };
export { Table };
