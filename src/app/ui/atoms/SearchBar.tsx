'use client';

import { FC, InputHTMLAttributes, ReactElement, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Input, Select } from '../form';

import SVG_ARROW_DOWN from '@/assets/images/icons/arrow-down.svg';
import SVG_SEARCH from '@/assets/images/icons/search.svg';
import SVG_CALENDAR from '@/assets/images/icons/calendar.svg';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    contentTypes: Record<string, string>;
}

const SearchBar: FC<Props> = (props: Props) => {
    const { className, contentTypes, ...inputProps } = props;

    const [contentType, setContentType] = useState<string>('');
    const [filterExpanded, setFilterExpanded] = useState<boolean>(false);

    const toggleFilterExpand = () => setFilterExpanded((prevState) => !prevState);

    const Dropdown: ReactElement = (
        <div className={cn('relative flex w-full p-xs gap-x-n')}>
            <div>
                <h3 className={cn('flex-col mb-4xs text-14 text-primary leading-[0.6125rem]')}>Content Types</h3>
                <Select
                    options={contentTypes}
                    value={contentType}
                    onChangeCustom={(value) => {
                        setContentType(value);
                    }}
                    className={'h-n min-w-[7.5] pl-5xs !bg-gray border-s !border-gray-l0'}
                    classNameUl={'flex flex-col max-h-12xl w-12xl !gap-y-6xs pt-5xs pb-5xs border-s border-gray-l0'}
                    classNameOption={'h-3xs !bg-gray border-none overflow-hidden hover:x-[!bg-white-d0,text-black]'}
                    placeholder={''}
                    classNameSelected={'!w-full'}
                    classNameChevron={'ml-auto mr-4xs-1'}
                />
            </div>
            <div className={'relative flex flex-col'}>
                <h3 className={cn('flex-col mb-4xs text-14 text-primary leading-[0.6125rem]')}>Date Range</h3>
                <Input
                    icons={[SVG_CALENDAR]}
                    className={'w-12xl h-n pl-5xs bg-gray border-s border-gray-l0'}
                    classNameIconSpan={'h-full w-l !pr-0 bg-gray-l2 justify-center'}
                ></Input>
                <span className='h-[0.625rem]'></span>
                <Input
                    icons={[SVG_CALENDAR]}
                    className={'w-12xl h-n pl-5xs bg-gray border-s border-gray-l0'}
                    classNameIconSpan={'h-full w-l !pr-0 bg-gray-l2 justify-center'}
                />
            </div>
        </div>
    );

    return (
        <label
            className={cn(
                `relative flex h-6xl group bg-gray-d2 border-gray-l0 cursor-white cursor-text`,
                `transition-all duration-500 ease-in-out focus-within:x-[border-white-d0,shadow-lg]`,
                className,
            )}
        >
            <input
                {...inputProps}
                className={`w-full bg-inherit py-5xs pl-3xs text-18 outline-none  sm:pl-5xs`}
                tabIndex={0}
                autoFocus
            />
            <ReactSVG
                src={SVG_SEARCH.src}
                className={cn(
                    'flex my-auto [&_*]:size-3xs  mr-xs text-white',
                    'transition-all duration-500 ease-in-out group-focus-within:text-white-d0',
                )}
            />
            <div
                onClick={() => {
                    toggleFilterExpand();
                }}
                className={cn(
                    'flex size-6xl place-items-center justify-center cursor-pointer',
                    filterExpanded ? 'bg-gray' : 'bg-inherit',
                )}
            >
                <ReactSVG
                    src={SVG_ARROW_DOWN.src}
                    className={cn(
                        'flex my-auto text-white transition-all duration-500 ease-in-out group-focus-within:text-white-d0',
                        filterExpanded && '[&_*]:scale-y-[-1] [&_*]:translate-y-full',
                    )}
                />
            </div>
            {filterExpanded ? (
                <div
                    className={cn(
                        `absolute z-30 h-[12.5rem] w-[19.375rem] right-0 top-full bg-gray border-s border-gray-l0`,
                        `pointer-events-auto overflow-y-scroll`,
                    )}
                >
                    {Dropdown}
                </div>
            ) : null}
        </label>
    );
};

export { SearchBar };
