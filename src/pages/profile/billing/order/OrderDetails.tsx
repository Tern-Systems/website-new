import React, {ForwardedRef, forwardRef, ForwardRefRenderFunction, PropsWithoutRef, ReactElement} from "react";

import {Invoice} from "@/app/types/billing";
import {Route, STATE_PROVINCE} from "@/app/static";

import {PageLink} from "@/app/ui/layout";
import {ScrollEnd} from "@/app/ui/misc";


interface Props {
    invoice: Invoice | null;
    card: string;
    invoiceDate: string;
    renewDate: string;
    VisibilityToggle: ReactElement;
    className?: string;
}

const OrderDetailsComponent: ForwardRefRenderFunction<HTMLDivElement, PropsWithoutRef<Props>> = (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const {invoice, className, VisibilityToggle, card, invoiceDate, renewDate} = props;

    const taxAmount = invoice?.taxPercent !== undefined && invoice?.subtotalUSD !== undefined
        ? (invoice.taxPercent * invoice.subtotalUSD)
        : undefined;
    const remainingUSD = invoice?.totalDue !== undefined && invoice?.paidUSD !== undefined
        ? invoice.totalDue - invoice.paidUSD
        : undefined;

    const state = invoice?.country && invoice?.state ? STATE_PROVINCE?.[invoice.country]?.[invoice.state] : '';

    const Hr = <hr className={'border-control-white-d0 mt-[--1qdrs] mb-[--1qdr]'}/>

    return (
        <div className={`${className} bg-control-white`}>
            <div ref={ref} className={'w-[min(100%,29rem)] place-self-center'}>
                <h2 className={'font-bold text-header'}>
                    Paid on {invoiceDate}
                </h2>

                <h3 className={'mt-[--2hdr] text-content-small font-bold text-secondary'}>Summary</h3>
                {Hr}
                <div className={`grid gap-y-[min(4dvw,2rem)] grid-cols-2`}>
                    <span>To</span>
                    <span>{invoice?.to ?? '--'}</span>
                    <span>From</span>
                    <span>{invoice?.from ?? '--'}</span>
                    <span>Order (invoice) number</span>
                    <span>#{invoice?.id ?? '--'}</span>
                </div>

                <h3 className={'mt-[--2hdr] text-content-small font-bold text-secondary'}>Items</h3>
                {Hr}
                <div className={`flex flex-col gap-y-[--1dr] mb-[min(8dvw,1.5rem)]`}>
                    <span className={'col-span-2 text-secondary font-bold'}>{invoiceDate} - {renewDate}</span>
                    <span className={'font-bold'}>
                            <span className={'flex justify-between'}>
                                <span>{invoice?.item.name ?? '--'}</span>
                                <span>${invoice?.item.priceUSD.toFixed(2) ?? '--'}</span>
                            </span>
                        </span>
                    <span className={'text-secondary text-small'}>Qty {invoice?.item ? 1 : '--'}</span>
                </div>

                {Hr}
                <div className={'text-content-small font-bold text-secondary flex justify-between'}>
                    <span>Subtotal</span>
                    <span>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <div
                    className={`text-content-small font-bold text-secondary grid grid-cols-[1fr,max-content] gap-y-[--1dr]`}>
                    <span>Total excluding tax</span>
                    <span className={'text-right'}>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                    <span className={'text-secondary'}>
                        Sales tax - {state ?? '--'}
                        &nbsp;({invoice?.taxPercent !== undefined ? invoice.taxPercent?.toFixed(0) : '--'}%)
                    </span>
                    <span
                        className={'text-secondary text-right'}>${taxAmount?.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <div className={'font-bold flex justify-between'}>
                    <span>Total due</span>
                    <span>${invoice?.totalDue?.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <div className={'font-bold grid grid-cols-[1fr,max-content] gap-y-[--1dr]'}>
                    <span>Amount paid</span>
                    <span>${invoice?.paidUSD?.toFixed(2) ?? '--'}</span>
                    <span>Amount remaining</span>
                    <span className={'text-right'}>${remainingUSD?.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <h3 className={'mt-[2.5rem] text-content-small font-bold text-secondary mb-[0.94rem] sm:mt-0'}>
                    Payment history
                </h3>
                <div className={'text-small grid grid-rows-2 gap-y-[--1dr]'}>
                    <span className={'font-bold col-span-2'}>${invoice?.paidUSD?.toFixed(2) ?? '--'}</span>
                    <span className={'capitalize'}>{card}</span>
                    <span className={'text-right'}>{invoiceDate}</span>
                </div>

                <div className={'mt-[--2hdr] text-small text-secondary'}>
                        <span>
                            Questions?&nbsp;
                            <PageLink href={Route.Contact} className={'text-blue cursor-pointer'}>
                                Contact Tern Systems, LLC
                            </PageLink>
                        </span>
                </div>

                {VisibilityToggle}
                <ScrollEnd/>
            </div>
        </div>
    );
}


const OrderDetails = forwardRef(OrderDetailsComponent);
export {OrderDetails};
