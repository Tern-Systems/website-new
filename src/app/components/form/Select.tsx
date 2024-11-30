import React, {InputHTMLAttributes, ReactElement, useState} from 'react';
import Image from "next/image";

import SVG_CHEVRON from "@/assets/images/icons/select-chewron.svg";

interface SelectProps<T extends string> extends InputHTMLAttributes<HTMLInputElement> {
    options: Record<string, T>;
    value: T;
    onChangeCustom: (value: string) => void;
    classNameOptions?: string;
}

function Select<T extends string>(props: SelectProps<T>) {
    const {options, value, className, classNameOptions, onChangeCustom,placeholder, ...selectPropsRest} = props;

    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);

    // Options list
    const Options = Object.entries(options).map(([key, value], index) =>
        <option
            key={value + index}
            value={value}
            className={`px-[0.74rem] py-[0.8rem] border-small border-control3 [&:not(:last-of-type)]:border-b-0
                        [&:first-of-type]:border-t-0 last-of-type:rounded-b-small overflow-ellipsis text-nowrap overflow-x-hidden`}
            onClick={() => onChangeCustom(key)}
        >
            {value}
        </option>
    );

    const selectedOptionIdx: number = Object.values(options).indexOf(options[value]);
    const OptionsJSX: ReactElement[] = selectedOptionIdx < 0
        ? Options
        : [
            ...Options.slice(0, selectedOptionIdx),
            ...Options.slice(selectedOptionIdx + 1)
        ];

    return (
        <div className={'relative'}>
            <input
                {...selectPropsRest}
                value={value}
                placeholder={placeholder}
                className={'absolute -z-10 bottom-0 left-[34%] [&&]:w-1 [&&]:h-0 [&&]:p-0'}
            />
            <label
                className={`flex items-center cursor-pointer select-none ${className} ${isSelectExpanded ? '[&]:rounded-b-none' : ''}`}
                onClick={() => toggleSelectExpand()}
                onBlur={() => setSelectExpanded(false)}
            >
                <div className={'text-nowrap'}>
                    <div>
                        <span className={selectedOptionIdx < 0 ? 'text-placeholder' : ''}>
                            {selectedOptionIdx < 0 ? placeholder : options[value]}
                        </span>
                    </div>
                    <ul className={`absolute z-10 left-0 top-full w-full max-h-[20rem] overflow-y-scroll ${classNameOptions} ${isSelectExpanded ? '' : 'invisible'}`}>
                        {OptionsJSX}
                    </ul>
                </div>
                <Image
                    src={SVG_CHEVRON}
                    alt={'select chevron'}
                    className={`absolute top-[1.3rem] right-[0.8rem] w-[1rem] brightness-[85%] ${isSelectExpanded ? 'rotate-180' : ''}`}
                />
            </label>
        </div>
    );
}

export {Select}