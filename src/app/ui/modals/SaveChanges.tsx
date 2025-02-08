import React, {FC} from "react";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";


const BTN_CN = 'h-[--h-control] px-xxs rounded-full';


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
            className={`w-[min(90dvw,30rem)] border-white border-s text-center sm:landscape:w-[50dvw]`}
        >
            <span>Do you want to save your changes before returning to the previous page?</span>
            <span className={'flex mt-xs gap-[min(1.1dvw,0.625rem)] text-section font-bold justify-center'}>
                <Button
                    className={`bg-white text-gray ${BTN_CN}`}
                    onClick={() => onSave()}
                >
                    Save
                </Button>
                <Button
                    className={`border-s border-gray-l1 text-primary ${BTN_CN}`}
                    onClick={() => {
                        onDontSave?.();
                        modalCtx.closeModal();
                    }}
                >
                    Don&apos;t Save
                </Button>
                <Button
                    className={`bg-gray-l0 ${BTN_CN}`}
                    onClick={() => modalCtx.closeModal()}>
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {SaveChangesModal}