'use client';

import { ContentCardType, MediaCardType } from '@/app/types/blog';
import { PaginationProps } from '@/app/ui/organisms/Pagination';
import { SelectOptions } from '@/app/ui/form/Select';
import { Breakpoint } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';

import { BreadcrumbRoute, Content, H1, Section } from '@/app/ui/atoms';
import { PageType, PaginationSectionProps, Search } from '../Search';

const getDimensions = (type: PageType, breakpoint: Breakpoint): Pick<PaginationProps, 'columns' | 'rows'> => {
    const isContent = type === 'Content';
    if (breakpoint >= Breakpoint.lg) return { columns: isContent ? 1 : 4, rows: isContent ? 13 : 6 };
    if (breakpoint >= Breakpoint.md) return { columns: isContent ? 1 : 3, rows: isContent ? 12 : 8 };
    return { columns: 1, rows: isContent ? 8 : 4 };
};

interface Props<T, F, I> extends Omit<PaginationSectionProps<T, F, I>, 'columns' | 'rows'> {
    heading: string;
}

const LibraryTemplate = <
    T extends PageType,
    F extends SelectOptions,
    I extends T extends 'Media' ? MediaCardType : ContentCardType,
>(
    props: Props<T, F, I>,
) => {
    const { heading, type, ...searchProps } = props;

    const breakpoint = useBreakpointCheck();
    const dimensions = getDimensions(type, breakpoint);

    return (
        <Content type={'to-top'}>
            <Section>
                <BreadcrumbRoute />
                <H1
                    type={'small'}
                    className={'sm:mt-n mt-xxl'}
                >
                    {heading}
                </H1>
                <Search
                    type={type}
                    showTags
                    {...searchProps}
                    {...dimensions}
                />
            </Section>
        </Content>
    );
};

LibraryTemplate.displayName = LibraryTemplate.name;

export { LibraryTemplate };
