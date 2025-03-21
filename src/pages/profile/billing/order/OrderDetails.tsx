'use client';

import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, PropsWithoutRef, ReactElement } from 'react';

import { Invoice } from '@/app/types/billing';
import { Route, STATE_PROVINCE } from '@/app/static';

import { checkNumber } from '@/app/utils';

import { PageLink } from '@/app/ui/layout';
import { ScrollEnd } from '@/app/ui/organisms';

const Hr = <hr className={'mb-xs mt-xs border-white-d0'} />;

interface Props {
    invoice: Invoice;
    card: string;
    invoiceDate: string;
    renewDate: string;
    VisibilityToggle: ReactElement;
    className?: string;
}

const OrderDetailsComponent: ForwardRefRenderFunction<HTMLDivElement, PropsWithoutRef<Props>> = (
    props: Props,
    ref: ForwardedRef<HTMLDivElement>,
) => {
    const { invoice, className, VisibilityToggle, card, invoiceDate, renewDate } = props;

    const taxPercent: number | undefined = checkNumber(invoice?.taxPercent) ? 100 * invoice.taxPercent : undefined;
    const subtotalUSD: number | undefined = checkNumber(invoice?.subtotalUSD) ? invoice.subtotalUSD : undefined;
    const paidUSD: number | undefined = checkNumber(invoice?.paidUSD) ? invoice.paidUSD : undefined;
    const totalDue: number | undefined = checkNumber(invoice?.totalDue) ? invoice.totalDue : undefined;

    const price: string = paidUSD ? '$' + paidUSD : '-- missing amount --';
    const state: string =
        invoice?.country && invoice?.state ? STATE_PROVINCE[invoice.country]?.[invoice.state] : '-- missing state --';
    const subtotal: string = subtotalUSD ? '$' + subtotalUSD.toFixed(2) : '-- missing subtotal --';
    const taxAmount: string = taxPercent && subtotalUSD ? '$' + taxPercent * subtotalUSD : '-- missing tax amount --';
    const remainingUSD: string =
        totalDue && paidUSD ? '$' + (totalDue - paidUSD) : '-- unable to calculate remaining price --';

    return (
        <div className={`${className} bg-white`}>
            <div
                ref={ref}
                className={'w-[min(100%,29rem)] place-self-center'}
            >
                <h2 className={'text-heading font-bold'}>Paid on {invoiceDate}</h2>

                <h3 className={'mt-xl text-section-s font-bold text-secondary'}>Summary</h3>
                {Hr}
                <div className={`grid grid-cols-2 gap-y-[min(4dvw,2rem)]`}>
                    <span>To</span>
                    <span>{invoice?.to ?? '-- missing receiver --'}</span>
                    <span>From</span>
                    <span>{invoice?.from ?? '-- missing sender --'}</span>
                    <span>Order (invoice) number</span>
                    <span>{invoice?.id ? '#' + invoice.id : '-- missing id --'}</span>
                </div>

                <h3 className={'mt-xl text-section-s font-bold text-secondary'}>Items</h3>
                {Hr}
                <div className={`mb-[min(8dvw,1.5rem)] flex flex-col gap-y-xxs`}>
                    <span className={'col-span-2 font-bold text-secondary'}>
                        {invoiceDate} - {renewDate}
                    </span>
                    <span className={'font-bold'}>
                        <span className={'flex justify-between'}>
                            <span>{invoice?.item?.name ?? '-- missing name --'}</span>
                            <span>
                                {checkNumber(invoice?.item?.priceUSD)
                                    ? '$' + invoice.item.priceUSD.toFixed(2)
                                    : '-- missing price --'}
                            </span>
                        </span>
                    </span>
                    <span className={'text-section text-secondary'}>
                        {invoice?.item ? 'Qty ' + 1 : '-- missing quantity --'}
                    </span>
                </div>

                {Hr}
                <div className={'flex justify-between text-section-s font-bold text-secondary'}>
                    <span>Subtotal</span>
                    <span>{subtotal}</span>
                </div>

                {Hr}
                <div className={`grid grid-cols-[1fr,max-content] gap-y-xxs text-section-s font-bold text-secondary`}>
                    <span>Total excluding tax</span>
                    <span className={'text-right'}>{subtotal}</span>
                    <span className={'text-secondary'}>
                        Sales tax - {state}
                        &nbsp;({taxPercent?.toFixed(0) ?? '-- missing tax --'}%)
                    </span>
                    <span className={'text-right text-secondary'}>{taxAmount}</span>
                </div>

                {Hr}
                <div className={'flex justify-between font-bold'}>
                    <span>Total due</span>
                    <span>{totalDue ? '$' + totalDue.toFixed(2) : '-- missing total due --'}</span>
                </div>

                {Hr}
                <div className={'grid grid-cols-[1fr,max-content] gap-y-xxs font-bold'}>
                    <span>Amount paid</span>
                    <span>{price}</span>
                    <span>Amount remaining</span>
                    <span className={'text-right'}>{remainingUSD}</span>
                </div>

                {Hr}
                <h3 className={'mb-[0.94rem] mt-[2.5rem] text-section-s font-bold text-secondary sm:mt-0'}>
                    Payment history
                </h3>
                <div className={'grid grid-rows-2 gap-y-xxs text-section'}>
                    <span className={'col-span-2 font-bold'}>{price}</span>
                    <span className={'capitalize'}>{card}</span>
                    <span className={'text-right'}>{invoiceDate}</span>
                </div>

                <div className={'mt-xl text-section text-secondary'}>
                    <span>
                        Questions?&nbsp;
                        <PageLink
                            href={Route.Contact}
                            className={'cursor-pointer text-blue'}
                        >
                            Contact Tern Systems, LLC
                        </PageLink>
                    </span>
                </div>

                {VisibilityToggle}
                <ScrollEnd />
            </div>
        </div>
    );
};

const OrderDetails = forwardRef(OrderDetailsComponent);
export { OrderDetails };
