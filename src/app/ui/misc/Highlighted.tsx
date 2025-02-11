import React, {FC, PropsWithChildren} from "react";

import styles from "@/app/common.module.css";


interface Props extends PropsWithChildren {
    heading: string;
    className?: string;
    classNameContentWrapper?: string;
    classNameWrapper?: string;
}


const Highlighted: FC<Props> = (props: Props) => {
    const {heading, className, classNameContentWrapper, classNameWrapper, children} = props;

    return (
        <div className={`${styles.highlight} max-w-[62.5rem] max-h-[80%]
                    sm:max-h-[75vh] sm:portrait:h-[calc(100%-2*3.06rem)]
                    sm:landscape:my-xs sm:landscape:h-[calc(100%-calc(2*var(--p-xs)))]
                    ${classNameWrapper} flex flex-col justify-center`}
        >
            <h1 className={`text-heading-l
                        sm:text-heading
                        sm:landscape:text-section flex-none`}
            >
                {heading}
            </h1>
            <div className={`overflow-y-auto flex-1
                        mt-[3rem]
                        sm:mt-xs
                        ${classNameContentWrapper}`}
            >
                <div className={`flex flex-col h-full font-bold leading-[120%] font-gothic whitespace-pre-line 
                            gap-y-[2rem] text-heading 
                            sm:text-section-s
                            sm:landscape:gap-y-[1.2rem]
                            ${className}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export {Highlighted};
