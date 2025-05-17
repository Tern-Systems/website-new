'use client';

import { FC, ReactElement, useRef, useState } from 'react';
import cn from 'classnames';

import { SelectOptions } from '@/app/ui/form/Select';

import { useOuterClickClose } from '@/app/hooks';
import { formatDate } from '@/app/utils';

import { Button, Input, Select } from '@/app/ui/form';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

type FilterList = { multiple?: true; options: SelectOptions };
type Filter = {
    title: string;
    list?: FilterList;
    state: [string, (value: string) => void];
};

type DateFilterValue = { start: number; end: number };
type DateFilter = Record<keyof DateFilterValue, [number, (value: string) => void]>;

type FilterProps = {
    filters: Filter[];
    dateFilter: DateFilter | null;
};

const CONTROL_PROPS_CN = {
    wrapper: 'flex-col !items-start gap-5xs h-fit text-nowrap',
    className: 'h-n pl-5xs !bg-gray !border-s !border-gray-l0 text-14',
};

interface Props extends FilterProps {}

const Filters: FC<Props> = (props: Props) => {
    const { filters, dateFilter } = props;

    const [expanded, setExpanded] = useState(false);

    const filterRef = useRef<HTMLDivElement | null>(null);
    useOuterClickClose(filterRef, expanded, setExpanded);

    const FiltersLi: ReactElement[] = filters.map((filter: Filter, idx) => {
        const [filterValue, setValue] = filter.state;
        return (
            <li
                key={filter.title + idx}
                className={'contents'}
            >
                <Select
                    options={filter.list?.options || {}}
                    value={filterValue}
                    multiple={filter.list?.multiple}
                    onChange={setValue}
                    className={{
                        ...CONTROL_PROPS_CN,
                        select: cn(CONTROL_PROPS_CN.className, 'w-[11rem]'),
                        wrapper: cn(CONTROL_PROPS_CN.wrapper, '!h-[10.3rem]'),
                        option: 'h-4xs !border-gray-l0 !border-x-0',
                        selected: 'w-[13.625rem]',
                        ul: '!max-h-[6.8rem] border-s border-gray-l0',
                        label: 'capitalize',
                        chevron: 'ml-auto mr-4xs-1',
                    }}
                >
                    {filter.title}
                </Select>
            </li>
        );
    });

    return (
        <div ref={filterRef}>
            <Button
                onClick={() => setExpanded((prevState) => !prevState)}
                icon={expanded ? faChevronUp : faChevronDown}
                className={cn('size-6xl', expanded ? 'bg-gray' : 'bg-inherit')}
            />
            {expanded ? (
                <ul
                    className={cn(
                        'absolute z-[100] top-full right-[1px]  max-w-full overflow-x-scroll',
                        'grid grid-flow-col gap-x-n p-xs',
                        'bg-gray border-s border-gray-l0 overflow-hidden',
                    )}
                >
                    {FiltersLi}
                    {dateFilter ? (
                        <li className={'flex flex-col w-1/3'}>
                            <Input
                                type={'date'}
                                value={dateFilter.start[0] === 0 ? '' : formatDate(dateFilter.start[0], 'numerical')}
                                onChange={(event) => dateFilter?.start[1](event.currentTarget.value)}
                                {...CONTROL_PROPS_CN}
                            >
                                Date Range
                            </Input>
                            <Input
                                type={'date'}
                                value={
                                    dateFilter.end[0] === Date.now() ? '' : formatDate(dateFilter.end[0], 'numerical')
                                }
                                onChange={(event) => dateFilter?.end[1](event.currentTarget.value)}
                                {...CONTROL_PROPS_CN}
                            />
                        </li>
                    ) : null}
                </ul>
            ) : null}
        </div>
    );
};

Filters.displayName = Filters.name;

export type { FilterProps, Filter, FilterList, DateFilterValue, DateFilter };
export { Filters };
