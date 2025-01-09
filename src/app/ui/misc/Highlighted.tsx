import React, {FC, PropsWithChildren, ReactElement} from "react";

import styles from "@/app/common.module.css";


interface Props extends PropsWithChildren {
    heading: string;
    className?: string;
    classNameContentWrapper?: string;
    classNameWrapper?: string;
    btn?: ReactElement;
}


const Highlighted: FC<Props> = (props: Props) => {
    const {heading, className, classNameContentWrapper, classNameWrapper, children, btn} = props;

    return (
        <div className={`${styles.highlight} max-w-[62.5rem] max-h-[41.6rem]
                    sm:x-[max-h-[35.25rem] sm:portrait:h-[calc(100%-2*3.06rem)]
                    sm:landscape:my-[--p-content-xs] sm:landscape:h-[calc(100%-calc(2*var(--p-content-xs)))]
                    ${classNameWrapper}`}
        >
            <h1 className={`text-heading-l
                        sm:text-heading
                        sm:landscape:text-section`}
            >
                {heading}
            </h1>
            <div className={`overflow-y-scroll h-full
                        mt-[3rem]
                        sm:mt-[--p-content-xs]
                        ${classNameContentWrapper}`}
            >
                <div className={`flex flex-col h-full font-bold leading-[120%] font-neo whitespace-pre-line 
                            gap-y-[2rem] text-heading 
                            sm:text-section-s
                            sm:landscape:gap-y-[1.2rem]
                            ${className}`}
                >
                    {children}
                </div>
            </div>
            {btn}
        </div>
    );
}

export {Highlighted};
