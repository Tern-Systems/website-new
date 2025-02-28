import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, PropsWithoutRef, ReactElement } from 'react';

import { Invoice } from '@/app/types/billing';
import { Route, STATE_PROVINCE } from '@/app/static';

import { PageLink } from '@/app/ui/layout';
import { ScrollEnd } from '@/app/ui/organisms';

interface Props {
    invoice: Invoice | null;
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

    const taxAmount =
        invoice?.taxPercent !== undefined && invoice?.subtotalUSD !== undefined
            ? invoice.taxPercent * invoice.subtotalUSD
            : undefined;
    const remainingUSD =
        invoice?.totalDue !== undefined && invoice?.paidUSD !== undefined
            ? invoice.totalDue - invoice.paidUSD
            : undefined;

    const state = invoice?.country && invoice?.state ? STATE_PROVINCE?.[invoice.country]?.[invoice.state] : '';

    const Hr = <hr className={'mb-xs mt-xs border-white-d0'} />;

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
                    <span>{invoice?.to ?? '--'}</span>
                    <span>From</span>
                    <span>{invoice?.from ?? '--'}</span>
                    <span>Order (invoice) number</span>
                    <span>#{invoice?.id ?? '--'}</span>
                </div>

                <h3 className={'mt-xl text-section-s font-bold text-secondary'}>Items</h3>
                {Hr}
                <div className={`mb-[min(8dvw,1.5rem)] flex flex-col gap-y-xxs`}>
                    <span className={'col-span-2 font-bold text-secondary'}>
                        {invoiceDate} - {renewDate}
                    </span>
                    <span className={'font-bold'}>
                        <span className={'flex justify-between'}>
                            <span>{invoice?.item.name ?? '--'}</span>
                            <span>${invoice?.item.priceUSD.toFixed(2) ?? '--'}</span>
                        </span>
                    </span>
                    <span className={'text-section text-secondary'}>Qty {invoice?.item ? 1 : '--'}</span>
                </div>

                {Hr}
                <div className={'flex justify-between text-section-s font-bold text-secondary'}>
                    <span>Subtotal</span>
                    <span>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <div className={`grid grid-cols-[1fr,max-content] gap-y-xxs text-section-s font-bold text-secondary`}>
                    <span>Total excluding tax</span>
                    <span className={'text-right'}>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                    <span className={'text-secondary'}>
                        Sales tax - {state ?? '--'}
                        &nbsp;({invoice?.taxPercent !== undefined ? (100 * invoice.taxPercent)?.toFixed(0) : '--'}%)
                    </span>
                    <span className={'text-right text-secondary'}>${taxAmount?.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <div className={'flex justify-between font-bold'}>
                    <span>Total due</span>
                    <span>${invoice?.totalDue?.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <div className={'grid grid-cols-[1fr,max-content] gap-y-xxs font-bold'}>
                    <span>Amount paid</span>
                    <span>${invoice?.paidUSD?.toFixed(2) ?? '--'}</span>
                    <span>Amount remaining</span>
                    <span className={'text-right'}>${remainingUSD?.toFixed(2) ?? '--'}</span>
                </div>

                {Hr}
                <h3 className={'mb-[0.94rem] mt-[2.5rem] text-section-s font-bold text-secondary sm:mt-0'}>
                    Payment history
                </h3>
                <div className={'grid grid-rows-2 gap-y-xxs text-section'}>
                    <span className={'col-span-2 font-bold'}>${invoice?.paidUSD?.toFixed(2) ?? '--'}</span>
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
