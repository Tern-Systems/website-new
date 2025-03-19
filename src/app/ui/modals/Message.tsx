import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { BaseModal } from '@/app/ui/modals/Base';
import { useModal } from '@/app/context';
import cn from 'classnames';

const TIMER_INTERVAL = 50;
const ANIMATION_DURATION = 500;

const MessageModal: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const modalCtx = useModal();

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
                        setAnimate(false);
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
                `bottom-[min(6dvw,7.2rem)] right-l mx-auto w-fit max-w-[19.3rem] cursor-pointer place-self-center`,
                `transform transition-all`,
                animate
                    ? 'translate-y-0 opacity-100 duration-500 ease-in'
                    : 'translate-y-full opacity-0 duration-500 ease-out',
            )}
        >
            {props.children}
        </BaseModal>
    );
};

MessageModal.displayName = 'MessageModal';

export { MessageModal };
