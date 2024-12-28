import React, {FC, PropsWithChildren} from "react"

import {useModal} from "@/app/context"

import {Button} from "@/app/ui/form";
import {useBreakpointCheck} from "@/app/hooks";
import {Insignia} from "@/app/ui/misc";


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

    const isSmRulesApplied = isSmScreen && adaptSmScreen;

    const handleClose = () => {
        modalCtx.closeModal();
        onClose?.();
    }

    if (isSimple) {
        return (
            <div
                id={'modal'}
                className={`absolute flex items-center gap-[1rem] px-[0.6rem] py-[0.8rem]
                            ${isSmRulesApplied
                    ? 'bg-control-white-d0 text-gray w-dvw h-dvh'
                    : 'bg-control-gray-l0 rounded-smallest'} ${className} pointer-events-auto`}
            >
                <div className={'w-full ' + classNameContent}>{children}</div>
                <Button
                    icon={'close'}
                    onClick={() => handleClose()}
                    className={`place-self-start min-w-[0.55rem] inline-block ${isSmRulesApplied ? '[&_path]:fill-blue ml-auto [&_*]:size-[1.125rem]' : ''}`}
                />
            </div>
        );
    } else {
        const Heading = title
            ? (
                <h2 className={`text-inherit font-oxygen text-header font-bold ${isSmRulesApplied ? 'mb-[1.87rem]' : ''} ${classNameTitle}`}>
                    {title ?? ''}
                </h2>
            )
            : null;
        return (
            <div
                id={'modal'}
                className={`${isSmRulesApplied
                    ? 'bg-control-white-d0 text-gray w-dvw h-dvh z-50'
                    : 'place-self-center mx-auto bg-control-gray rounded-small border-small border-control-white-d0 p-[--2dr]'}
                            ${className} pointer-events-auto`}>
                <div
                    className={`relative flex justify-between font-oxygen ${isSmRulesApplied ? 'h-[4.3rem] p-[1.25rem]' : ''}`}>
                    {isSmRulesApplied ? null : Heading}
                    {isSmRulesApplied
                        ? <Insignia className={'origin-top-left scale-[--insignia-scale-moved] top-[0.85rem] left-[0.85rem]'}/>
                        : null}
                    <Button
                        icon={'close'}
                        onClick={() => handleClose()}
                        className={isSmRulesApplied ? '[&_path]:fill-blue ml-auto [&_*]:size-[1.125rem]' : ''}
                    />
                </div>
                <hr className={`${isSmRulesApplied ? '' : 'mt-[--1qdrs] scale-[105%] mb-[--s-normal]'}`}/>
                <div className={classNameContent}>
                    {isSmRulesApplied ? Heading : null}
                    {children}
                </div>
            </div>
        );
    }
}

export {BaseModal}