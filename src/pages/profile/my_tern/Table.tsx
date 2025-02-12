import React, { FC, ReactElement, ReactNode } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { Route } from '@/app/static';

import { useBreakpointCheck, useNavigate } from '@/app/hooks';
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

    const breakpoint = useBreakpointCheck();
    const [navigate] = useNavigate();

    const TableItems: ReactElement[] = table.data.map((row, idx) => (
        <tr
            key={row.name.slice(5) + idx}
            onClick={() => {
                if (external && row.href.startsWith('https://')) window.open(row.href, '_blank');
                else navigate(row.href as Route);
            }}
            className={cn('cursor-pointer [&_td]:x-[py-3xs,max-w-0,text-nowrap,overflow-hidden,overflow-ellipsis]', {
                ['[&_td]:py-4xs']: breakpoint <= Breakpoint.sm,
            })}
        >
            <td className={cn('w-[40%] md:w-[50%]', { ['w-full']: breakpoint <= Breakpoint.sm })}>{row.name}</td>
            <td className={cn('w-[29%] md:w-[49%]', { ['hidden']: breakpoint <= Breakpoint.sm })}>
                {renderTd(row.type ?? '-')}
            </td>
            <td className={cn('w-[29%]', { ['hidden']: breakpoint <= Breakpoint.md })}>{renderTd(row.data ?? '-')}</td>
            <td className={'!max-w-full'}>
                <PageLink
                    icon={'arrow-right-long'}
                    className={'mr-1'}
                    iconClassName={cn(`[&_path]:fill-blue [&_*]:w-[1.3rem]`, {
                        ['[&_*]:w-[0.875rem]']: breakpoint <= Breakpoint.sm,
                    })}
                />
            </td>
        </tr>
    ));

    return (
        <div className={cn(`bg-gray p-l`, { ['p-s']: breakpoint <= Breakpoint.sm })}>
            <h3 className={`text-heading font-bold`}>{table.title}</h3>
            <hr
                className={cn(`relative border-white-d0`, `-left-4xs my-xs w-[calc(100%+2*var(--p-3xs))]`, {
                    ['-left-4xs mb-4xs mt-xxs w-[calc(100%+2*var(--p-4xs))]']: breakpoint <= Breakpoint.sm,
                })}
            />
            <div className={'max-h-[20rem] overflow-y-scroll'}>
                {!table.data.length ? (
                    table.fallback
                ) : (
                    <table className={cn(`w-full text-heading-s`, 'text-section-xs')}>
                        <thead
                            className={cn(`sticky top-0 z-10 bg-gray text-heading-s`, {
                                [`text-section-s`]: breakpoint <= Breakpoint.sm,
                            })}
                        >
                            <tr
                                className={cn('text-section-xs [&_td]:pb-4xs', {
                                    ['[&_td]:x-[pb-5xs,text-section-xxs]']: breakpoint <= Breakpoint.sm,
                                })}
                            >
                                <td>{table.columnNames[0]}</td>
                                <td className={cn({ ['hidden']: breakpoint <= Breakpoint.sm })}>
                                    {table.columnNames[1]}
                                </td>
                                <td className={cn({ ['hidden']: breakpoint <= Breakpoint.md })}>
                                    {table.columnNames[2]}
                                </td>
                                <td />
                            </tr>
                        </thead>
                        <tbody
                            className={cn('text-heading-s', { ['sm:text-section-xs']: breakpoint <= Breakpoint.sm })}
                        >
                            {TableItems}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export type { TableEntry, TableSection };
export { Table };
