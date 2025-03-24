import React, {
    FC,
    InputHTMLAttributes,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { copyObject } from '@/app/utils';

import SVG_CHEVRON from '/public/images/icons/chevron.svg';
import SVG_BULLET_LIST from '/public/images/icons/bullet-list.svg';
import { useOuterClickClose } from '@/app/hooks/useOuterClickClose';

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
    classNameSelected?: string;
    onClick?: () => void;
    onOpen?: (isExpanded: boolean) => void;
    altIcon?: true;
}

const Select: FC<Props> = (props: Props) => {
    const {
        children,
        options,
        value,
        onOpen,
        classNameWrapper,
        classNameUl,
        classNameOption,
        className,
        classNameLabel,
        classNameChevron,
        classNameSelected,
        hidden,
        onChangeCustom,
        placeholder,
        altIcon,
        ...selectPropsRest
    } = props;

    const optionsFinal: Record<string, string> = copyObject(options ?? {});
    let optionsEntries = Object.entries(optionsFinal ?? {});

    const hasEmptyOption = optionsEntries.find(([key]) => key === EMPTY_KEY) !== undefined;
    const isValueNullish = [EMPTY_KEY, -1].includes(value);

    if (
        (optionsEntries.length === 1 + +hasEmptyOption && !isValueNullish && options[value]) ||
        optionsEntries.length === 0
    )
        optionsFinal[EMPTY_KEY] = 'Empty list';
    else if (!optionsFinal[EMPTY_KEY]) delete optionsFinal[EMPTY_KEY];

    optionsEntries = Object.entries(optionsFinal);

    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const [expanded, setSelectExpanded] = useState(false);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);

    useOuterClickClose(ref, expanded, setSelectExpanded);

    useEffect(() => onOpen?.(expanded), [onOpen]);

    // Options list
    const selectedOptionIdx: number =
        value === EMPTY_KEY ? -1 : Object.values(optionsFinal).indexOf(optionsFinal[value]);

    optionsEntries =
        selectedOptionIdx < 0
            ? optionsEntries
            : [...optionsEntries.slice(0, selectedOptionIdx), ...optionsEntries.slice(selectedOptionIdx + 1)];

    const Options: ReactElement[] = optionsEntries.map(([key, value], idx) => (
        <option
            key={value + idx}
            value={value}
            onClick={() => EMPTY_KEY !== key && onChangeCustom(key)}
            className={cn(
                `flex items-center overflow-x-hidden px-[min(2dvw,0.75rem)] py-3xs`,
                `border-s border-white-d0 bg-white [&:not(:last-of-type)]:border-b-0`,
                `overflow-ellipsis text-nowrap`,
                classNameOption,
                { ['!text-section-3xs']: EMPTY_KEY === key },
            )}
        >
            {value}
        </option>
    ));

    const isPlaceholder = selectedOptionIdx < 0 || !optionsFinal[value];

    return (
        <div
            ref={ref}
            onClick={() => {
                selectPropsRest.onClick?.();
                toggleSelectExpand();
            }}
            className={cn(`relative flex items-center`, classNameWrapper, { ['hidden']: hidden })}
        >
            <input
                {...selectPropsRest}
                value={value}
                onChange={() => {}}
                placeholder={placeholder}
                className={'absolute bottom-0 left-[34%] -z-10 [&&]:h-0 [&&]:w-1 [&&]:p-0'}
            />
            {children ? <span className={classNameLabel}>{children}</span> : null}
            <label
                onBlur={() => setSelectExpanded(false)}
                className={cn(
                    `group flex w-full cursor-pointer select-none items-center capitalize`,
                    `border-s border-white-d0 bg-white`,
                    className,
                )}
            >
                <div className={cn(`relative flex w-fit items-center`, classNameSelected)}>
                    <span
                        className={cn(`w-fit overflow-x-hidden overflow-ellipsis text-nowrap leading-[1.3]`, {
                            ['text-placeholder']: isPlaceholder,
                        })}
                    >
                        {isPlaceholder
                            ? hasEmptyOption && optionsFinal[EMPTY_KEY]
                                ? optionsFinal[EMPTY_KEY]
                                : (placeholder ?? 'Select')
                            : optionsFinal[value]}
                    </span>
                    <ReactSVG
                        src={altIcon ? SVG_BULLET_LIST.src : SVG_CHEVRON.src}
                        className={cn(`group ml-5xs h-auto w-xxs brightness-[85%]`, classNameChevron, {
                            ['rotate-180']: !altIcon && expanded,
                        })}
                    />
                </div>
                {expanded ? (
                    <ul
                        className={cn(
                            `absolute left-0 top-full z-30 max-h-[20rem] w-full min-w-fit overflow-y-scroll`,
                            `pointer-events-auto`,
                            classNameUl,
                        )}
                    >
                        {Options}
                    </ul>
                ) : null}
            </label>
        </div>
    );
};

Select.displayName = Select.name;

export { Select };
