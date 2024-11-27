import {FC} from "react";
import {BaseModal} from "@/app/components/modals/Base";
import Image from "next/image";

import SVG_DECLINED from '@/assets/images/declined.svg';

interface Props {
    onClose: () => void;
}

const DeclinedModal: FC<Props> = (props: Props) => {
    const {onClose} = props;

    return (
        <BaseModal
            title={'Payment Declined'}
            isSmall={false}
            className={`[&]:bg-control4 max-w-[30.125rem] border-control5 [&_hr]:border-control5
                    [&_h2]:text-form [&_button]:brightness-50`}
            classNameContent={'flex flex-col items-center text-center px-[1rem]'}
            onClose={onClose}
        >
            <Image src={SVG_DECLINED} alt={'declined'} className={'size-[9.9rem] mb-[1.76rem]'}/>
            <span className={'text-form'}>
                There was an issue processing your payment. Please review your card and billing information, or try an
                alternative payment method to confirm your subscription.
            </span>
        </BaseModal>
    );
}

export {DeclinedModal};