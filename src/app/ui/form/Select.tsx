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

import styles from '@/app/common.module.css'


const EMPTY_KEY = 'empty'


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

    const ref: MutableRefObject<HTMLLabelElement | null> = useRef(null);
    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (isSelectExpanded && !ref.current?.contains(event.target as Node))
                setSelectExpanded(false);
        }
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [isSelectExpanded, setSelectExpanded])

    // Options list
    const selectedOptionIdx: number = Object.values(options).indexOf(options[value]);

    if (!Object.keys(options).length || selectedOptionIdx > -1 && Object.keys(options).length === 1)
        options[EMPTY_KEY] = 'Empty list';

    const Options: ReactElement[] = Object.entries(options).map(([key, value], idx) =>
        <option
            key={value + idx}
            value={value}
            className={`px-[0.74rem] py-[0.8rem] border-small border-control3 [&:not(:last-of-type)]:border-b-0
                        [&:first-of-type]:border-t-0 last-of-type:rounded-b-small overflow-ellipsis text-nowrap overflow-x-hidden
                        bg-white ${classNameOption}
                        ${EMPTY_KEY === key ? 'text-placeholder' : ''}`}
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
                onChange={()=>{}}
                placeholder={placeholder}
                className={'absolute -z-10 bottom-0 left-[34%] [&&]:w-1 [&&]:h-0 [&&]:p-0'}
            />
            <span hidden={!children} className={classNameLabel}>{children}</span>
            <label
                ref={ref}
                onClick={() => toggleSelectExpand()}
                onBlur={() => setSelectExpanded(false)}
                className={`flex items-center cursor-pointer select-none capitalize w-full border-small border-control3
                            ${styles.clickable} ${className} ${isSelectExpanded ? '[&&]:rounded-b-none' : ''}`}
            >
                <div className={'w-[85%] text-nowrap overflow-ellipsis overflow-hidden'}>
                    <span className={selectedOptionIdx < 0 ? 'text-placeholder' : ''}>
                        {selectedOptionIdx < 0 || !options[value] ? placeholder : options[value]}
                    </span>
                </div>
                <ul
                    hidden={!isSelectExpanded}
                    className={`absolute z-10 left-0 top-full w-full max-h-[20rem] overflow-y-scroll rounded-b-[0.375rem] pointer-events-auto`}
                >
                    {OptionsJSX}
                </ul>
                <Image
                    src={SVG_CHEVRON}
                    alt={'select chevron'}
                    className={`absolute right-[0.8rem] w-[1rem] brightness-[85%] ${isSelectExpanded ? 'rotate-180' : ''}`}
                />
            </label>
        </div>
    );
}

export {Select}