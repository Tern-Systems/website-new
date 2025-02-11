import React, {FC, FormEvent} from "react";

import {useForm} from "@/app/hooks";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Select} from "@/app/ui/form";
import {BillingService} from "@/app/services";
import {useModal, useUser} from "@/app/context";


type FormData = { timeRange: number; }

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
    const modalCtx = useModal();
    const {userData} = useUser();

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userData)
            return;

        try {
            const {payload: csvStr} = await BillingService.postExportTransaction(userData.email);

            const element = document.createElement('a');
            element.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csvStr));
            element.setAttribute('download', 'transactions.csv');
            element.style.display = 'none';

            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    return (
        <BaseModal
            title={'Export Invoice History'}
            className={`[&]:bg-white max-w-[min(90dvw,43rem)] border-gray-l0 [&_hr]:border-gray-l0
                    [&_h2]:text-gray [&_button]:brightness-50`}
        >
            <form onSubmit={handleFormSubmit} className={'flex items-center text-gray gap-[2.04rem]'}>
                <Select
                    options={TIMEFRAME_OPTIONS}
                    value={formData.timeRange.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setFormData('timeRange')(value)}
                    classNameWrapper={'flex-col [&]:items-start gap-xs flex-grow'}
                    classNameLabel={'text-[min(3.2dvw,var(--fz-content-small-))] font-bold'}
                    className={`px-4xs py-[min(--p-3xs)]  h-[min(5.9dvw,3.25rem)] bg-white
                                border-s rounded-xs border-white-d0`}
                    classNameOption={'h-[min(5.9dvw,3.25rem)]'}
                >
                    Choose timeframe to export invoices
                </Select>
                <Button
                    className={'border-s border-white-d0 px-[1rem] text-section h-h-button-n rounded-full font-bold mt-[min(6.5dvw,2.5rem)]'}>
                    Export
                </Button>
            </form>
        </BaseModal>
    )
}

export {ExportInvoiceModal}