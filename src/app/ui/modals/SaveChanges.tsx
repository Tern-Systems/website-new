import React, {FC} from "react";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";


const BTN_CN = 'h-[min(4.3dvw,1.45rem)] px-[min(2.4dvw,1rem)] rounded-full';


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
            className={'w-[min(90dvw,30rem)] border-control-white border-small text-center'}
        >
            <span>Do you want to save your changes before returning to the previous page?</span>
            <span className={'flex mt-[min(2.6dvw,1.25rem)] gap-[min(1.1dvw,0.625rem)] text-small font-bold justify-center'}>
                <Button
                    className={`bg-control-white text-gray ${BTN_CN}`}
                    onClick={() => onSave()}
                >
                    Save
                </Button>
                <Button
                    className={`border-small border-control-gray-l1 text-primary ${BTN_CN}`}
                    onClick={() => {
                        onDontSave?.();
                        modalCtx.closeModal();
                    }}
                >
                    Don&apos;t Save
                </Button>
                <Button
                    className={`bg-control-gray-l0 ${BTN_CN}`}
                    onClick={() => modalCtx.closeModal()}>
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {SaveChangesModal}