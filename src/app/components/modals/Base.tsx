import {FC, PropsWithChildren} from "react";
import {Button} from "@/app/components/form/Button";
import {useModal} from "@/app/context/Modal.context";

interface ModalConfig extends PropsWithChildren {
    isSmall?: boolean;
    title?: string;
    onClose?: () => void;
    className?: string;
    classNameContent?: string;
}

const BaseModal: FC<ModalConfig> = (props: ModalConfig) => {
    const {
        children, isSmall, title, onClose,
        className, classNameContent
    } = props;

    const modalCtx = useModal();

    if (isSmall) {
        return (
            <span
                className={`flex items-center gap-[1rem] px-[0.62rem] py-[0.8rem]
                            bg-control2 rounded-[0.375rem] text-left ${className}`}
            >
                <span className={classNameContent}>{children}</span>
                <Button icon={'close'} onClick={() => onClose?.()}/>
            </span>
        );
    } else {
        return (
            <div
                className={`p-[--py] rounded-[0.5625rem] border-small border-control3 bg-control
                            text-primary place-self-center mx-auto ${className}`}>
                <div className={`flex items-center justify-between font-oxygen text-primary`}>
                    <h2
                        id={'modal-title'}
                        className={'text-primary font-oxygen text-[1.6875rem] font-bold'}
                    >
                        {title ?? ''}
                    </h2>
                    <Button
                        icon={'close'}
                        onClick={() => {
                            modalCtx.closeModal();
                            onClose?.()
                        }}
                    />
                </div>
                <hr className={'scale-[105%] mt-[1.25rem] mb-[1.54rem]'}/>
                <div className={classNameContent}>{children}</div>
            </div>
        )
    }
}

export {BaseModal}