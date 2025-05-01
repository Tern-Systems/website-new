'use client';

import {
    FC,
    InputHTMLAttributes,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

import { copyObject, exclude } from '@/app/utils';
import { useOuterClickClose } from '@/app/hooks';

import { Input } from '@/app/ui/form';

import { faChevronDown, faChevronUp, faList } from '@fortawesome/free-solid-svg-icons';

const EMPTY_KEY = '';

type SelectOptions = Record<string, string>;

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>, PropsWithChildren {
    options: SelectOptions;
    value: string;
    onChange: (value: string) => void;
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
        onChange,
        placeholder,
        altIcon,
        multiple,
        ...selectPropsRest
    } = props;

    const optionsFinal: SelectOptions = copyObject(options ?? {});
    let optionsEntries = Object.entries(optionsFinal ?? {});

    const hasEmptyOption = optionsEntries.find(([key]) => key === EMPTY_KEY) !== undefined;
    const valueNullish = [EMPTY_KEY, -1].includes(value);

    if (
        (optionsEntries.length === 1 + +hasEmptyOption && !valueNullish && options[value]) ||
        optionsEntries.length === 0
    ) {
        optionsFinal[EMPTY_KEY] = 'Empty list';
    } else if (!optionsFinal[EMPTY_KEY]) delete optionsFinal[EMPTY_KEY];

    optionsEntries = Object.entries(optionsFinal);

    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        selectPropsRest.onClick?.();
        setExpanded((prevState) => !prevState);
    };

    useOuterClickClose(ref, expanded, setExpanded);

    useEffect(() => onOpen?.(expanded), [onOpen]);

    // Options list
    const selectedIdx: number = value === EMPTY_KEY ? -1 : Object.values(optionsFinal).indexOf(optionsFinal[value]);
    optionsEntries = selectedIdx < 0 || multiple ? optionsEntries : exclude(optionsEntries, selectedIdx);

    const OptionsLi: ReactElement[] = optionsEntries.map(([key, label], idx) => {
        const handleClick = () => {
            if (key !== EMPTY_KEY) {
                let newValue = key;
                if (multiple) {
                    newValue = (
                        value.includes(newValue)
                            ? exclude(value.split(','), newValue)
                            : [value, newValue].filter((value) => value)
                    ).join(',');
                }
                onChange(newValue);
                if (!multiple) setExpanded((prevState) => !prevState);
            }
        };
        const checked = multiple && value.includes(key);
        return (
            <li
                key={label + idx}
                onClick={handleClick}
                className={cn(
                    'flex items-center justify-between px-5xs py-3xs cursor-pointer',
                    'border-s border-t-0 border-white-d0 !bg-inherit !text-inherit',
                    classNameOption,
                    {
                        ['!text-10']: key === EMPTY_KEY,
                        ['gap-x-5xs max-w-full']: multiple,
                    },
                )}
            >
                <span>{label}</span>
                {multiple ? (
                    <Input
                        type={'checkbox'}
                        checked={checked}
                        onChange={() => {}}
                        className={'size-[0.8125rem] border rounded-sm bg-inherit pointer-events-auto'}
                    />
                ) : null}
            </li>
        );
    });

    const hasPlaceholder = selectedIdx < 0 || !optionsFinal[value] || multiple;

    return (
        <div
            ref={ref}
            className={cn(`flex items-center`, classNameWrapper, { ['hidden']: hidden })}
        >
            <input
                {...selectPropsRest}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={'absolute bottom-0 left-[34%] -z-10 [&&]:h-0 [&&]:w-1 [&&]:p-0'}
            />
            {children ? <span className={classNameLabel}>{children}</span> : null}
            <div
                className={cn(
                    `relative group flex w-full cursor-pointer select-none items-center capitalize`,
                    `!border-s border-white-d0 bg-white`,
                    { ['!border-b-0']: expanded },
                    className,
                )}
            >
                <div
                    onClick={toggleExpand}
                    className={cn(`relative flex justify-between w-full items-center`, classNameSelected)}
                >
                    <span
                        className={cn(`w-fit overflow-x-hidden overflow-ellipsis text-nowrap leading-l`, {
                            ['text-placeholder']: hasPlaceholder,
                        })}
                    >
                        {hasPlaceholder
                            ? hasEmptyOption && optionsFinal[EMPTY_KEY]
                                ? optionsFinal[EMPTY_KEY]
                                : (placeholder ?? 'Select')
                            : optionsFinal[value]}
                    </span>
                    <FontAwesomeIcon
                        icon={altIcon ? faList : expanded ? faChevronUp : faChevronDown}
                        className={cn('size-7xs group ml-5xs', classNameChevron)}
                    />
                </div>
                {expanded ? (
                    <ul
                        className={cn(
                            `absolute left-0 top-full z-30 max-h-[20rem] w-full min-w-fit bg-inherit overflow-y-scroll pointer-events-auto`,
                            classNameUl,
                        )}
                    >
                        {OptionsLi}
                    </ul>
                ) : null}
            </div>
        </div>
    );
};

Select.displayName = Select.name;

export type { SelectOptions };
export { Select };
