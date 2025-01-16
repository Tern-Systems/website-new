import {FC, PropsWithChildren, useEffect, useState} from "react";

import {BaseModal} from "@/app/ui/modals/Base";
import {useModal} from "@/app/context";


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
            classNameTitle={'pr-[--p-content-3xs]'}
            className={'place-self-center mx-auto right-[--s-default] bottom-[min(6dvw,7.2rem)] overflow-hidden pb-0 px-0 cursor-pointer'}
        >
            <span className={'pl-[--p-content-3xs]'}>{props.children}</span>
            <span
                style={{width: lineWidth + '%'}}
                className={'block mt-[--p-content-5xs] max-w-full h-[0.25rem] bg-white'}
            />
        </BaseModal>
    );
}

export {MessageModal};