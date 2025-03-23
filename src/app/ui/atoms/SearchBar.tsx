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
        <div className={cn('w-full p-xs flex gap-x-n relative')}>
            <div>
                <h3 className={cn('text-14 text-primary flex-col leading-[0.6125rem] mb-4xs')}>Content Types</h3>
                <Select
                    options={contentTypes}
                    value={contentType}
                    onChangeCustom={(value) => {
                        setContentType(value);
                    }}
                    className='!bg-gray h-[1.8125rem] border-s !border-gray-l0 pl-5xs min-w-[7.4375rem]'
                    classNameUl='flex flex-col border-s border-gray-l0 max-h-[7.5rem] w-[7.4375rem] !gap-y-[0.125rem] pt-5xs pb-5xs'
                    classNameOption='!bg-gray border-none h-[1.25rem] overflow-hidden hover:x-[!bg-white-d0,text-black]'
                    placeholder=''
                    classNameSelected='!w-full'
                    classNameChevron='ml-auto mr-[0.5rem]'
                />
            </div>
            <div className={'flex flex-col relative'}>
                <h3 className={cn('text-14 text-primary flex-col leading-[0.6125rem] mb-4xs')}>Date Range</h3>
                <Input
                    icons={[SVG_CALENDAR]}
                    className={'bg-gray border-s border-gray-l0 w-[7.5625rem] h-[1.8125rem] pl-5xs'}
                    classNameIconSpan={'bg-[#979797] h-full !pr-0 w-[2.023125rem] justify-center'}
                ></Input>
                <span className='h-[0.625rem]'></span>
                <Input
                    icons={[SVG_CALENDAR]}
                    className={'bg-gray border-s border-gray-l0 w-[7.5625rem] h-[1.8125rem] pl-5xs'}
                    classNameIconSpan={'bg-[#979797] h-full !pr-0 w-[2.023125rem] justify-center'}
                />
            </div>
        </div>
    );

    return (
        <label
            className={cn(
                `cursor-white group flex cursor-text border-gray-l0`,
                `transition-all duration-500 ease-in-out focus-within:x-[border-white-d0,shadow-lg]`,
                'h-[3.125rem]',
                'bg-gray-d2',
                'relative',
                className,
            )}
        >
            <input
                {...inputProps}
                className={`w-full bg-inherit py-5xs pl-3xs text-18 outline-none sm:pl-5xs`}
                tabIndex={0}
                autoFocus
            />
            <ReactSVG
                src={SVG_SEARCH.src}
                className={cn(
                    'my-auto text-white transition-all duration-500 ease-in-out group-focus-within:text-white-d0 flex',
                    '[&_*]:size-[1.3125rem] mr-[1.25rem]',
                )}
            />
            <div
                onClick={() => {
                    toggleFilterExpand();
                }}
                className={cn(
                    'flex place-items-center justify-center size-[3.125rem] cursor-pointer',
                    filterExpanded ? 'bg-gray' : 'bg-inherit',
                )}
            >
                <ReactSVG
                    src={SVG_ARROW_DOWN.src}
                    className={cn(
                        'my-auto text-white transition-all duration-500 ease-in-out group-focus-within:text-white-d0 flex',
                        filterExpanded && '[&_*]:scale-y-[-1] [&_*]:translate-y-full',
                    )}
                />
            </div>
            {filterExpanded ? (
                <div
                    className={cn(
                        `absolute right-0 top-full z-30 h-[12.5rem] w-[19.375rem] overflow-y-scroll`,
                        `pointer-events-auto bg-gray border-s border-gray-l0`,
                    )}
                >
                    {Dropdown}
                </div>
            ) : null}
        </label>
    );
};

export { SearchBar };
