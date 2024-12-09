import {FC} from "react";
import Image from "next/image";

import {BaseModal} from "@/app/components/modals";

import SVG_DECLINED from '@/assets/images/declined.svg';

const DeclinedModal: FC = () => (
    <BaseModal
        isSimple
        title={'Payment Declined'}
        className={`max-w-[19.3125rem] border-control5 [&_hr]:border-control5 right-[--py] bottom-[7.19rem]`}
        classNameContent={'flex px-[1rem] gap-[0.69rem]'}
    >
        <Image src={SVG_DECLINED} alt={'declined'} className={'size-[1.6875rem] mb-[1.76rem]'}/>
        <span>
            There was an issue processing your payment. Please review your card and billing information, or try an
            alternative payment method to confirm your subscription.
        </span>
    </BaseModal>
);

export {DeclinedModal};