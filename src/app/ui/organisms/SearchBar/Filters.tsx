'use client';

import { Dispatch, FC, ReactElement, SetStateAction, useRef } from 'react';
import cn from 'classnames';

import { useOuterClickClose } from '@/app/hooks';
import { formatDate } from '@/app/utils';

import { Input, Select } from '@/app/ui/form';

type Filter = {
    title: string;
    options?: Record<string, string>;
    state: [string, (value: string) => void];
};

type DateFilterValue = { start: number; end: number };
type DateFilter = Record<keyof DateFilterValue, [number, (value: string) => void]>;

type FilterProps = {
    filters: Filter[];
    dateFilter?: DateFilter;
};

const CONTROL_PROPS_CN = {
    classNameWrapper: 'flex-col !items-start gap-5xs h-fit text-nowrap',
    className: 'h-n pl-5xs !bg-gray !border-s !border-gray-l0 text-14',
};

interface Props extends FilterProps {
    expandedState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Filters: FC<Props> = (props: Props) => {
    const { filters, dateFilter, expandedState } = props;
    const [expanded, setExpanded] = expandedState;

    const filterRef = useRef<HTMLUListElement | null>(null);
    useOuterClickClose(filterRef, expanded, setExpanded);

    const FiltersLi: ReactElement[] = filters.map((filter: Filter, idx) => {
        const [value, setValue] = filter.state;
        return (
            <li
                key={filter.title + idx}
                className={'contents'}
            >
                <Select
                    options={filter.options || {}}
                    value={value}
                    onChangeCustom={(value) => setValue(value)}
                    classNameOption={'h-4xs !border-gray-l0 !border-x-0'}
                    classNameSelected={'w-full mr-auto'}
                    classNameChevron={'ml-xl mr-4xs-1'}
                    {...CONTROL_PROPS_CN}
                    classNameWrapper={cn(CONTROL_PROPS_CN.classNameWrapper, '!h-[10.3rem]')}
                    classNameUl={'!max-h-[6.8rem] border-s border-gray-l0'}
                >
                    {filter.title}
                </Select>
            </li>
        );
    });

    return (
        <ul
            ref={filterRef}
            className={cn(
                'absolute z-50 top-full right-[1px]  max-w-full overflow-x-scroll',
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
                        value={dateFilter.end[0] === Date.now() ? '' : formatDate(dateFilter.end[0], 'numerical')}
                        onChange={(event) => dateFilter?.end[1](event.currentTarget.value)}
                        {...CONTROL_PROPS_CN}
                    />
                </li>
            ) : null}
        </ul>
    );
};

Filters.displayName = Filters.name;

export type { FilterProps, Filter, DateFilterValue, DateFilter };
export { Filters };
