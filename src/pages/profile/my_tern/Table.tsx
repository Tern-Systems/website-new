import React, { FC, ReactElement, ReactNode } from 'react';
import cn from 'classnames';
import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks';
import { PageLink } from '@/app/ui/layout';

type TableEntry = {
    name: string;
    type: string;
    data: number | string;
    href: string | Route;
};

type TableSection = {
    title: string;
    columnNames: [string, string, string];
    data: TableEntry[];
    fallback: ReactNode;
};

const renderTd = (data: string | number) => (typeof data === 'string' ? data : new Date(data).toLocaleDateString());

interface Props {
    table: TableSection;
    external?: boolean;
}

const Table: FC<Props> = (props: Props) => {
    const { external, table } = props;

    const [navigate] = useNavigate();

    const TableItems: ReactElement[] = table.data.map((row, idx) => (
        <tr
            key={row.name.slice(5) + idx}
            onClick={() => {
                if (external && row.href.startsWith('https://')) window.open(row.href, '_blank');
                else navigate(row.href as Route);
            }}
            className={cn(
                'cursor-pointer [&_td]:x-[py-3xs,max-w-0,text-nowrap,overflow-hidden,overflow-ellipsis]',
                'sm:[&_td]:py-4xs',
            )}
        >
            <td className={'w-[40%] sm:w-full md:w-[50%]'}>{row.name}</td>
            <td className={'w-[29%] sm:hidden md:w-[49%]'}>{renderTd(row.type ?? '-')}</td>
            <td className={'w-[29%] sm:hidden'}>{renderTd(row.data ?? '-')}</td>
            <td className={'!max-w-full'}>
                <PageLink
                    icon={'arrow-right-long'}
                    className={'mr-1'}
                    iconClassName={`[&_path]:fill-blue [&_*]:w-[1.3rem]  sm:[&_*]:w-[0.875rem]`}
                />
            </td>
        </tr>
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
            <div className={'max-h-[20rem] overflow-y-scroll'}>
                {!table.data.length ? (
                    table.fallback
                ) : (
                    <table className={`w-full text-heading-s sm:text-section-xs`}>
                        <thead className={`sticky top-0 z-10 bg-gray text-heading-s sm:text-section-s`}>
                            <tr
                                className={cn('text-section-xs [&_td]:pb-4xs', 'sm:[&_td]:x-[pb-5xs,text-section-xxs]')}
                            >
                                <td>{table.columnNames[0]}</td>
                                <td className={'sm:hidden'}>{table.columnNames[1]}</td>
                                <td className={'sm:hidden'}>{table.columnNames[2]}</td>
                                <td />
                            </tr>
                        </thead>
                        <tbody className={'text-heading-s sm:text-section-xs'}>{TableItems}</tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export type { TableEntry, TableSection };
export { Table };
