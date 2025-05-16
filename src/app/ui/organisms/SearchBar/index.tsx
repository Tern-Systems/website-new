'use client';

import { FC } from 'react';
import cn from 'classnames';

import { InputProps } from '@/app/ui/form/Input';

import { Input } from '@/app/ui/form';
import { DateFilter, DateFilterValue, Filter, FilterProps, Filters } from './Filters';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface Props extends FilterProps, InputProps {
    searchState: [string, (value: string) => void];
}

const SearchBar: FC<Props> = (props: Props) => {
    const { searchState, filters, dateFilter, className, ...inputProps } = props;
    const [search, setSearch] = searchState;

    return (
        <div className={cn(`group  relative flex bg-gray-d2 border-gray-l0`, className)}>
            <Input
                {...inputProps}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                tabIndex={0}
                autoFocus
                icons={[faMagnifyingGlass]}
                wrapper={'w-full'}
                className={'flex-grow w-full h-6xl bg-inherit text-18'}
                classNameIcon={'size-3xs'}
            />
            <Filters
                filters={filters}
                dateFilter={dateFilter}
            />
        </div>
    );
};

SearchBar.displayName = SearchBar.name;

export type { Filter, DateFilterValue, DateFilter };
export { SearchBar };
