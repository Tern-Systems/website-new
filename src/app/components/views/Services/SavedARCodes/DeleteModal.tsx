import {FC} from "react";

import {ARCode} from "@/app/components/views/Services/SavedARCodes/CodeMenu";

import {BaseModal} from "@/app/components/modals/Base";
import {Button} from "@/app/components/form/Button";
import {useModal} from "@/app/context/Modal.context";

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
            <span>Are you sure you want to proceed with this action?</span>
            <span className={'mt-[1.56rem]'}>
                This will delete <span className={'font-bold'}>{adCode.name}</span>.
            </span>
            <span className={'flex gap-[0.62rem] font-bold mt-[1.56rem] text-[0.875rem]'}>
                <Button
                    className={'text-[#F42200] border-[#F42200] border-small px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => handleDelete()}
                >
                    Delete
                </Button>
                <Button
                    className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => modalCtx.closeModal()}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {DeleteModal}