import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";

import {Invoice} from "@/app/types/billing";
import {INVOICE_TEMPLATE, Route, STATE_PROVINCE} from "@/app/static";

import {formatDate} from "@/app/utils";

import {FullPageLayout, PageLink} from "@/app/ui/layout";
import {Button} from "@/app/ui/form";

import SVG_TERN_LOGO from "@/assets/images/insignia-logo.png";
import SVG_DOCUMENT from "@/assets/images/document.svg";


function OrderPage() {
    const [invoice, setInvoice] = useState<Invoice>();

    useEffect(() => {
        try {
            const subscriptionData = localStorage.getItem('invoice');
            if (!subscriptionData)
                throw 'Error retrieving invoice data';

            // TODO fetch data
            const invoice: Invoice = INVOICE_TEMPLATE;
            if (invoice)
                setInvoice(invoice)
        } catch (error: unknown) {
        }
    }, [])


    const handleDocumentDownload = async (isReceipt: boolean) => {
        // TODO
        try {

        } catch (error: unknown) {
        }
    }

    // Elements
    let invoiceDateStr = '--';
    let renewDateStr = '--';
    if (invoice?.date) {
        const invoiceDate = new Date(invoice.date);
        const renewDate = new Date(new Date(invoiceDate).setMonth(invoiceDate.getMonth() + (invoice?.type === 'monthly' ? 1 : 12)));
        invoiceDateStr = formatDate(invoiceDate);
        renewDateStr = formatDate(renewDate);
    }

    const Hr = <hr className={'border-control3 my-[1.25rem]'}/>
    const Card = (invoice?.card.type ?? '--') + ' •••• ' + (invoice?.card.cardNumber.slice(-4) ?? '--');

    const taxAmount = invoice?.taxPercent !== undefined && invoice?.subtotalUSD !== undefined
        ? (invoice.taxPercent * invoice.subtotalUSD)
        : undefined;
    const remainingUSD = invoice?.totalDue !== undefined && invoice?.paidUSD !== undefined
        ? invoice.totalDue - invoice.paidUSD
        : undefined;

    return (
        <div className={'flex h-full font-oxygen text-[1rem]'}>
            <div className={'flex-1 pt-[8.17rem] px-[--py] w-1/2 bg-white overflow-y-scroll'}>
                <h2 className={`mb-[1.25rem] font-bold text-[3rem] flex gap-[0.92rem] text-nowrap items-center`}>
                    <Image src={SVG_TERN_LOGO} alt={'tern-logo'} className={'size-[2.48rem]'}/>
                    Tern Systems, LLC
                </h2>
                <div className={'min-w-[52.75rem] px-[6.57rem] place-self-center'}>
                    <div className={'text-center mt-[4.14rem] font-bold mb-[1.5rem]'}>
                        <Image src={SVG_DOCUMENT} alt={'document'} className={'w-[5.4375rem] place-self-center'}/>
                        <span className={'block text-[1.3125rem] my-[1.5rem]'}>Invoice {invoice?.status ?? '--'}</span>
                        <span className={'block text-[3rem]'}>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                    </div>
                    <div className={`grid text-[1.31rem] gap-y-[1.88rem] grid-cols-[1fr,max-content]`}>
                        <span>Order (invoice) number</span>
                        <span className={'text-right'}>{invoice?.id ?? '--'}</span>
                        <span>Payment date</span>
                        <span className={'text-right'}>{invoiceDateStr}</span>
                        <span>Payment method</span>
                        <span className={`capitalize text-right`}>{Card}</span>
                    </div>
                    <div
                        className={'text-[1.3125rem] font-bold mt-[2.5rem] flex gap-x-[0.75rem] justify-center font-neo'}>
                        <Button
                            icon={'download'}
                            className={'flex-grow [&_img]:brightness-50 px-[1rem] max-w-[21rem] border-small border-control2 rounded-full py-[1.07rem]'}
                            onClick={() => handleDocumentDownload(false)}
                        >
                            Download Invoice
                        </Button>
                        <Button
                            icon={'download'}
                            className={'flex-grow [&_img]:brightness-200 px-[1rem] max-w-[21rem] bg-control rounded-full py-[1.07rem] text-primary'}
                            onClick={() => handleDocumentDownload(true)}
                        >
                            Download Receipt
                        </Button>
                    </div>
                </div>
                <span className={'block pt-[--py]'}/>
            </div>
            <div className={'flex-1 pt-[8.17rem] px-[--py] w-1/2 overflow-y-scroll'}>
                <div className={'w-[29.0625rem] place-self-center'}>
                    <h2 className={'font-bold text-[1.6875rem]'}>
                        Paid on {invoiceDateStr}
                    </h2>

                    <h3 className={'mt-[2.5rem] text-[1.125rem] font-bold text-secondary'}>Summary</h3>
                    {Hr}
                    <div className={`grid gap-y-[2rem] grid-cols-2`}>
                        <span>To</span>
                        <span>{invoice?.to ?? '--'}</span>
                        <span>From</span>
                        <span>{invoice?.from ?? '--'}</span>
                        <span>Order (invoice) number</span>
                        <span>#{invoice?.id ?? '--'}</span>
                    </div>

                    <h3 className={'mt-[2.5rem] text-[1.125rem] font-bold text-secondary'}>Items</h3>
                    {Hr}
                    <div className={`flex flex-col gap-y-[0.94rem]`}>
                    <span
                        className={'col-span-2 text-secondary font-bold text-[1rem]'}>{invoiceDateStr} - {renewDateStr}</span>
                        <span className={'font-bold'}>
                            <span className={'flex justify-between'}>
                            <span>{invoice?.item.name ?? '--'}</span>
                            <span>{invoice?.item.priceUSD.toFixed(2) ?? '--'}</span>
                        </span>
                        </span>
                        <span className={'text-secondary text-[0.875rem]'}>Qty {invoice?.item ? 1 : '--'}</span>
                    </div>

                    {Hr}
                    <div className={'mt-[0.5rem] text-[1.125rem] font-bold text-secondary flex justify-between'}>
                        <span>Subtotal</span>
                        <span>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                    </div>

                    {Hr}
                    <div
                        className={`mt-[0.5rem] text-[1.125rem] font-bold text-secondary grid grid-cols-[1fr,max-content] gap-y-[0.94rem]`}>
                        <span>Total excluding tax</span>
                        <span className={'text-right'}>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                        <span className={'text-secondary'}>
                        Sales tax - {invoice?.country && invoice?.state ? STATE_PROVINCE[invoice.country][invoice.state] : '--'}
                        &nbsp;({invoice?.taxPercent !== undefined ? invoice.taxPercent * 100 : '--'}%)
                    </span>
                        <span
                            className={'text-secondary text-right'}>${taxAmount?.toFixed(2) ?? '--'}</span>
                    </div>

                    {Hr}
                    <div className={'font-bold flex justify-between'}>
                        <span>Total due</span>
                        <span>${invoice?.totalDue.toFixed(2) ?? '--'}</span>
                    </div>

                    {Hr}
                    <div className={'font-bold grid grid-cols-[1fr,max-content] gap-y-[0.94rem]'}>
                        <span>Amount paid</span>
                        <span>${invoice?.paidUSD?.toFixed(2) ?? '--'}</span>
                        <span>Amount remaining</span>
                        <span className={'text-right'}>${remainingUSD?.toFixed(2) ?? '--'}</span>
                    </div>

                    {Hr}
                    <h3 className={'mt-[2.5rem] text-[1.125rem] font-bold text-secondary mb-[0.94rem]'}>Payment
                        history</h3>
                    <div className={'text-[0.875rem] grid grid-rows-2 gap-y-[0.94rem]'}>
                        <span className={'font-bold col-span-2'}>${invoice?.paidUSD?.toFixed(2) ?? '--'}</span>
                        <span className={'capitalize'}>{Card}</span>
                        <span className={'text-right'}>{invoiceDateStr}</span>
                    </div>

                    <div className={'mt-[2.5rem] text-[0.875rem] text-secondary'}>
                        <span>
                            Questions?&nbsp;
                            <PageLink href={Route.Contact} className={'text-blue cursor-pointer'}>
                                Contact Tern Systems, LLC
                            </PageLink>
                        </span>
                    </div>
                    <span className={'block pt-[--py]'}/>
                </div>
            </div>
        </div>
    );
}

OrderPage.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.Billing}>{page}</FullPageLayout>
);


export default OrderPage