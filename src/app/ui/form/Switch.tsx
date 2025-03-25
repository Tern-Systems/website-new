'use client';

import { FC } from 'react';
import cn from 'classnames';

interface Props {
    handleSwitch: () => void;
    state: boolean;
    className?: string;
    classNameSwitchText?: string;
}

const Switch: FC<Props> = (props: Props) => {
    const { handleSwitch, state, className, classNameSwitchText } = props;
    return (
        <div
            className={`flex cursor-pointer items-center gap-x-4xs-2 ${className}`}
            onClick={() => handleSwitch()}
        >
            <div className={`w-h-button-n flex h-[min(2.4dvw,0.8rem)] rounded-full border-s border-gray-l0 text-20`}>
                <div
                    className={cn(
                        `h-full w-1/2 cursor-pointer rounded-full border-s border-gray-l0 bg-white font-bold capitalize`,
                        { ['ml-auto [&]:bg-green-d0']: state },
                    )}
                />
            </div>
            <span className={`sm:hidden  ${classNameSwitchText}`}>{state ? 'On' : 'Off'}</span>
        </div>
    );
};

Switch.displayName = Switch.name;

export { Switch };
