import React, { FC, FormEvent } from 'react';

import { useForm } from '@/app/hooks';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button, Select } from '@/app/ui/form';
import { BillingService } from '@/app/services';
import { useModal, useUser } from '@/app/context';

type FormData = { timeRange: number };

const FORM_DEFAULT: FormData = { timeRange: -1 };
const TIMEFRAME_OPTIONS: Record<string, string> = {
    // TODO
    '1': 'last 30 days',
    '3': 'past 3 months',
    '2025': '2025',
    '2024': '2024',
    archived: 'Archived Orders',
};

const ExportInvoiceModal: FC = () => {
    const [formData, setFormData] = useForm<FormData>(FORM_DEFAULT);
    const modalCtx = useModal();
    const { userData } = useUser();

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userData) return;

        try {
            const { payload: csvStr } = await BillingService.postExportTransaction(userData.email);

            const element = document.createElement('a');
            element.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csvStr));
            element.setAttribute('download', 'transactions.csv');
            element.style.display = 'none';

            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    return (
        <BaseModal
            title={'Export Invoice History'}
            className={`max-w-[min(90dvw,43rem)] border-gray-l0 [&]:bg-white [&_button]:brightness-50 [&_h2]:text-gray [&_hr]:border-gray-l0`}
        >
            <form
                onSubmit={handleFormSubmit}
                className={'flex items-center gap-[2.04rem] text-gray'}
            >
                <Select
                    options={TIMEFRAME_OPTIONS}
                    value={formData.timeRange.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setFormData('timeRange')(value)}
                    classNameWrapper={'flex-col [&]:items-start gap-xs flex-grow'}
                    classNameLabel={'text-[min(3.2dvw,var(--fz-content-small-))] font-bold'}
                    className={`h-[min(5.9dvw,3.25rem)] rounded-xs border-s border-white-d0 bg-white px-4xs py-[min(--p-3xs)]`}
                    classNameOption={'h-[min(5.9dvw,3.25rem)]'}
                >
                    Choose timeframe to export invoices
                </Select>
                <Button
                    className={
                        'h-h-button-n mt-[min(6.5dvw,2.5rem)] rounded-full border-s border-white-d0 px-[1rem] text-20 font-bold'
                    }
                >
                    Export
                </Button>
            </form>
        </BaseModal>
    );
};

export { ExportInvoiceModal };
