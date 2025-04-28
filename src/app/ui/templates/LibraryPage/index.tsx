'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { ContentCardType, MediaCardType } from '@/app/types/blog';
import { PaginationProps } from '@/app/ui/organisms/Pagination';
import { CategoryFallback } from '@/app/static';

import { formatDate } from '@/app/utils';
import { useForm, usePagination } from '@/app/hooks';

import { BreadcrumbRoute, Content, H1, Section } from '@/app/ui/atoms';
import { ContentCard, MediaCard } from '@/app/ui/organisms';
import { DateFilter, DateFilterValue, Filter, SearchBar } from '@/app/ui/organisms/SearchBar';
import { Button } from '@/app/ui/form';

import { faX } from '@fortawesome/free-solid-svg-icons';

type Type = 'Media' | 'Content';

type LibraryTag = {
    value: string;
    reset: () => void;
};

type FilterDefault = {
    title: string;
    date: DateFilterValue;
};

const DEFAULT_FILTER: FilterDefault = {
    title: '',
    date: { start: 0, end: Date.now() },
};

interface Props<T, F, I> extends Omit<PaginationProps, 'Items'> {
    type: T;
    heading: string;
    filterSetup: {
        default: F;
        option: Record<keyof F, Record<string, string>>;
    };
    items: I[];
    urlParamName: keyof F;
}

const LibraryTemplate = <
    T extends Type,
    F extends Record<string, string>,
    I extends T extends 'Media' ? MediaCardType<string> : ContentCardType<string>,
>(
    props: Props<T, F, I>,
) => {
    const { type, heading, items, columns, rows, filterSetup, urlParamName } = props;

    const { [urlParamName]: urlParam } = (useParams() || { category: filterSetup.default[urlParamName] }) as {
        [urlParamName]: string;
    };
    const Pagination = usePagination();

    const [filter, setFilterField, setFilter] = useForm<F & FilterDefault>({
        ...DEFAULT_FILTER,
        ...filterSetup.default,
    });

    useEffect(() => {
        setFilterField(urlParamName, urlParam);
    }, [urlParam]);

    const tags: LibraryTag[] = [];
    let itemsFiltered: I[] = items;

    const filters: Filter[] = Object.keys(filterSetup.default).map((key): Filter => {
        const value = filter[key];

        if (value && value !== CategoryFallback)
            itemsFiltered = itemsFiltered.filter((item) => {
                const value = item[key as keyof I];
                return typeof value !== 'string' || value.toLowerCase() === value.toLowerCase();
            });

        tags.push({
            value: value || CategoryFallback,
            reset: () => setFilterField(key, CategoryFallback),
        });

        return {
            title: key,
            options: filterSetup.option[key],
            state: [filter[key], (value: string) => setFilterField(key, value)],
        };
    });

    const ItemsLi: ReactElement[] = itemsFiltered.map((item: I, idx) => (
        <li
            key={(item?.title ?? 'item-') + idx}
            className={'contents'}
        >
            {type === 'Media' ? (
                <MediaCard {...(item as MediaCardType<string>)} />
            ) : (
                <ContentCard {...(item as ContentCardType<string>)} />
            )}
        </li>
    ));

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
                    Items={ItemsLi}
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
