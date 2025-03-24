'use client';

import { FC } from 'react';

import { BaseModal } from '@/app/ui/modals';

type Type = 'brc' | 'support';
export type { Type as HelpType };

const Contacts: Record<Type, { title: string; email: string; phone: string }> = {
    brc: { title: 'Billing Resolution Center', email: 'brc@tern.ac', phone: '+1 (914) 306-5528' },
    support: { title: 'Support Hub', email: 'support@tern.ac', phone: '+1 (914) 295-9337' },
};

interface Props {
    type: Type;
}

const HelpModal: FC<Props> = (props: Props) => {
    const { type } = props;
    return (
        <BaseModal
            title={Contacts[type].title}
            classNameTitle={'sm:landscape:text-heading-s'}
            classNameContent={'w-[min(80dvw,26rem)] sm:landscape:w-[min(40dvw,20rem)]'}
            className={'sm:landscape:p-xxs'}
        >
            <div className={`flex flex-col items-center text-section-s sm:landscape:text-section`}>
                <span className={'mb-xs sm:landscape:mb-xxs'}>
                    Email:&nbsp;
                    <a
                        href={`mailto:${Contacts[type].email}`}
                        target={'_blank'}
                    >
                        {Contacts[type].email}
                    </a>
                </span>
                <span>
                    Phone:&nbsp;
                    <a
                        href={`tel:${Contacts[type].phone}`}
                        target={'_blank'}
                    >
                        {Contacts[type].phone}
                    </a>
                </span>
            </div>
        </BaseModal>
    );
};

HelpModal.displayName = HelpModal.name;

export { HelpModal };
