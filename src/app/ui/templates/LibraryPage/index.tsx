'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { ContentCardType, MediaCardType } from '@/app/types/blog';
import { Pagination, PaginationProps } from '@/app/ui/organisms/Pagination';
import { FilterList } from '@/app/ui/organisms/SearchBar/Filters';
import { Breakpoint, CategoryFallback } from '@/app/static';

import { exclude, formatDate } from '@/app/utils';
import { useBreakpointCheck, useForm, useNavigate } from '@/app/hooks';

import { BreadcrumbRoute, Content, H1, Section } from '@/app/ui/atoms';
import { DateFilter, DateFilterValue, Filter, SearchBar } from '@/app/ui/organisms/SearchBar';
import { Button } from '@/app/ui/form';

import { faX } from '@fortawesome/free-solid-svg-icons';

type Type = 'Media' | 'Content';

type LibraryTag = {
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

const getDimensions = (type: Type, breakpoint: Breakpoint): Pick<PaginationProps, 'columns' | 'rows'> => {
    const isContent = type === 'Content';
    if (breakpoint >= Breakpoint.lg) return { columns: isContent ? 1 : 4, rows: isContent ? 13 : 6 };
    if (breakpoint >= Breakpoint.md) return { columns: isContent ? 1 : 3, rows: isContent ? 12 : 8 };
    return { columns: 1, rows: isContent ? 8 : 4 };
};

interface Props<T, F, I> {
    type: T;
    heading: string;
    filterSetup: {
        default: F;
        option: Record<keyof F, FilterList>;
        date?: true;
    };
    items: I[];
    urlParamName: keyof F;
    renderItem: (item: I) => ReactElement;
}

const LibraryTemplate = <
    T extends Type,
    F extends Record<string, string>,
    I extends T extends 'Media' ? MediaCardType : ContentCardType,
>(
    props: Props<T, F, I>,
) => {
    const { type, heading, items, filterSetup, urlParamName, renderItem } = props;

    const { [urlParamName]: urlParam } = (useParams() || { category: filterSetup.default[urlParamName] }) as {
        [urlParamName]: string;
    };

    const breakpoint = useBreakpointCheck();
    const [_, router] = useNavigate();

    const [filter, setFilterField, setFilter] = useForm<F & FilterDefault>({
        ...DEFAULT_FILTER,
        ...filterSetup.default,
    });

    useEffect(() => {
        setFilterField(urlParamName, urlParam);
    }, [urlParam]);

    const tags: LibraryTag[] = [];
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

        const isUrlParam = key === urlParamName;
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

    const tagsFinal: LibraryTag[] = [
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

    const dimensions = getDimensions(type, breakpoint);

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
                    classNameIcon={'[&_*]:size-7xs'}
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
                    searchState={[filter.search, (value: string) => setFilterField('search', value)]}
                    filters={filters}
                    dateFilter={dateFilter}
                    placeholder={'Search for courses...'}
                    className={'sm:mt-n mt-xxl'}
                />
                <ul className={'flex gap-x-xs  my-4xs md:my-xxs lg:my-xs'}>{TagsLi}</ul>
                <Pagination
                    Items={ItemsLi}
                    className={'mt-xxl lg:mt-[4.41rem]'}
                    {...dimensions}
                />
            </Section>
        </Content>
    );
};

LibraryTemplate.displayName = LibraryTemplate.name;

export { LibraryTemplate };
