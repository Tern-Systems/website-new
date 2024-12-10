import {FC, PropsWithChildren} from "react";
import {Button} from "@/app/components/form";
import {useModal} from "@/app/context";

interface ModalConfig extends PropsWithChildren {
    isSimple?: boolean;
    title?: string;
    onClose?: () => void;
    className?: string;
    classNameContent?: string;
}

const BaseModal: FC<ModalConfig> = (props: ModalConfig) => {
    const {
        children, isSimple, title, onClose,
        className, classNameContent
    } = props;

    const modalCtx = useModal();

    const handleClose = () => {
        modalCtx.closeModal();
        onClose?.();
    }

    if (isSimple) {
        return (
            <span
                className={`absolute flex items-center gap-[1rem] px-[0.62rem] py-[0.8rem]
                            bg-control2 rounded-[0.375rem] ${className} pointer-events-auto`}
            >
                <span className={classNameContent}>{children}</span>
                <Button
                    icon={'close'}
                    className={'place-self-start min-w-[0.5625rem] inline-block'}
                    onClick={() => handleClose()}
                />
            </span>
        );
    } else {
        return (
            <div
                className={`p-[--py] rounded-[0.5625rem] border-small border-control3 bg-control
                            text-primary place-self-center mx-auto ${className} pointer-events-auto`}>
                <div className={`flex items-center justify-between font-oxygen`}>
                    <h2 className={'text-inherit font-oxygen text-[1.6875rem] font-bold'}>
                        {title ?? ''}
                    </h2>
                    <Button icon={'close'} onClick={() => handleClose()}/>
                </div>
                <hr className={'scale-[105%] mt-[1.25rem] mb-[1.54rem]'}/>
                <div className={classNameContent}>{children}</div>
            </div>
        )
    }
}

export {BaseModal}