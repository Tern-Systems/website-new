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
            className={`flex cursor-pointer items-center gap-x-[0.4rem] ${className}`}
            onClick={() => handleSwitch()}
        >
            <div
                className={`w-h-button-n flex h-[min(2.4dvw,0.8rem)] rounded-full border-[0.1rem] border-gray-l0 text-section`}
            >
                <div
                    className={cn(
                        `h-full w-1/2 cursor-pointer rounded-full border-s border-gray-l0 bg-white font-bold capitalize`,
                        { ['ml-auto [&]:bg-[#23af7a]']: state },
                    )}
                />
            </div>
            <span className={`sm:hidden  ${classNameSwitchText}`}>{state ? 'On' : 'Off'}</span>
        </div>
    );
};

export { Switch };
