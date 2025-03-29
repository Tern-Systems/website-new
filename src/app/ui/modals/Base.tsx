'use client';

import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { useModal } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { useBreakpointCheck } from '@/app/hooks';

import { Insignia } from '@/app/ui/organisms';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface ModalConfig extends PropsWithChildren {
    isSimple?: boolean | Breakpoint;
    title?: string;
    onClose?: () => void;
    setHoverState?: Dispatch<SetStateAction<boolean>>;
    preventClose?: boolean;
    className?: string;
    classNameContent?: string;
    classNameTitle?: string;
    classNameHr?: string;
    adaptBreakpoint?: Breakpoint;
    adaptedDefault?: boolean;
}

const BaseModal: FC<ModalConfig> = (props: ModalConfig) => {
    const {
        children,
        isSimple,
        title,
        onClose,
        setHoverState,
        preventClose,
        className,
        classNameContent,
        classNameTitle,
        classNameHr,
        adaptBreakpoint,
        adaptedDefault,
    } = props;

    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();
    const adapt: boolean = adaptBreakpoint !== undefined ? breakpoint <= adaptBreakpoint : false;

    const adaptApplied = adapt || adaptedDefault;

    const handleClose = () => {
        onClose?.();
        if (!preventClose) modalCtx.closeModal();
    };

    const simple = isSimple !== undefined && (typeof isSimple === 'boolean' ? isSimple : isSimple > breakpoint);

    if (simple) {
        return (
            <div
                id={'modal'}
                onMouseEnter={() => setHoverState?.(true)}
                onMouseLeave={() => setHoverState?.(false)}
                onClick={() => modalCtx.closeModal()}
                className={cn(
                    `pointer-events-auto absolute flex items-center gap-[1rem] px-[0.6rem] py-[0.8rem]`,
                    adaptApplied ? 'h-dvh w-dvw bg-white-d0 text-gray' : 'rounded-xs bg-gray-l0',
                    className,
                )}
            >
                <div className={'w-full ' + classNameContent}>{children}</div>
                <Button
                    icon={faX}
                    onClick={() => handleClose()}
                    className={cn(
                        `inline-block min-w-[0.55rem] place-self-start`,
                        { ['ml-auto [&_*]:size-[1.125rem] [&_path]:fill-blue']: adaptApplied },
                        classNameTitle,
                    )}
                />
            </div>
        );
    } else {
        const Heading = title ? (
            <h2
                className={cn(
                    ` text-27 font-bold text-inherit`,
                    `sm:portrait:text-21`,
                    `sm:landscape:text-18`,
                    classNameTitle,
                    { ['mb-n']: adaptApplied },
                )}
            >
                {title}
            </h2>
        ) : null;
        return (
            <div
                id={'modal'}
                onClick={(event) => event.stopPropagation()}
                className={cn(
                    `pointer-events-auto`,
                    adaptApplied
                        ? 'z-50 h-dvh w-dvw bg-white-d0 text-gray'
                        : cn(
                              'mx-auto place-self-center rounded-s border-s border-white-d0 bg-gray',
                              'lg:p-l',
                              'md:p-s',
                              'sm:max-w-[calc(100%-2*var(--p-xs))] sm:p-xxs',
                          ),
                    className,
                )}
            >
                <div
                    className={cn(`relative flex items-center justify-between `, {
                        ['h-heading-modal p-xs']: adaptApplied,
                    })}
                >
                    {adaptApplied ? <Insignia className={'[&_path]:fill-black'} /> : Heading}
                    <Button
                        icon={faX}
                        onClick={() => handleClose()}
                        classNameIcon={cn('sm:[&_*]:w-[0.75rem]', {
                            ['[&_path]:fill-blue [&_*]:w-[1.125rem]']: adaptApplied,
                        })}
                    />
                </div>
                <hr
                    className={cn(classNameHr, {
                        [cn(
                            'relative',
                            'mb-xs',
                            'lg:w-[calc(100%+1.44rem)] lg:x-[-left-[0.72rem],mt-xs]',
                            'md:w-[calc(100%+2*var(--p-4xs))] md:x-[-left-4xs,mt-xxs]',
                            'sm:w-[calc(100%+2*var(--p-5xs))] sm:x-[-left-5xs,mt-xxs]',
                        )]: !adaptApplied,
                    })}
                />
                <div className={cn(classNameContent, 'h-[calc(100%-var(--h-heading))] overflow-y-scroll')}>
                    {adaptApplied ? Heading : null}
                    {children}
                </div>
            </div>
        );
    }
};

BaseModal.displayName = BaseModal.name;

export { BaseModal };
