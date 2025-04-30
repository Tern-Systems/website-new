'use client';

import { FC, FormEvent } from 'react';

import { DataTestID } from '@/tests/static';

import { BillingService } from '@/app/services';

import { downloadFile } from '@/app/utils';
import { useForm, useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button, Select } from '@/app/ui/form';

const TestID = DataTestID.modal.exportHistory;

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
            downloadFile('data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csvStr));
            modalCtx.closeModal();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    const handleTimeRangeChange = (value: string) => setFormData('timeRange')(value);

    return (
        <BaseModal
            data-testid={TestID.modal}
            title={'Export Invoice History'}
            className={`max-w-[min(90dvw,43rem)] border-gray-l0 [&]:bg-white [&_h2]:text-gray [&_hr]:border-gray-l0`}
            classNameContent={'!overflow-y-visible'}
        >
            <form
                onSubmit={handleFormSubmit}
                className={'flex items-center gap-l text-gray'}
            >
                <Select
                    data-testid={TestID.rangeSelect}
                    name={TestID.rangeSelect}
                    options={TIMEFRAME_OPTIONS}
                    value={formData.timeRange.toString()}
                    placeholder={'Select'}
                    onChange={handleTimeRangeChange}
                    classNameWrapper={'flex-col [&]:items-start gap-xs flex-grow'}
                    classNameLabel={'text-[min(3.2dvw,var(--fz-content-s))] font-bold'}
                    className={`h-[min(5.9dvw,3.25rem)] px-4xs py-[min(--p-3xs)]`}
                    classNameOption={'h-[min(5.9dvw,3.25rem)] [&:first-of-type]:border-t-0'}
                >
                    Choose timeframe to export invoices
                </Select>
                <Button
                    data-testid={TestID.exportButton}
                    className={
                        'h-button-n mt-[min(6.5dvw,2.5rem)] rounded-full border-s border-white-d0 px-xxs text-20 font-bold'
                    }
                    disabled={formData.timeRange < 0}
                >
                    Export
                </Button>
            </form>
        </BaseModal>
    );
};

export { ExportInvoiceModal };
