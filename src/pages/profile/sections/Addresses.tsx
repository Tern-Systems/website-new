'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { UserData } from '@/app/contexts/user.context';
import { FormInit, FormType } from '@/app/ui/form/Editable';
import { SectionProps } from '../index.page';

import { COUNTRY, STATE_PROVINCE } from '@/app/static';

import { getId } from '@/app/utils';
import { useBreakpointCheck, useUser } from '@/app/hooks';
import { getSimpleToggleProps } from '../getSimpleToggleProps';

import { PrimaryLabel } from '@/app/ui/atoms';
import { Collapsible } from '@/app/ui/organisms';
import { Editable } from '@/app/ui/form';

import styles from '@/pages/profile/Profile.module.css';

const ADDRESSES = 'Addresses';

function AddressesSection(props: SectionProps) {
    const { update, setEditId, editId } = props;
    const { userData } = useUser();
    const breakpoint = useBreakpointCheck();

    if (!userData) return null;

    const title_CN = `[&&]:text-14  [&&]:md:text-21  [&&]:lg:text-21`;
    const label_CN = `align-bottom [&&]:text-12  [&&]:md:text-16  [&&]:lg:text-16`;

    const Addresses: (ReactElement | null)[] = Object.entries(userData.address)
        .filter((address) => address[1]?.country)
        .map(([type, address], idx) => {
            if (!address) return null;
            const state = address ? STATE_PROVINCE[address.country]?.[address.state] : '';
            const addressInfo: ReactElement | null = (
                <>
                    <span className={'flex w-full flex-col leading-tight'}>
                        <span className={label_CN}>{address.line1}</span>
                        <span className={label_CN}>{address.line2}</span>
                        <span className={label_CN}>
                            {address.city} {state} {address.zip}
                        </span>
                        <span className={label_CN}>{COUNTRY[address.country]}</span>
                    </span>
                    {address.isPrimary ? (
                        <span className={`mt-5xs flex justify-items-start`}>
                            &nbsp;
                            <PrimaryLabel />
                            &nbsp;
                        </span>
                    ) : null}
                </>
            );

            return (
                <span
                    key={type + idx}
                    className={`col-start-2`}
                >
                    <span
                        className={cn(
                            `mb-5xs ${idx !== 0 && 'mt-3xs md:mt-xs lg:mt-xs'} block text-10 capitalize`,
                            `md:x-[mb-[0.5rem],text-14]`,
                            `lg:x-[mb-[0.5rem],text-14]`,
                        )}
                    >
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
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            classNameWrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-18  md:text-27  lg:text-27`}
            classNameTitleIcon={`[&]:max-w-[1rem]  [&]:md:max-w-[1.8125rem]  [&]:lg:max-w-[1.8125rem]`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                Address&nbsp;
                <span className={cn({ ['hidden']: breakpoint <= Breakpoint.sm || breakpoint === Breakpoint.md })}>
                    Information
                </span>
            </span>
            <Editable
                type={'address'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(
                            styles.singleInputBase,
                            styles.common,
                            styles.roundedWFull,
                            `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                        ),
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
}

AddressesSection.ID = getId(ADDRESSES);

export { AddressesSection };
