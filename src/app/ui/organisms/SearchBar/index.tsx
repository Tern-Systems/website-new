'use client';

import { FC, useState } from 'react';
import cn from 'classnames';

import { InputProps } from '@/app/ui/form/Input';

import { Button, Input } from '@/app/ui/form';
import { DateFilter, DateFilterValue, Filter, FilterProps, Filters } from './Filters';

import { faChevronDown, faChevronUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface Props extends FilterProps, InputProps {
    searchState: [string, (value: string) => void];
}

const SearchBar: FC<Props> = (props: Props) => {
    const { searchState, filters, dateFilter, className, ...inputProps } = props;
    const [search, setSearch] = searchState;

    const [expanded, setExpanded] = useState(false);

    return (
        <div className={cn(`group  relative flex bg-gray-d2 border-gray-l0`, className)}>
            <Input
                {...inputProps}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                tabIndex={0}
                autoFocus
                icons={[faMagnifyingGlass]}
                classNameWrapper={'w-full'}
                className={'flex-grow w-full h-6xl bg-inherit text-18'}
                classNameIcon={'size-3xs'}
            />
            <Button
                onClick={() => setExpanded((prevState) => !prevState)}
                icon={expanded ? faChevronUp : faChevronDown}
                className={cn('size-6xl', expanded ? 'bg-gray' : 'bg-inherit')}
            />
            {expanded ? (
                <Filters
                    filters={filters}
                    dateFilter={dateFilter}
                    expandedState={[expanded, setExpanded]}
                />
            ) : null}
        </div>
    );
};

SearchBar.displayName = SearchBar.name;

export type { Filter, DateFilterValue, DateFilter };
export { SearchBar };
