import {FC, PropsWithChildren, useEffect, useState} from "react";

import {BaseModal} from "@/app/ui/modals/Base";
import {useModal} from "@/app/context";
import cn from "classnames";


const TIMER_INTERVAL = 50;
const ANIMATION_DURATION = 500;


const MessageModal: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const modalCtx = useModal();

    //eslint-disable-next-line
    const [_, setTimer] = useState(100);
    const [hovered, setHoveredState] = useState(false);
    const [animate, setAnimate] = useState<boolean>(false);

    useEffect(() => {

        const animationTimeout = setTimeout(() => setAnimate(true), TIMER_INTERVAL);

        const id = setInterval(() => {
            if (!hovered) {
                setTimer((prevState) => {
                    if (prevState <= 0) {
                        clearInterval(id);
                        setAnimate(false)
                        setTimeout(() => {
                            modalCtx.closeModal();
                        }, ANIMATION_DURATION);
                        return 0;
                    }
                    return prevState - 1;
                });
            }
        }, TIMER_INTERVAL);

        return () => {
            clearInterval(id);
            clearTimeout(animationTimeout);
        };
    }, [hovered, modalCtx]);

    return (
        <BaseModal
            isSimple
            setHoverState={setHoveredState}
            className={cn(
                `place-self-center mx-auto right-[--s-default] bottom-[min(6dvw,7.2rem)] max-w-[19.3rem] w-fit cursor-pointer`,
                `transition-all transform`,
                animate
                    ? "duration-500 ease-in opacity-100 translate-y-0"
                    : "duration-500 ease-out opacity-0 translate-y-full"
            )}
        >
            {props.children}
        </BaseModal>
    );
}

export {MessageModal};