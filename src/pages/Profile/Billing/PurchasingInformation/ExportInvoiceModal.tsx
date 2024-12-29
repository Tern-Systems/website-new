import React, {FC} from "react";

import {useForm} from "@/app/hooks";

import {BaseModal} from "@/app/ui/modals";
import {Button, Select} from "@/app/ui/form";


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
            className={`[&]:bg-control-white max-w-[min(90dvw,43rem)] border-control-gray-l0 [&_hr]:border-control-gray-l0
                    [&_h2]:text-gray [&_button]:brightness-50`}
        >
            <form onSubmit={handleFormSubmit} className={'flex items-center text-gray gap-[2.04rem]'}>
                <Select
                    options={TIMEFRAME_OPTIONS}
                    value={formData.timeRange.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setFormData('timeRange', value)}
                    classNameWrapper={'flex-col [&]:items-start gap-[--1qdrs] flex-grow'}
                    classNameLabel={'text-[min(3.2dvw,var(--fz-content-small-))] font-bold'}
                    className={`px-[--s-d2l-smallest] py-[min(--s-d-small)]  h-[min(5.9dvw,3.25rem)] bg-control-white
                                border-small rounded-smallest border-control-white-d0`}
                >
                    Choose timeframe to export invoices
                </Select>
                <Button
                    className={'border-small border-control-white-d0 px-[1rem] text-small h-[--h-control] rounded-full font-bold mt-[min(6.5dvw,2.5rem)]'}>
                    Export
                </Button>
            </form>
        </BaseModal>
    )
}

export {ExportInvoiceModal}