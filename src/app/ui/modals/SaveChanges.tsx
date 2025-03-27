'use client';

import { FC } from 'react';

import { useModal } from '@/app/hooks';

import { BaseModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';

const BTN_CN = 'h-button-n px-xxs rounded-full';

interface Props {
    onSave: () => Promise<void>;
    onDontSave: () => void;
    onCancel: () => void;
}

const SaveChangesModal: FC<Props> = (props: Props) => {
    const { onSave, onDontSave, onCancel } = props;

    const modalCtx = useModal();

    return (
        <BaseModal
            title={'Save Changes?'}
            onClose={() => onCancel()}
            className={`w-[min(90dvw,30rem)] border-s border-white text-center sm:landscape:w-[50dvw]`}
        >
            <span>Do you want to save your changes before returning to the previous page?</span>
            <span className={'mt-xs flex justify-center gap-[min(1.1dvw,0.625rem)] text-16 font-bold'}>
                <Button
                    className={`bg-white text-gray ${BTN_CN}`}
                    onClick={async () => {
                        await onSave();
                        modalCtx.closeModal();
                    }}
                >
                    Save
                </Button>
                <Button
                    className={`border-s border-gray-l1 text-primary ${BTN_CN}`}
                    onClick={() => {
                        onDontSave();
                        modalCtx.closeModal();
                    }}
                >
                    Don&apos;t Save
                </Button>
                <Button
                    className={`bg-gray-l0 ${BTN_CN}`}
                    onClick={() => {
                        onCancel();
                        modalCtx.closeModal();
                    }}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    );
};

SaveChangesModal.displayName = SaveChangesModal.name;

export { SaveChangesModal };
