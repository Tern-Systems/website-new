import {FC} from "react";

interface Props {
    handleSwitch: () => void;
    state: boolean;
}

const Switch: FC<Props> = (props: Props) => {
    const {handleSwitch, state} = props;

    return (
        <div
            className={'flex gap-x-[0.39rem] items-center cursor-pointer'}
            onClick={() => handleSwitch()}
        >
            <div
                className={`flex border-[0.1rem] rounded-full text-small border-control5
                            w-[1.44rem] h-[0.81rem]`}
            >
                <div
                    className={`w-1/2 h-full rounded-full cursor-pointer font-bold capitalize bg-white border-small border-control5 
                            ${state ? 'ml-auto bg-[#23af7a]' : ''}`}
                />
            </div>
            <span className={'leading-none'}>{state ? 'On' : 'Off'}</span>
        </div>
    );
};

export {Switch}