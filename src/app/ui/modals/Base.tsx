import {FC, PropsWithChildren} from "react"

import {useModal} from "@/app/context"

import {Button} from "@/app/ui/form";
import {useBreakpointCheck} from "@/app/hooks";


interface ModalConfig extends PropsWithChildren {
    isSimple?: boolean;
    title?: string;
    onClose?: () => void;
    className?: string;
    classNameContent?: string;
    classNameTitle?: string;
    adaptSmScreen?: boolean;
}

const BaseModal: FC<ModalConfig> = (props: ModalConfig) => {
    const {
        children, isSimple, title, onClose,
        className, classNameContent, classNameTitle, adaptSmScreen
    } = props;

    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();

    const isSmRullesApplied = isSmScreen && adaptSmScreen;

    const handleClose = () => {
        modalCtx.closeModal();
        onClose?.();
    }

    if (isSimple) {
        return (
            <div
                id={'modal'}
                className={`absolute flex items-center gap-[1rem] px-[0.6rem] py-[0.8rem]
                            ${isSmRullesApplied
                    ? 'bg-control-white-d0 text-gray w-dvw h-dvh'
                    : 'bg-control-gray-l0 rounded-smallest'} ${className} pointer-events-auto`}
            >
                <div className={'w-full ' + classNameContent}>{children}</div>
                <Button
                    icon={'close'}
                    onClick={() => handleClose()}
                    className={`place-self-start min-w-[0.55rem] inline-block ${isSmRullesApplied ? '[&_path]:fill-blue ml-auto [&_*]:size-[1.125rem]' : ''}`}
                />
            </div>
        );
    } else {
        const Heading = title
            ? (
                <h2 className={`text-inherit font-oxygen text-header font-bold ${isSmRullesApplied ? 'mb-[1.87rem]' : ''} ${classNameTitle}`}>
                    {title ?? ''}
                </h2>
            )
            : null;
        return (
            <div
                id={'modal'}
                className={`${isSmRullesApplied
                    ? 'bg-control-white-d0 text-gray w-dvw h-dvh'
                    : 'place-self-center mx-auto bg-control-gray rounded-small border-small border-control-white-d0 p-[--p-small]'}
                            ${className} pointer-events-auto`}>
                <div
                    className={`flex items-center justify-between font-oxygen ${isSmRullesApplied ? 'h-[4.3rem] p-[1.25rem]' : ''}`}>
                    {isSmRullesApplied ? null : Heading}
                    <Button
                        icon={'close'}
                        onClick={() => handleClose()}
                        className={isSmRullesApplied ? '[&_path]:fill-blue ml-auto [&_*]:size-[1.125rem]' : ''}
                    />
                </div>
                <hr className={`${isSmRullesApplied ? '' : 'mt-[1.25rem] scale-[105%] mb-[1.55rem]'}`}/>
                <div className={classNameContent}>
                    {isSmRullesApplied ? Heading : null}
                    {children}
                </div>
            </div>
        );
    }
}

export {BaseModal}