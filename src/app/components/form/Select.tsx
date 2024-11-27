import React, {ReactElement, SelectHTMLAttributes, useState} from 'react';
import Image from "next/image";

import SVG_CHEVRON from "@/assets/images/icons/select-chewron.svg";

interface SelectProps<T extends string> extends SelectHTMLAttributes<HTMLSelectElement> {
    options: Record<string, T>;
    value: T;
    onChangeCustom: (value: string) => void;
    classNameOptions?: string;
}

function Select<T extends string>(props: SelectProps<T>) {
    const {options, value, className, classNameOptions, onChangeCustom} = props;

    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);

    // Options list
    const Options = Object.entries(options).map(([key, value], index) =>
        <li
            key={value + index}
            value={value}
            className={`px-[0.74rem] py-[0.8rem] border-small border-control3 [&:not(:last-of-type)]:border-b-0
                        last-of-type:rounded-b-small overflow-ellipsis`}
            onClick={() => onChangeCustom(key)}
        >
            {value}
        </li>
    );

    const selectedOptionIdx: number = Object.values(options).indexOf(options[value]);
    const OptionsJSX: ReactElement[] = selectedOptionIdx < 0
        ? Options
        : [
            ...Options.slice(0, selectedOptionIdx),
            ...Options.slice(selectedOptionIdx + 1)
        ];

    return (
        <>
            <select {...props} className={'absolute w-0'}/>
            <label
                className={`relative flex items-center cursor-pointer select-none ${className} ${isSelectExpanded ? '[&]:rounded-b-none' : ''}`}
                onClick={() => toggleSelectExpand()}
                onBlur={() => setSelectExpanded(false)}
            >
                <div className={'text-nowrap'}>
                    <div>
                        <span className={selectedOptionIdx < 0 ? 'text-placeholder' : ''}>
                            {selectedOptionIdx < 0 ? value : options[value]}
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
        </>
    );
}

export {Select}