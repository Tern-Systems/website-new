import React, {
    FC,
    InputHTMLAttributes,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState
} from 'react';
import {ReactSVG} from "react-svg";
import cn from "classnames";

import {copyObject} from "@/app/utils";

import SVG_CHEVRON from "/public/images/icons/chevron.svg";


const EMPTY_KEY = '';


interface Props extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren {
    options: Record<string, string>;
    value: string;
    onChangeCustom: (value: string) => void;
    classNameWrapper?: string;
    classNameLabel?: string;
    classNameUl?: string;
    classNameOption?: string;
    classNameChevron?: string;
    onClick?: () => void;
    onOpen?: (isExpanded: boolean) => void;
}

const Select: FC<Props> = (props: Props) => {
    const {
        children, options, value, onOpen,
        classNameWrapper, classNameUl, classNameOption, className, classNameLabel, classNameChevron, hidden,
        onChangeCustom, placeholder, ...selectPropsRest
    } = props;

    const optionsFinal: Record<string, string> = copyObject(options ?? {});
    let optionsEntries = Object.entries(optionsFinal ?? {});

    const hasEmptyOption = optionsEntries.find(([key]) => key === EMPTY_KEY) !== undefined;
    const isValueNullish = [EMPTY_KEY, -1].includes(value);

    if (optionsEntries.length === (1 + +hasEmptyOption) && !isValueNullish && options[value] || optionsEntries.length === 0)
        optionsFinal[EMPTY_KEY] = 'Empty list';
    else if (!optionsFinal[EMPTY_KEY])
        delete optionsFinal[EMPTY_KEY];

    optionsEntries = Object.entries(optionsFinal);

    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const [expanded, setSelectExpanded] = useState(false);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);


    useEffect(() => {
        onOpen?.(expanded);
        const handleClick = (event: MouseEvent) => {
            if (expanded && !ref.current?.contains(event.target as Node))
                setSelectExpanded(false);
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [expanded, setSelectExpanded, onOpen])

    // Options list
    const selectedOptionIdx: number = value === EMPTY_KEY ? -1 : Object.values(optionsFinal).indexOf(optionsFinal[value]);

    const Options: ReactElement[] = optionsEntries.map(([key, value], idx) =>
        <option
            key={value + idx}
            value={value}
            onClick={() => EMPTY_KEY !== key && onChangeCustom(key)}
            className={cn(
                `flex px-[min(2dvw,0.75rem)] py-3xs items-center overflow-x-hidden`,
                `bg-white border-s border-white-d0 [&:not(:last-of-type)]:border-b-0`,
                `overflow-ellipsis text-nowrap`, classNameOption,
                {['!text-section-3xs']: EMPTY_KEY === key}
            )}
        >
            {value}
        </option>
    );

    const OptionsJSX: ReactElement[] = selectedOptionIdx < 0
        ? Options
        : [
            ...Options.slice(0, selectedOptionIdx),
            ...Options.slice(selectedOptionIdx + 1)
        ];

    return (
        <div
            ref={ref}
            onClick={() => {
                selectPropsRest.onClick?.();
                toggleSelectExpand();
            }}
            className={cn(`relative flex items-center`, classNameWrapper, {['hidden']: hidden})}
        >
            <input
                {...selectPropsRest}
                value={value}
                onChange={() => {
                }}
                placeholder={placeholder}
                className={'absolute -z-10 bottom-0 left-[34%] [&&]:w-1 [&&]:h-0 [&&]:p-0'}
            />
            {children ? <span className={classNameLabel}>{children}</span> : null}
            <label
                onBlur={() => setSelectExpanded(false)}
                className={cn(
                    `group flex items-center cursor-pointer select-none capitalize w-full`,
                    `border-s border-white-d0 bg-white [&]:rounded-s`,
                    className,
                    {[`[&&]:rounded-b-none`]: expanded},
                )}
            >
                <div className={`relative flex w-fit items-center`}>
                    <span
                        className={cn(
                            `w-fit text-nowrap overflow-ellipsis overflow-x-hidden leading-[1.3]`,
                            {['text-section-3xs']: selectedOptionIdx < 0 && !hasEmptyOption},
                        )}
                    >
                      {selectedOptionIdx < 0 || !optionsFinal[value]
                          ? (hasEmptyOption && optionsFinal[EMPTY_KEY] ? optionsFinal[EMPTY_KEY] : (placeholder ?? 'Select'))
                          : optionsFinal[value]
                      }
                    </span>
                    <ReactSVG
                        src={SVG_CHEVRON.src}
                        className={cn(
                            `ml-5xs w-xxs h-auto brightness-[85%] group`, classNameChevron,
                            {['rotate-180']: expanded}
                        )}
                    />
                </div>
                {expanded
                    ? (
                        <ul
                            className={cn(
                                `absolute z-30 left-0 top-full w-fit max-h-[20rem] overflow-y-scroll`,
                                `rounded-b-xs pointer-events-auto`, classNameUl,
                            )}
                        >
                            {OptionsJSX}
                        </ul>
                    )
                    : null
                }
            </label>
        </div>
    );
}

export {Select}