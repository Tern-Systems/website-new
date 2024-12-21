import {FC, PropsWithChildren} from "react"

import {useModal} from "@/app/context"

import {Button} from "@/app/ui/form";


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
                id={'modal'}
                className={`absolute flex items-center gap-[1rem] px-[0.6rem] py-[0.8rem]
                            bg-control-gray-l0 rounded-smallest ${className} pointer-events-auto`}
            >
                <span className={classNameContent}>{children}</span>
                <Button
                    icon={'close'}
                    className={'place-self-start min-w-[0.55rem] inline-block'}
                    onClick={() => handleClose()}
                />
            </span>
        );
    } else {
        return (
            <div
                id={'modal'}
                className={`p-[--p-small] rounded-small border-small border-control-white-d0 bg-control-gray
                            place-self-center mx-auto ${className} pointer-events-auto`}>
                <div className={`flex items-center justify-between font-oxygen`}>
                    <h2 className={'text-inherit font-oxygen text-header font-bold'}>
                        {title ?? ''}
                    </h2>
                    <Button icon={'close'} onClick={() => handleClose()}/>
                </div>
                <hr className={'scale-[105%] mt-[1.25rem] mb-[1.55rem]'}/>
                <div className={classNameContent}>{children}</div>
            </div>
        )
    }
}

export {BaseModal}