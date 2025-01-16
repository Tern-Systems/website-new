import {FC, PropsWithChildren, useEffect, useState} from "react";

import {BaseModal} from "@/app/ui/modals/Base";
import {useModal} from "@/app/context";

import styles from "@/app/common.module.css";
import cn from "classnames";


const TIMER_INTERVAL = 50;


const MessageModal: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const modalCtx = useModal();

    const [lineWidth, setLineWidth] = useState(100); // width: 100%
    const [hovered, setHoveredState] = useState(false);

    useEffect(() => {
        const id = setInterval(() => {
            if (!hovered) {
                setLineWidth((prevState) => {
                    if (prevState <= 0) {
                        clearInterval(id);
                        modalCtx.closeModal();
                    }
                    return prevState - 1;
                });
            }
        }, TIMER_INTERVAL);
        return () => clearInterval(id);
    })

    return (
        <BaseModal
            isSimple
            setHoverState={setHoveredState}
            className={cn(styles.clickable,
                `place-self-center mx-auto right-[--s-default] bottom-[min(6dvw,7.2rem)] max-w-[19.3rem] w-fit`,
                `overflow-hidden cursor-pointer`
            )}
        >
            <span>{props.children}</span>
            <span
                style={{width: lineWidth + '%'}}
                className={'absolute block left-0 bottom-0 mt-[--p-content-5xs] max-w-full h-[0.25rem] bg-white'}
            />
        </BaseModal>
    );
}

export {MessageModal};