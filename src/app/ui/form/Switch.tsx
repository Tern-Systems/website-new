import {FC} from "react";


interface Props {
    handleSwitch: () => void;
    state: boolean;
}

const Switch: FC<Props> = (props: Props) => {
    const {handleSwitch, state} = props;

    return (
        <div
            className={'flex gap-x-[0.4rem] items-center cursor-pointer'}
            onClick={() => handleSwitch()}
        >
            <div
                className={`flex border-[0.1rem] rounded-full text-small border-control-gray-l0
                            w-[1.45rem] h-[0.8rem]`}
            >
                <div
                    className={`w-1/2 h-full rounded-full cursor-pointer font-bold capitalize bg-white border-small border-control-gray-l0 
                            ${state ? 'ml-auto bg-[#23af7a]' : ''}`}
                />
            </div>
            <span>{state ? 'On' : 'Off'}</span>
        </div>
    );
};

export {Switch}