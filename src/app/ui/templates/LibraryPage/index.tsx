'use client';

import { FC, ReactNode } from 'react';
import { PaginationProps } from '@/app/ui/organisms/Pagination';

import { formatDate } from '@/app/utils';
import { useForm, usePagination } from '@/app/hooks';

import { BreadcrumbRoute, Content, H1, Section } from '@/app/ui/atoms';
import { DateFilter, DateFilterValue, Filter, SearchBar } from '@/app/ui/organisms/SearchBar';
import { Button } from '@/app/ui/form';

import { faX } from '@fortawesome/free-solid-svg-icons';

type LibraryTag = {
    value: string;
    reset: () => void;
};

type FilterDefault = {
    date: DateFilterValue;
};

const DEFAULT_FILTER: FilterDefault = {
    date: { start: 0, end: Date.now() },
};

interface Props extends PaginationProps {
    heading: string;
    tags: LibraryTag[];
    filters: Filter[];
}

const LibraryTemplate: FC<Props> = (props: Props) => {
    const { heading, Items, columns, rows, filters, tags } = props;

    const Pagination = usePagination();

    const [filter, _, setFilter] = useForm<FilterDefault>(DEFAULT_FILTER);

    const dateFilter: DateFilter = {
        start: [
            filter.date.start,
            (value: string) =>
                setFilter((prevState) => ({
                    ...prevState,
                    date: { ...prevState.date, start: new Date(value).getTime() },
                })),
        ],
        end: [
            filter.date.end,
            (value: string) =>
                setFilter((prevState) => ({
                    ...prevState,
                    date: { ...prevState.date, end: new Date(value).getTime() },
                })),
        ],
    };

    const tagsFinal: LibraryTag[] = [
        ...tags,
        {
            value: filter.date.start ? 'Start: ' + formatDate(filter.date.start, 'short') : '',
            reset: () => {
                setFilter((prevState) => ({
                    ...prevState,
                    date: { ...prevState.date, start: 0 },
                }));
            },
        },
        {
            value: filter.date.end ? 'End: ' + formatDate(filter.date.end, 'short') : '',
            reset: () => {
                setFilter((prevState) => ({
                    ...prevState,
                    date: { ...prevState.date, end: Date.now() },
                }));
            },
        },
    ];

    // Elements
    const TagsLi: ReactNode[] = tagsFinal.map((tag: LibraryTag, idx) =>
        tag.value ? (
            <li
                key={tag.value + idx}
                className={'contents'}
            >
                <Button
                    icon={faX}
                    onClick={tag.reset}
                    className={'flex-row-reverse capitalize'}
                    classNameIcon={'[&_*]:size-[0.75rem]'}
                >
                    {tag.value}
                </Button>
            </li>
        ) : null,
    );

    return (
        <Content type={'bottom'}>
            <Section>
                <BreadcrumbRoute />
                <H1
                    type={'small'}
                    className={'sm:mt-n mt-xxl'}
                >
                    {heading}
                </H1>
                <SearchBar
                    filters={filters}
                    dateFilter={dateFilter}
                    placeholder={'Search for courses...'}
                    className={'sm:mt-n mt-xxl'}
                />
                <ul className={'flex gap-x-xs  my-4xs md:my-xxs lg:my-xs'}>{TagsLi}</ul>
                <Pagination
                    Items={Items}
                    columns={columns}
                    rows={rows}
                />
            </Section>
        </Content>
    );
};

LibraryTemplate.displayName = LibraryTemplate.name;

export type { LibraryTag };
export { LibraryTemplate };
