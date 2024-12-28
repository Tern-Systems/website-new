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
import Image from "next/image";

import SVG_CHEVRON from "@/assets/images/icons/chewron.svg";


const EMPTY_KEY = '';


interface Props extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren {
    options: Record<string, string>;
    value: string;
    onChangeCustom: (value: string) => void;
    classNameWrapper?: string;
    classNameLabel?: string;
    classNameOption?: string;
}

const Select: FC<Props> = (props: Props) => {
    const {
        children, options, value,
        classNameWrapper, classNameOption, className, classNameLabel, hidden,
        onChangeCustom, placeholder, ...selectPropsRest
    } = props;

    let optionsEntries = Object.entries(options);
    const hasEmptyOption = optionsEntries.find(([key]) => key === EMPTY_KEY) !== undefined;
    const isValueNullish = [EMPTY_KEY, -1].includes(value);

    const optionsFinal: Record<string, string> = options;

    if (optionsEntries.length === (1 + +hasEmptyOption) && !isValueNullish || optionsEntries.length === 0)
        optionsFinal[EMPTY_KEY] = 'Empty list';
    else
        delete optionsFinal?.[EMPTY_KEY];
    optionsEntries = Object.entries(optionsFinal);

    const ref: MutableRefObject<HTMLLabelElement | null> = useRef(null);
    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (isSelectExpanded && !ref.current?.contains(event.target as Node))
                setSelectExpanded(false);
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [isSelectExpanded, setSelectExpanded])

    // Options list
    const selectedOptionIdx: number = value === EMPTY_KEY ? -1 : Object.values(optionsFinal).indexOf(optionsFinal[value]);

    const Options: ReactElement[] = optionsEntries.map(([key, value], idx) =>
        <option
            key={value + idx}
            value={value}
            className={`px-[min(2dvw,0.75rem)] py-[min(1dvw,0.8rem)] border-small border-control-white-d0 [&:not(:last-of-type)]:border-b-0
                        [&:first-of-type]:border-t-0 last-of-type:rounded-b-small overflow-ellipsis text-nowrap overflow-x-hidden
                        bg-white ${classNameOption}
                        ${EMPTY_KEY === key ? 'text-placeholder text-small' : ''}`}
            onClick={() => EMPTY_KEY !== key && onChangeCustom(key)}
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
        <div className={`relative flex items-center ${classNameWrapper} ${hidden ? 'hidden' : ''}`}>
            <input
                {...selectPropsRest}
                value={value}
                onChange={() => {
                }}
                placeholder={placeholder}
                className={'absolute -z-10 bottom-0 left-[34%] [&&]:w-1 [&&]:h-0 [&&]:p-0'}
            />
            <span hidden={!children} className={classNameLabel}>{children}</span>
            <label
                ref={ref}
                onClick={() => toggleSelectExpand()}
                onBlur={() => setSelectExpanded(false)}
                className={`flex items-center cursor-pointer select-none capitalize w-full border-small border-control-white-d0 bg-white
                            ${className} ${isSelectExpanded ? '[&&]:rounded-b-none' : ''}`}
            >
                <div className={`w-[85%] text-nowrap overflow-ellipsis overflow-hidden`}>
                    <span className={selectedOptionIdx < 0 ? 'text-placeholder' : ''}>
                        {selectedOptionIdx < 0 || !optionsFinal[value] ? (placeholder ?? 'Select') : optionsFinal[value]}
                    </span>
                </div>
                <ul
                    hidden={!isSelectExpanded}
                    className={`absolute z-30 left-0 top-full w-full max-h-[20rem] overflow-y-scroll rounded-b-[0.375rem] pointer-events-auto`}
                >
                    {OptionsJSX}
                </ul>
                <Image
                    src={SVG_CHEVRON}
                    alt={'select chevron'}
                    className={`absolute right-[0.8rem] w-[min(2.4dvw,1rem)] brightness-[85%] ${isSelectExpanded ? 'rotate-180' : ''}`}
                />
            </label>
        </div>
    );
}

export {Select}