import { FC } from 'react';
import cn from 'classnames';


interface Props {
    handleSwitch: () => void;
    state: boolean;
    className?: string;
}

const Switch: FC<Props> = (props: Props) => {
    const { handleSwitch, state, className } = props;
    return (
        <div
            className={`flex gap-x-[0.4rem] items-center cursor-pointer ${className}`}
            onClick={() => handleSwitch()}
        >
            <div
                className={`flex border-[0.1rem] rounded-full text-section border-gray-l0
                            w-h-button-n h-[min(2.4dvw,0.8rem)]`}
            >
                <div
                    className={cn(
                        `w-1/2 h-full rounded-full cursor-pointer font-bold capitalize bg-white border-s border-gray-l0`,
                        { ['ml-auto [&]:bg-[#23af7a]']: state },
                    )}
                />
            </div>
            <span className={'sm:hidden'}>{state ? 'On' : 'Off'}</span>
        </div>
    );
};


export { Switch };
