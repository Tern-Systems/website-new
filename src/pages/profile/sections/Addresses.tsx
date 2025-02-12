import React, { FC, ReactElement } from 'react';
import cn from 'classnames';

import { FormInit, FormType } from '@/app/ui/form/Editable';

import { COUNTRY, STATE_PROVINCE } from '@/app/static';

import { UserData, useUser } from '@/app/context/User.context';

import { PrimaryLabel } from '@/app/ui/atoms';
import { Collapsible } from '@/app/ui/misc';
import { Editable } from '@/app/ui/form';
import { getSimpleToggleProps, SectionProps } from '../index.page';

import styles from '@/pages/profile/Profile.module.css';

const ADDRESSES = 'Addresses';

const AddressesSection: FC<SectionProps> = (props: SectionProps) => {
    const { update, setEditId, editId } = props;
    const { userData } = useUser();

    if (!userData) return null;

    const Addresses: (ReactElement | null)[] = Object.entries(userData.address)
        .filter((address) => address[1]?.country)
        .map(([type, address], idx) => {
            if (!address) return null;
            const state = address ? STATE_PROVINCE[address.country]?.[address.state] : '';
            const addressInfo: ReactElement | null = (
                <>
                    <span className={'flex w-full flex-col'}>
                        <span>{address.line1}</span>
                        <span>{address.line2}</span>
                        <span>
                            {address.city} {state} {address.zip}
                        </span>
                        <span>{COUNTRY[address.country]}</span>
                    </span>
                    {address.isPrimary ? <PrimaryLabel /> : null}
                </>
            );

            return (
                <span
                    key={type + idx}
                    className={'col-start-2'}
                >
                    <span className={'mb-[0.2rem] mt-[0.76rem] block text-section-xs capitalize'}>
                        {type.slice(0, 'Address'.length + 1)} Address
                    </span>
                    {addressInfo}
                </span>
            );
        });

    return (
        <Collapsible
            title={ADDRESSES}
            icon={'geo'}
            className={'[&]:items-start'}
        >
            <span className={styles.leftCol + ' ' + styles.ellipsis}>
                Address <span className={'sm:hidden'}>Information</span>
            </span>
            <Editable
                type={'address'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(styles.singleInputBase, styles.common, styles.roundedWFull),
                        value: userData.address as FormInit<T>,
                        onSave: async (formData) => {
                            if (!('personalAddress' in formData)) throw 'Incorrect request setup';
                            const newAddress: UserData['address'] = { ...userData.address, ...formData };
                            await update({ address: newAddress });
                        },
                    };
                }}
            >
                <span>{Addresses}</span>
            </Editable>
        </Collapsible>
    );
};

export { AddressesSection, ADDRESSES };
