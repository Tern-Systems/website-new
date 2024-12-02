import React, {FC} from "react";

import {BaseModal} from "@/app/components/modals";

import {Button, Select} from "@/app/components/form";

import {useForm} from "@/app/hooks/useForm";

type FormData = {
    timeRange: number;
}

const FORM_DEFAULT: FormData = {timeRange: -1}
const TIMEFRAME_OPTIONS: Record<string, string> = { // TODO
    '1': 'last 30 days',
    '3': 'past 3 months',
    '2025': '2025',
    '2024': '2024',
    'archived': 'Archived Orders',
}

const ExportInvoiceModal: FC = () => {
    const [formData, setFormData] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async () => {
        try {
            // TODO
        } catch (error: unknown) {
        }
    }

    return (
        <BaseModal
            title={'Export Invoice History'}
            className={`[&]:bg-control4 w-[42.8125rem] border-control5 [&_hr]:border-control5
                    [&_h2]:text-form [&_button]:brightness-50`}
        >
            <form onSubmit={handleFormSubmit} className={'flex items-center text-form gap-[2.04rem]'}>
                <Select
                    options={TIMEFRAME_OPTIONS}
                    value={formData.timeRange.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setFormData('timeRange', value)}
                    classNameWrapper={'flex-col [&]:items-start gap-[1.25rem] flex-grow'}
                    classNameLabel={'text-[1.3125rem] font-bold'}
                    className={`px-[0.62rem] py-[0.8rem]  h-[3.25rem] bg-white border-small rounded-[0.375rem] border-control3`}
                >
                    Choose timeframe to export invoices
                </Select>
                <Button
                    className={'border-small border-control3 px-[1rem] text-[0.875rem] h-[1.44rem] rounded-full font-bold mt-[2.5rem]'}>
                    Export
                </Button>
            </form>
        </BaseModal>
    )
}

export {ExportInvoiceModal}