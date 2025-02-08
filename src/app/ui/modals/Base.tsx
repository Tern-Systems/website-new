import React, {Dispatch, FC, PropsWithChildren, SetStateAction} from "react"
import cn from "classnames";

import {Breakpoint} from "@/app/hooks/useBreakpointCheck";

import {useModal} from "@/app/context"

import {Button} from "@/app/ui/form";
import {useBreakpointCheck} from "@/app/hooks";

import {Insignia} from "@/app/ui/misc";


interface ModalConfig extends PropsWithChildren {
    isSimple?: boolean;
    title?: string;
    onClose?: () => void;
    setHoverState?: Dispatch<SetStateAction<boolean>>;
    preventClose?: boolean;
    className?: string;
    classNameContent?: string;
    classNameTitle?: string;
    classNameHr?: string;
    adaptSmScreen?: boolean;
    smScreenOnly?: boolean;
}

const BaseModal: FC<ModalConfig> = (props: ModalConfig) => {
    const {
        children, isSimple, title, onClose, setHoverState, preventClose,
        className, classNameContent, classNameTitle, classNameHr, adaptSmScreen, smScreenOnly
    } = props;

    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

    const isSmRulesApplied = isSmScreen && adaptSmScreen || smScreenOnly;

    const handleClose = () => {
        onClose?.();
        if (!preventClose)
            modalCtx.closeModal();
    }

    if (isSimple) {
        return (
            <div
                id={'modal'}
                onMouseEnter={() => setHoverState?.(true)}
                onMouseLeave={() => setHoverState?.(false)}
                onClick={() => modalCtx.closeModal()}
                className={cn(
                    `absolute flex items-center gap-[1rem] px-[0.6rem] py-[0.8rem] pointer-events-auto`,
                    isSmRulesApplied ? 'bg-white-d0 text-gray w-dvw h-dvh' : 'bg-gray-l0 rounded-xs',
                    className,
                )}
            >
                <div className={'w-full ' + classNameContent}>{children}</div>
                <Button
                    icon={'close'}
                    onClick={() => handleClose()}
                    className={cn(
                        `place-self-start min-w-[0.55rem] inline-block`,
                        {['[&_path]:fill-blue ml-auto [&_*]:size-[1.125rem]']: isSmRulesApplied},
                        classNameTitle
                    )}
                />
            </div>
        );
    } else {
        const Heading = title
            ? (
                <h2 className={cn(
                    `text-inherit font-oxygen text-heading font-bold`,
                    `sm:portrait:text-heading-s`,
                    `sm:landscape:text-section-s`,
                    classNameTitle,
                    {['mb-n']: isSmRulesApplied})}
                >
                    {title}
                </h2>
            )
            : null;
        return (
            <div
                id={'modal'}
                onClick={(event) => {
                    event.stopPropagation()
                }}
                className={cn(
                    `pointer-events-auto`,
                    isSmRulesApplied
                        ? 'bg-white-d0 text-gray w-dvw h-dvh z-50'
                        : cn(
                            'place-self-center mx-auto bg-gray rounded-s border-s border-white-d0',
                            'lg:p-l',
                            'md:p-s',
                            'sm:max-w-[calc(100%-2*var(--p-xs))] sm:p-xxs'
                        ),
                    className
                )}
            >
                <div
                    className={cn(`relative flex items-center justify-between font-oxygen`, {['h-heading-modal p-xs']: isSmRulesApplied})}>
                    {isSmRulesApplied ? <Insignia className={'[&_path]:fill-black'}/> : Heading}
                    <Button
                        icon={'close'}
                        onClick={() => handleClose()}
                        classNameIcon={cn(
                            'sm:[&_*]:w-[0.75rem]',
                            {['[&_path]:fill-blue [&_*]:w-[1.125rem]']: isSmRulesApplied}
                        )}
                    />
                </div>
                <hr className={cn(classNameHr, {
                    [cn(
                        'relative',
                        'mb-xs',
                        'lg:x-[-left-[0.72rem],mt-xs] lg:w-[calc(100%+1.44rem)]',
                        'md:x-[-left-4xs,mt-xxs] md:w-[calc(100%+2*var(--p-4xs))]',
                        'sm:x-[-left-5xs,mt-xxs] sm:w-[calc(100%+2*var(--p-5xs))]',
                    )]: !isSmRulesApplied
                })
                }/>
                <div className={cn(classNameContent, 'overflow-y-scroll h-[calc(100%-var(--h-heading))]')}>
                    {isSmRulesApplied ? Heading : null}
                    {children}
                </div>
            </div>
        );
    }
}

export {BaseModal}