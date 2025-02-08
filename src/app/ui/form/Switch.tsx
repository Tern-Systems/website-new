import {FC} from "react";

import {Breakpoint} from "@/app/hooks/useBreakpointCheck";

import {useBreakpointCheck} from "@/app/hooks";


interface Props {
    handleSwitch: () => void;
    state: boolean;
    className?: string;
}

const Switch: FC<Props> = (props: Props) => {
    const {handleSwitch, state, className} = props;
    const isSmScreen = useBreakpointCheck()<= Breakpoint.sm;

    return (
        <div
            className={`flex gap-x-[0.4rem] items-center cursor-pointer ${className}`}
            onClick={() => handleSwitch()}
        >
            <div
                className={`flex border-[0.1rem] rounded-full text-section border-gray-l0
                            w-[--h-control] h-[min(2.4dvw,0.8rem)]`}
            >
                <div
                    className={`w-1/2 h-full rounded-full cursor-pointer font-bold capitalize bg-white border-s border-gray-l0 
                            ${state ? 'ml-auto [&]:bg-[#23af7a]' : ''}`}
                />
            </div>
            <span className={isSmScreen ? 'hidden' : ''}>{state ? 'On' : 'Off'}</span>
        </div>
    );
};


export {Switch};
