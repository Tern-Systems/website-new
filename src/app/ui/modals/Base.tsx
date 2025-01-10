import React, {FC, PropsWithChildren} from "react"
import cn from "classnames";


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
    classNameHr?: string;
    adaptSmScreen?: boolean;
    smScreenOnly?: boolean;
}

const BaseModal: FC<ModalConfig> = (props: ModalConfig) => {
    const {
        children, isSimple, title, onClose,
        className, classNameContent, classNameTitle, classNameHr, adaptSmScreen, smScreenOnly
    } = props;

    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();

    const isSmRulesApplied = isSmScreen && adaptSmScreen || smScreenOnly;

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
                <h2 className={cn(`text-inherit font-oxygen text-header font-bold
                                    sm:landscape:text-content`, classNameTitle,
                    {['mb-[--p-content]']: isSmRulesApplied})}
                >
                    {title}
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
                    className={cn(`relative flex justify-between font-oxygen`, {['h-[--h-modal-header] p-[1.25rem]']: isSmRulesApplied})}>
                    {isSmRulesApplied ? null : Heading}
                    {isSmRulesApplied
                        ? <Insignia insigniaMoved className={'w-[--insignia-moved-size] h-auto'}/>
                        : null}
                    <Button
                        icon={'close'}
                        onClick={() => handleClose()}
                        classNameIcon={cn({['[&_path]:fill-blue [&_*]:w-[1.125rem]']: isSmRulesApplied})}
                    />
                </div>
                <hr className={cn(classNameHr, {['relative -left-[0.72rem] mt-[--1qdrs] w-[calc(100%+1.44rem)] mb-[--s-normal] sm:landscape:x-[scale-[102%],my-[--1drs]]']: !isSmRulesApplied})}/>
                <div className={classNameContent}>
                    {isSmRulesApplied ? Heading : null}
                    {children}
                </div>
            </div>
        );
    }
}

export {BaseModal}