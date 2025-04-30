'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { ContentCardType, MediaCardType } from '@/app/types/blog';
import { DateFilter, DateFilterValue, Filter } from '@/app/ui/organisms/SearchBar';
import { FilterList } from '@/app/ui/organisms/SearchBar/Filters';
import { PaginationProps } from '@/app/ui/organisms/Pagination';

import { CategoryFallback } from '@/app/static';

import { Pagination, SearchBar } from '@/app/ui/organisms';
import { Button } from '@/app/ui/form';

import { exclude, formatDate } from '@/app/utils';
import { useForm, useNavigate } from '@/app/hooks';

import { faX } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

type PageType = 'Media' | 'Content';

type SearchTag = {
    value: string;
    reset: () => void;
};

type FilterDefault = {
    search: string;
    date: DateFilterValue;
};

const DEFAULT_FILTER: FilterDefault = {
    search: '',
    date: { start: 0, end: Date.now() },
};

interface Props<T, F, I> extends Pick<PaginationProps, 'columns' | 'rows'> {
    type: T;
    showTags?: true;
    filterSetup: {
        default: F;
        option: Record<keyof F, FilterList>;
        date?: true;
    };
    urlParamName?: keyof F;
    items: I[];
    renderItem: (item: I) => ReactElement;
    className?: PaginationProps['className'] & { tags?: string };
}

const Search = <
    T extends PageType,
    F extends Record<string, string>,
    I extends T extends 'Media' ? MediaCardType : ContentCardType,
>(
    props: Props<T, F, I>,
) => {
    const { items, showTags, filterSetup, urlParamName, renderItem, rows, columns, className } = props;

    const params = useParams();

    let urlParam: string | null = null;
    if (urlParamName && params) urlParam = (params[urlParamName] || filterSetup.default[urlParamName]) as string;

    const [_, router] = useNavigate();

    const [filter, setFilterField, setFilter] = useForm<F & FilterDefault>({
        ...DEFAULT_FILTER,
        ...filterSetup.default,
    });

    useEffect(() => {
        if (urlParamName && urlParam) setFilterField(urlParamName, urlParam);
    }, [urlParam]);

    const tags: SearchTag[] = [];
    let itemsFiltered: I[] = items;

    if (filter.search)
        itemsFiltered = itemsFiltered.filter((item) => item.title.toLowerCase().includes(filter.search.toLowerCase()));
    if (filter.date) {
        itemsFiltered = itemsFiltered.filter(
            (item) => item.date === undefined || (filter.date.start <= item.date && item.date <= filter.date.end),
        );
    }

    const filters: Filter[] = Object.keys(filterSetup.default).map((key): Filter => {
        const value = filter[key];
        const list: FilterList = filterSetup.option[key];

        if (value && value !== CategoryFallback) {
            itemsFiltered = itemsFiltered.filter((item) => {
                const itemProperty = item[key as keyof I];
                return (
                    typeof itemProperty !== 'string' ||
                    (list.multiple
                        ? value.toLowerCase().includes(itemProperty.toLowerCase())
                        : itemProperty.toLowerCase() === value.toLowerCase())
                );
            });
        }

        const isUrlParam = key === urlParamName && urlParamName !== undefined;
        const tagFallback = isUrlParam ? CategoryFallback : '';

        const newTags: string[] = list.multiple ? value.split(',') : [value];
        tags.push(
            ...newTags.map((tag) => ({
                value: tag || tagFallback,
                reset: () => {
                    setFilterField(key, exclude(newTags, tag).join(','));
                    if (isUrlParam) router.push(CategoryFallback);
                },
            })),
        );

        return {
            title: key,
            list,
            state: [value, (value: string) => setFilterField(key, value)],
        };
    });

    const ItemsLi: ReactElement[] = itemsFiltered.map((item: I, idx) => (
        <li
            key={(item?.title ?? 'item-') + idx}
            className={'contents'}
        >
            {renderItem(item)}
        </li>
    ));

    const dateFilter: DateFilter | null = filterSetup.date
        ? {
              start: [
                  filter.date.start,
                  (value: string) =>
                      setFilter((prevState) => {
                          return {
                              ...prevState,
                              date: { ...prevState.date, start: new Date(value + 'T00:00:00').getTime() },
                          };
                      }),
              ],
              end: [
                  filter.date.end,
                  (value: string) =>
                      setFilter((prevState) => ({
                          ...prevState,
                          date: { ...prevState.date, end: new Date(value + 'T00:00:00').getTime() },
                      })),
              ],
          }
        : null;

    const tagsFinal: SearchTag[] = [
        ...tags,
        ...(filterSetup.date
            ? [
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
              ]
            : []),
    ];

    // Elements
    const TagsLi: ReactNode[] = tagsFinal.map((tag: SearchTag, idx) =>
        tag.value ? (
            <li
                key={tag.value + idx}
                className={'contents'}
            >
                <Button
                    icon={faX}
                    onClick={tag.reset}
                    className={'flex-row-reverse capitalize'}
                    classNameIcon={'[&_*]:size-7xs'}
                >
                    {tag.value}
                </Button>
            </li>
        ) : null,
    );

    return (
        <>
            <SearchBar
                searchState={[filter.search, (value: string) => setFilterField('search', value)]}
                filters={filters}
                dateFilter={dateFilter}
                placeholder={'Search for courses...'}
                className={'sm:mt-n mt-xxl'}
            />
            {showTags ? (
                <ul className={cn('flex gap-x-xs  my-4xs md:my-xxs lg:my-xs', className?.tags)}>{TagsLi}</ul>
            ) : null}
            <Pagination
                Items={ItemsLi}
                className={{
                    ...className,
                    pagination: cn('mt-xxl lg:mt-[4.41rem]', className?.pagination),
                }}
                rows={rows}
                columns={columns}
            />
        </>
    );
};

Search.displayName = Search.name;

export type { Props as PaginationSectionProps, PageType };
export { Search };
