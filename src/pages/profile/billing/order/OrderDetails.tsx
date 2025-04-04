'use client';

import { ForwardedRef, forwardRef, ForwardRefRenderFunction, PropsWithoutRef, ReactElement } from 'react';

import { Invoice } from '@/app/types/billing';
import { Route, STATE_PROVINCE } from '@/app/static';

import { checkNumber } from '@/app/utils';

import { PageLink } from '@/app/ui/layout';
import { ScrollEnd } from '@/app/ui/organisms';

const Hr = ({ className = '' }: { className?: string }) => (
    <hr className={`my-xxs border-white-d0  md:my-xs  lg:my-xs  ${className}`} />
);

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
    const taxAmount: string = taxPercent && subtotalUSD ? '$' + taxPercent * subtotalUSD : '-- missing tax --';
    const remainingUSD: string =
        totalDue && paidUSD ? '$' + (totalDue - paidUSD) : '-- unable to calculate remaining price --';

    return (
        <div className={`${className} bg-white px-s min-w-[min(100%,53rem)]`}>
            <div
                ref={ref}
                className={
                    'w-[min(100%,29rem)] place-self-center py-n sm:landscape:x-[grid,gap-x-3xs,w-full,py-0,pt-xs] sm:landscape:grid-cols-2'
                }
            >
                <div>
                    <h2 className={'text-18 font-bold  md:text-27  lg:text-27'}>Paid on {invoiceDate}</h2>

                    <h3 className={'mt-l text-14 font-bold text-secondary  md:text-18  g:text-18'}>Summary</h3>
                    {<Hr className='mt-4xs  md:mt-3xs  lg:mt-3xs ' />}
                    <div className={`grid grid-cols-2 gap-y-4xs text-12  md:text-16  lg:text-16`}>
                        <span className='text-secondary'>To</span>
                        <span>{invoice?.to ?? '-- missing receiver --'}</span>
                        <span className='text-secondary'>From</span>
                        <span>{invoice?.from ?? '-- missing sender --'}</span>
                        <span className='text-secondary'>Order (invoice)</span>
                        <span>{invoice?.id ? '#' + invoice.id : '-- missing id --'}</span>
                    </div>
                </div>
                <div className='sm:landscape:x-[max-h-[70dvh],overflow-y-scroll]'>
                    <h3 className={'mt-l text-14 font-bold text-secondary  sm:landscape:mt-0   md:text-18  lg:text-18'}>
                        Items
                    </h3>
                    {<Hr className='mt-4xs  md:mt-3xs  lg:mt-3xs' />}
                    <div className={`mb-[min(8dvw,1.5rem)] flex flex-col gap-y-4xs text-14  md:text-16  lg:text-16`}>
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
                        <span className={'text-12  md:text-14  lg:text-14'}>
                            {invoice?.item ? 'Qty ' + 1 : '-- missing quantity --'}
                        </span>
                    </div>

                    {<Hr />}
                    <div className={'flex justify-between text-14 font-bold  md:text-16  lg:text-16'}>
                        <span>Subtotal</span>
                        <span>{subtotal}</span>
                    </div>

                    {<Hr />}
                    <div className={`grid grid-cols-[1fr,1fr] gap-y-4xs text-14 font-bold  md:text-16  lg:text-16`}>
                        <span>Total excluding tax</span>
                        <span className={'text-right'}>{subtotal}</span>
                        <span className={'text-secondary'}>
                            Sales tax - {state}
                            &nbsp;({taxPercent?.toFixed(0) ?? '-- missing tax --'}%)
                        </span>
                        <span className={'text-right text-14 text-secondary  md:text-16  lg:text-16'}>{taxAmount}</span>
                    </div>

                    {<Hr />}
                    <div className={'flex text-14 justify-between font-bold  md:text-16  lg:text-16'}>
                        <span>Total due</span>
                        <span>{totalDue ? '$' + totalDue.toFixed(2) : '-- missing total due --'}</span>
                    </div>

                    {<Hr />}
                    <div
                        className={
                            'grid grid-cols-[1fr,max-content] gap-y-4xs text-14 font-bold  md:text-16  lg:text-16'
                        }
                    >
                        <span>Amount paid</span>
                        <span>{price}</span>
                        <span>Amount remaining</span>
                        <span className={'text-right'}>{remainingUSD}</span>
                    </div>

                    {<Hr />}
                    <h3 className={'mb-3xs text-14 font-bold sm:mt-0  md:text-16  lg:text-16'}>Payment history</h3>
                    <div className={'grid grid-rows-2 gap-y-4xs text-12  md:text-14  lg:text-14'}>
                        <span className={'col-span-2 font-bold'}>{price}</span>
                        <span className={'capitalize'}>{card}</span>
                        <span className={'text-right'}>{invoiceDate}</span>
                    </div>

                    <div className={'mt-xl text-10 text-secondary  md:text-14  lg:text-14'}>
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
                </div>

                <ScrollEnd />
            </div>
        </div>
    );
};

const OrderDetails = forwardRef(OrderDetailsComponent);
export { OrderDetails };
