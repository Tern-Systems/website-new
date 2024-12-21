import {FC} from "react";

import {ARCode} from "@/app/types/arcode";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";


interface Props {
    adCode: ARCode;
}

const DeleteModal: FC<Props> = (props: Props) => {
    const {adCode} = props;

    const modalCtx = useModal();

    const handleDelete = async () => {
        // TOOD
        modalCtx.closeModal();
    }

    return (
        <BaseModal
            title={'Delete AR Code?'}
            className={'text-center w-[30.31rem]'}
            classNameContent={'flex flex-col w-[19.65rem] items-center mx-auto'}
        >
            <p>Are you sure you want to proceed with this action?</p>
            <p> This will delete <span className={'font-bold'}>{adCode.name}</span>. </p>
            <span className={'flex gap-[0.62rem] font-bold mt-[1.56rem] text-small'}>
                <Button
                    className={'text-red border-control-blue border-small px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => handleDelete()}
                >
                    Delete
                </Button>
                <Button
                    className={'bg-control-gray-l0 px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => modalCtx.closeModal()}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {DeleteModal}