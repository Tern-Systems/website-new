import React, { FC, PropsWithChildren, ReactElement } from 'react';
import cn from 'classnames';

import { TableSection } from '@/app/types/layout';

const CELL_FALLBACK = <span className={'text-14'}>No data</span>;

const SM_HIDDEN_CN = 'sm:hidden';
const MD_SM_HIDDEN_CN = cn(SM_HIDDEN_CN, ' md:hidden');

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
            <h3 className={`text-27 font-bold`}>{table.title}</h3>
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
                    <table className={`w-full text-21  sm:text-14`}>
                        <thead className={`sticky top-0 z-10 bg-gray text-21  sm:text-18`}>
                            <tr className={'[&_td]:x-[pb-4xs,text-14]  sm:[&_td]:x-[pb-5xs,text-12]'}>{children}</tr>
                        </thead>
                        <tbody className={'text-21  capitalize sm:text-14'}>{TableRows}</tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export type { RowProps };
export { Table, CELL_FALLBACK, MD_SM_HIDDEN_CN, SM_HIDDEN_CN };
