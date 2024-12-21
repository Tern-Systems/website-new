import {FC} from "react";

import {BaseModal} from "@/app/ui/modals";


type Type = 'brc' | 'support';

const Contacts: Record<Type, { title: string; email: string; phone: string }> = {
    brc: {title: 'Billing Resolution Center', email: 'brc@tern.ac', phone: '+1 (914) 306-5528'},
    support: {title: 'Support Hub', email: 'support@tern.ac', phone: '+1 (914) 295-9337'},
}

interface Props {
    type: Type
}

const HelpModal: FC<Props> = (props: Props) => {
    const {type} = props;
    return (
        <BaseModal title={Contacts[type].title}>
            <div className={'flex flex-col items-center w-[26rem] text-content-small'}>
                <span className={'mb-[1.25rem]'}>
                    Email: <a href={`mailto:${Contacts[type].email}`} target={'_blank'}>{Contacts[type].email}</a>
                </span>
                <span>
                    Phone: <a href={`tel:${Contacts[type].phone}`} target={'_blank'}>{Contacts[type].phone}</a>
                </span>
            </div>
        </BaseModal>
    );
}

export {HelpModal}