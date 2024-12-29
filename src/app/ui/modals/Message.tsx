import {FC, PropsWithChildren} from "react";

import {BaseModal} from "@/app/ui/modals/Base";


const MessageModal: FC<PropsWithChildren> = (props: PropsWithChildren) => (
    <BaseModal
        isSimple
        className={'place-self-center mx-auto right-[--s-default] bottom-[7.2rem]'}
    >
        {props.children}
    </BaseModal>
);


export {MessageModal};