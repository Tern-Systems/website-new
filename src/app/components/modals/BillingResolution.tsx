import {BaseModal} from "@/app/components/modals/Base";
import {FC} from "react";

const BillingModal: FC = () => (
    <BaseModal title={'Billing Resolution Center'}>
        <div className={'flex flex-col items-center w-[26.31rem]'}>
                    <span className={'mb-[1.22rem]'}>
                        Email: <a href={'mailto:brc@tern.ac'} target={'_blank'}>brc@tern.ac</a>
                    </span>
            <span>
                        Phone: <a href={'tel:19143065528'} target={'_blank'}>+1 (914) 306-5528</a>
                    </span>
        </div>
    </BaseModal>
);

export {BillingModal}