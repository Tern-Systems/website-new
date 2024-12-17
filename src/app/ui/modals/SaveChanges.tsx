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
            className={'w-[30.72rem] bottom-[7.19rem] right-[--py] border-control4 border-small text-center'}
        >
            <span>Do you want to save your changes before returning to the previous page?</span>
            <span className={'flex mt-[1.25rem] gap-[0.62rem] text-[0.875rem] font-bold justify-center'}>
                <Button
                    className={'px-[1rem] bg-white text-form rounded-full h-[1.44rem]'}
                    onClick={() => onSave()}
                >
                    Save
                </Button>
                <Button
                    className={'px-[1rem] border-small border-control rounded-full h-[1.44rem] text-white'}
                    onClick={() => {
                        onDontSave?.();
                        modalCtx.closeModal();
                    }}
                >
                    Don&apos;t Save
                </Button>
                <Button
                    className={'px-[1rem] text-primary rounded-full h-[1.44rem] bg-control2'}
                    onClick={() => modalCtx.closeModal()}>
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {SaveChangesModal}