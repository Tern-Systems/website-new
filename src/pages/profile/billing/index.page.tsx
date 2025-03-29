'use client';

import { FC, useEffect, useState } from 'react';
import cn from 'classnames';

import { RowProps } from '@/app/ui/organisms/Table';
import { ResourceSectionData, TableSection } from '@/app/types/layout';
import { Invoice } from '@/app/types/billing';

import { CELL_FALLBACK, MD_SM_HIDDEN_CN, Route, SM_HIDDEN_CN } from '@/app/static';

import { BillingService } from '@/app/services';

import { useLoginCheck, useNavigate } from '@/app/hooks';
import { useModal, useUser } from '@/app/hooks';

import { formatDate } from '@/app/utils';
import { Table } from '@/app/ui/organisms';
import { PageLink } from '@/app/ui/layout';
import { MessageModal } from '@/app/ui/modals';
import { ResourcesSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.ManageSubscriptions} /> },
    { Node: <PageLink href={Route.PurchasingInformation} /> },
    { Node: <PageLink href={Route.SupportHub} /> },
];

const InvoiceRow: FC<RowProps<Invoice>> = (props: RowProps<Invoice>) => {
    const { row, className } = props;
    const [navigate] = useNavigate();
    return (
        <tr
            onClick={() => {
                sessionStorage.setItem('invoice', JSON.stringify(row));
                navigate(Route.Invoice);
            }}
            className={cn(
                styles.clickable,
                `cursor-pointer text-nowrap align-middle odd:bg-gray-d0  hover:!bg-gray-l0`,
                `text-21  sm:text-12`,
                className,
            )}
        >
            <td className={'h-[2.25rem] pl-3xs  sm:h-[1.5625rem]'}>{row?.id ?? CELL_FALLBACK}</td>
            <td>{row?.startDate ? formatDate(new Date(row?.startDate), 'short') : CELL_FALLBACK}</td>
            <td className={MD_SM_HIDDEN_CN}>{row?.paidUSD ? row.paidUSD.toFixed(2) : CELL_FALLBACK}</td>
            <td className={MD_SM_HIDDEN_CN}>{row?.status ?? CELL_FALLBACK}</td>
            <td className={cn(SM_HIDDEN_CN, 'pr-3xs')}>{row?.item?.name ?? CELL_FALLBACK}</td>
        </tr>
    );
};

const BillingPage: FC = () => {
    const userContext = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!userContext.userData) return;
            try {
                const { payload: invoices } = await BillingService.getInvoices(userContext.userData.email);
                setInvoices(invoices);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchInvoices();
    }, [userContext.isLoggedIn]);

    if (!isLoggedIn) return null;

    const table: TableSection<Invoice> = {
        title: 'Order Information',
        data: invoices,
        fallback: (
            <span>
                You don&apos;t have any products purchased. You could explore the plans on&nbsp;
                <PageLink
                    href={Route.TidalPricing}
                    className={'underline'}
                >
                    Pricing page
                </PageLink>
                .
            </span>
        ),
    };

    return (
        <div className={cn(styles.section, `pt-[6.25rem]`)}>
            <section className={styles.content}>
                <h1 className={`flex text-32 font-bold`}>Billing</h1>
            </section>
            <section className={cn(styles.content, styles.contentHighlight, 'mt-xl  lg:mt-xxl')}>
                <Table
                    table={table}
                    Row={InvoiceRow}
                >
                    <td className={'w-[21.0%] sm:w-1/2 md:w-[31.0%]'}>Order Number</td>
                    <td className={'w-[21.0%] sm:w-1/2 md:w-[26.0%]'}>Date</td>
                    <td className={cn('w-[16.4%]', MD_SM_HIDDEN_CN)}>Cost</td>
                    <td className={cn('w-[11.8%]', MD_SM_HIDDEN_CN)}>Status</td>
                    <td className={SM_HIDDEN_CN}>Item</td>
                </Table>
            </section>
            <ResourcesSection
                data={RESOURCES}
                className={'mb-[9.41rem] mt-[6.25rem]'}
            />
        </div>
    );
};

export default BillingPage;
