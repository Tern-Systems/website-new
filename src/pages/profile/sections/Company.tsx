import React, { FC } from 'react';
import cn from 'classnames';

import { FormInit, FormType } from '@/app/ui/form/Editable';

import { UserData, useUser } from '@/app/context/User.context';
import { Breakpoint, useBreakpointCheck } from '@/app/hooks/useBreakpointCheck';

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

    const isSm = [Breakpoint.sm, Breakpoint.xs, Breakpoint.xxs, Breakpoint.x3s].includes(useBreakpointCheck());
    const isMd = useBreakpointCheck() === Breakpoint.md;

    // @ts-expect-error wrong sub-industry key
    const subIndustry = SUB_INDUSTRY?.[userData.company.industry]?.[userData.company.subIndustry];

    const title_CN = `[&&]:text-section-xs  [&&]:md:text-heading-s  [&&]:lg:text-heading-s`;
    const label_CN = `align-bottom [&&]:text-section-xxs  [&&]:md:text-basic  [&&]:lg:text-basic`;

    return (
        <Collapsible
            title={COMPANY}
            icon={'building'}
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            classNameWrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-section-s  md:text-heading  lg:text-heading`}
            classNameTitleIcon={`[&]:max-w-[1rem]  [&]:md:max-w-[1.8125rem]  [&]:lg:max-w-[1.8125rem]`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                Organization<span className={isSm || isMd ? 'hidden' : ''}>al Information</span>
            </span>
            <Editable
                classNameText={`text-section-xs`}
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
                <span className={label_CN}>{userData.company?.name ?? '--'}</span>
            </Editable>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                Career <span className={isSm || isMd ? 'hidden' : ''}>Information</span>
            </span>
            <Editable
                type={'company'}
                classNameText={`text-section-xs`}
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
                            'flex flex-col gap-y-4xs md:gap-y-xs lg:gap-y-xs',
                            '[&>span]:x-[col-start-2,flex,flex-col,gap-y-[--p-content-5xs],text-basic]',
                            'leading-tight [&>span>span]:text-section-xs',
                        )}
                    >
                        <span>
                            <span className={`${label_CN}`}>Job Title</span>
                            <span className={`${label_CN}`}>{userData.company.jobTitle ?? '--'}</span>
                        </span>
                        <span>
                            <span className={label_CN}>Job Function</span>
                            <span className={label_CN}>{JOB_FUNCTION[userData.company.jobFunction] ?? '--'}</span>
                        </span>
                        <span>
                            <span className={label_CN}>Industry</span>
                            <span className={label_CN}>{INDUSTRY[userData.company.industry] ?? '--'}</span>
                        </span>
                        <span>
                            <span className={label_CN}>Sub-Industry</span>
                            <span className={label_CN}>{subIndustry ?? '--'}</span>
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
