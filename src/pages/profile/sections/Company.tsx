import React, { FC } from 'react';
import cn from 'classnames';

import { FormInit, FormType } from '@/app/ui/form/Editable';

import { UserData, useUser } from '@/app/context/User.context';

import { INDUSTRY, JOB_FUNCTION, SUB_INDUSTRY } from '@/app/static';

import { Collapsible } from '@/app/ui/misc';
import { Editable } from '@/app/ui/form';
import { getSimpleToggleProps, SectionProps } from '@/pages/profile/index.page';

import styles from '@/pages/profile/Profile.module.css';

const COMPANY = 'Company or Organization';

const CompanySection: FC<SectionProps> = (props: SectionProps) => {
    const { update, setEditId, editId } = props;

    const { userData } = useUser();

    if (!userData) return null;

    // @ts-expect-error wrong sub-industry key
    const subIndustry = SUB_INDUSTRY?.[userData.company.industry]?.[userData.company.subIndustry];

    return (
        <Collapsible
            title={COMPANY}
            icon={'building'}
            className={styles.collapsible}
        >
            <span className={styles.leftCol + ' ' + styles.ellipsis}>
                Organization<span className={'sm:hidden'}>al Information</span>
            </span>
            <Editable
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                        value: { value: userData.company?.name ?? '' } as FormInit<T>,
                        onSave: async (form) => {
                            if (!('value' in form) || !form.value) throw 'Incorrect request setup';
                            const newCompany: UserData['company'] = {
                                ...(userData.company ?? {
                                    jobTitle: '',
                                    jobFunction: '',
                                    subIndustry: '',
                                    industry: '',
                                }),
                                name: form.value,
                            };
                            await update({ company: newCompany });
                        },
                    };
                }}
            >
                <span>{userData.company?.name ?? '--'}</span>
            </Editable>

            <span className={styles.leftCol + ' ' + styles.ellipsis}>
                Career <span className={'sm:hidden'}>Information</span>
            </span>
            <Editable
                type={'company'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(
                            styles.singleInput,
                            styles.singleInputBase,
                            `px-[0.76rem] border-small`,
                            styles.roundedWFull,
                        ),
                        value: userData.company as FormInit<T>,
                        onSave: async (form) => {
                            if (!('industry' in form)) throw 'Incorrect request setup';
                            const newCompany: UserData['company'] = {
                                ...form,
                                name: userData.company?.name ?? '',
                            };
                            await update({ company: newCompany });
                        },
                    };
                }}
            >
                {userData.company ? (
                    <div
                        className={cn(
                            'flex flex-col gap-y-[--p-content-xs]',
                            '[&>span]:x-[col-start-2,flex,flex-col,gap-y-[--p-content-5xs],text-basic]',
                            '[&>span>span]:text-section-xs',
                        )}
                    >
                        <span>
                            <span>Job Title</span>
                            <span>{userData.company.jobTitle ?? '--'}</span>
                        </span>
                        <span>
                            <span>Job Function</span>
                            <span>{JOB_FUNCTION[userData.company.jobFunction] ?? '--'}</span>
                        </span>
                        <span>
                            <span>Industry</span>
                            <span>{INDUSTRY[userData.company.industry] ?? '--'}</span>
                        </span>
                        <span>
                            <span>Sub-Industry</span>
                            <span>{subIndustry ?? '--'}</span>
                        </span>
                    </div>
                ) : (
                    <>--</>
                )}
            </Editable>
        </Collapsible>
    );
};

export { CompanySection, COMPANY };
