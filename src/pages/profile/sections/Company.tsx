'use client';

import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { UserData } from '@/app/contexts/user.context';
import { FormInit, FormType } from '@/app/ui/form/Editable';
import { SectionProps } from '../index.page';
import { INDUSTRY, JOB_FUNCTION, SUB_INDUSTRY } from '@/app/static';

import { getId } from '@/app/utils';
import { getSimpleToggleProps } from '../getSimpleToggleProps';
import { useBreakpointCheck, useUser } from '@/app/hooks';

import { Collapsible } from '@/app/ui/organisms';
import { Editable } from '@/app/ui/form';

import styles from '@/pages/profile/Profile.module.css';

const COMPANY = 'Company or Organization';

function CompanySection(props: SectionProps) {
    const { update, setEditId, editId } = props;

    const { userData } = useUser();
    const breakpoint = useBreakpointCheck();

    if (!userData) return null;

    const sm = breakpoint <= Breakpoint.sm;
    const md = breakpoint === Breakpoint.md;

    // @ts-expect-error wrong sub-industry key
    const subIndustry = SUB_INDUSTRY?.[userData.company.industry]?.[userData.company.subIndustry];

    const title_CN = `[&&]:text-14  [&&]:md:text-21  [&&]:lg:text-21`;
    const label_CN = `align-bottom [&&]:text-12  [&&]:md:text-16  [&&]:lg:text-16`;

    return (
        <Collapsible
            title={COMPANY}
            icon={'building'}
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            wrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-18  md:text-27  lg:text-27`}
            classNameTitleIcon={`[&]:max-w-5xs  [&]:md:max-w-n  [&]:lg:max-w-n`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                Organization
                <span className={sm || md ? 'hidden' : ''}>al Information</span>
            </span>
            <Editable
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(
                            styles.singleInput,
                            styles.singleInputBase,
                            styles.common,
                            `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                        ),
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
                Career <span className={sm || md ? 'hidden' : ''}>Information</span>
            </span>
            <Editable
                type={'company'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(
                            styles.singleInput,
                            styles.singleInputBase,
                            `px-3xs border-small`,
                            styles.roundedWFull,
                            `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
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
                            '[&>span]:x-[col-start-2,flex,flex-col,gap-y-[--p-content-5xs],text-16]',
                            'leading-tight [&>span>span]:text-14',
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
}

CompanySection.ID = getId(COMPANY);

export { CompanySection };
