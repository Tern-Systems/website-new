import React, {FC} from "react";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";


interface Props {
    onSave: () => Promise<void>;
    onDontSave?: () => Promise<void>;
}

const SaveChangesModal: FC<Props> = (props: Props) => {
    const {onSave, onDontSave} = props;

    const modalCtx = useModal();

    return (
        <BaseModal
            title={'Save Changes?'}
            className={'w-[30rem] bottom-[7rem] right-[--p-small] border-control-white border-small text-center'}
        >
            <span>Do you want to save your changes before returning to the previous page?</span>
            <span className={'flex mt-[1.25rem] gap-[0.625rem] text-small font-bold justify-center'}>
                <Button
                    className={'px-[1rem] bg-white text-gray rounded-full h-[1.45rem]'}
                    onClick={() => onSave()}
                >
                    Save
                </Button>
                <Button
                    className={'px-[1rem] border-small border-control-grayL1 rounded-full h-[1.45rem] text-white'}
                    onClick={() => {
                        onDontSave?.();
                        modalCtx.closeModal();
                    }}
                >
                    Don&apos;t Save
                </Button>
                <Button
                    className={'px-[1rem] rounded-full h-[1.45rem] bg-control-gray-l0'}
                    onClick={() => modalCtx.closeModal()}>
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {SaveChangesModal}