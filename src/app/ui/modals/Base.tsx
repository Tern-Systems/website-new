'use client';

import { Dispatch, FC, HTMLAttributes, SetStateAction } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { useBreakpointCheck, useModal } from '@/app/hooks';

import { Button } from '@/app/ui/form';

import { Insignia } from '@/app/ui/organisms';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface ModalConfig extends HTMLAttributes<HTMLDivElement> {
    simple?: boolean | Breakpoint;
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
        simple,
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
        ...divProps
    } = props;

    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();
    const adapt: boolean = adaptBreakpoint !== undefined ? breakpoint <= adaptBreakpoint : false;

    const adaptApplied = adapt || adaptedDefault;

    const handleClose = () => {
        onClose?.();
        if (!preventClose) modalCtx.closeModal();
    };

    const simpleFinal = simple !== undefined && (typeof simple === 'boolean' ? simple : simple > breakpoint);

    if (simpleFinal) {
        return (
            <div
                {...divProps}
                id={'modal'}
                onClick={(event) => event.stopPropagation()}
                onMouseEnter={() => setHoverState?.(true)}
                onMouseLeave={() => setHoverState?.(false)}
                className={cn(
                    `pointer-events-auto absolute flex items-center gap-xxs px-4xs py-3xs`,
                    adaptApplied ? 'h-dvh w-dvw bg-white-d0 text-gray' : 'rounded-xs bg-gray-l0',
                    className,
                )}
            >
                <div className={'w-full ' + classNameContent}>{children}</div>
                <Button
                    icon={faX}
                    onClick={() => handleClose()}
                    className={cn(
                        `inline-block min-w-8xs place-self-start`,
                        { ['ml-auto size-4xs [&_path]:fill-blue']: adaptApplied },
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
                {...divProps}
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
                        classNameIcon={cn('sm:w-7xs', {
                            ['[&_path]:fill-blue w-4xs']: adaptApplied,
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
