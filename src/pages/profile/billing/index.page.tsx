import React, {FC, ReactElement, useEffect, useState} from "react";
import cn from "classnames";

import {Invoice} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useLoginCheck} from "@/app/hooks";
import {useModal} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";

import styles from '@/app/common.module.css'
import {formatDate} from "@/app/utils";


const INVOICE_TEMPLATE: Invoice = {
    id: 888888888888,
    date: Date.now(),
    to: 'John Doe',
    from: 'Tern Systems, LLC',
    card: {cardNumber: '888888888888', type: 'visa', nickName: 'john doe'},
    item: {name: 'ARCH Standard Subscription', priceUSD: 10},
    subtotalUSD: 10,
    totalDue: 10.60,
    taxPercent: 0.06,
    paidUSD: 10.6,
    country: 'US',
    state: 'PA',
    type: 'monthly',
    status: 'paid'
}


const ORDERS_TEMPLATE: Invoice[] = [INVOICE_TEMPLATE, INVOICE_TEMPLATE, INVOICE_TEMPLATE]


const BillingPage: FC = () => {
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [orders, setOrders] = useState<Invoice[]>([]);

    useEffect(() => {
        try {
            // TODO fetch orders
            const orders: Invoice[] = ORDERS_TEMPLATE;
            if (orders)
                setOrders(ORDERS_TEMPLATE)
        } catch (error: unknown) {
        }
    }, [])

    if (!isLoggedIn)
        return null;


    // Elements
    const OrderRows: ReactElement[] = (orders ?? []).map((order, idx) => {
        const renderTd = (title: string | number, className: string, type?: 'first' | 'last') => {
            const cn = type === undefined
                ? className
                : 'px-[0.75rem] text-nowrap overflow-ellipsis overflow-hidden   sm:px-[0.38rem] '
                + (type === 'first'
                    ? `rounded-l-[0.56rem] sm:rounded-l-[0.18rem]`
                    : `rounded-r-[0.56rem] sm:rounded-r-[0.18rem]`);
            return (
                <td className={cn}>
                    <PageLink href={Route.Invoice} className={`contents hover:transform-none`}>
                        {title}
                    </PageLink>
                </td>
            );
        }
        return (
            <tr
                key={order.id + idx}
                onClick={() => sessionStorage.setItem('invoice', JSON.stringify(order))}
                className={cn(styles.clickable,
                    `[&_td]:odd:bg-[#b3b3b326] cursor-pointer align-middle text-nowrap`,
                    `text-heading-s hover:bg-control-gray-l0`,
                    `lg:h-[3.125rem]`,
                    `md:h-[3.57rem]`,
                    `sm:x-[h-[--p-content-xs],text-section-xs]`,
                    `sm:landscape:x-[h-[--p-content-xs],text-section-xs]`
                )}
            >
                {renderTd(order.id, '', 'first')}
                {renderTd(formatDate(new Date(order.date)), 'md:hidden  sm:portrait:hidden')}
                {renderTd(order.subtotalUSD.toFixed(2), 'before:content-["$"] before:-mr-[0.1rem]  md:hidden  sm:portrait:hidden')}
                {renderTd(order.status, 'md:hidden  sm:hidden')}
                {renderTd(order.item.name, '', 'last')}
            </tr>
        )
    });

    return (
        <div className={cn(
            `grid auto-rows-min place-self-center h-full max-w-[90rem] w-full text-left`,
            `lg:mt-[5.56rem]`,
            `md:x-[mt-[--p-content-l],px-[--p-content-l]]`,
            `sm:grid-rows-[min-content,1fr]`,
            `sm:px-[--p-content-xs]`,
            `sm:landscape:grid-cols-[1fr,3fr]`,
            `sm:landscape:x-[auto-rows-auto,pt-[--p-content-xs]]`,
        )}
        >
            <h1 className={cn(
                `flex text-heading-l font-bold`,
                `lg:pb-[1.87rem]`,
                `md:x-[pb-[--p-content-xxs]]`,
                `sm:x-[mb-0,text-section-s]`,
                `sm:portrait:x-[pb-[--p-content-4xs],h-[4.69rem],items-end]`,
                `sm:landscape:text-heading-s`,
            )}
            >
                Order Information
            </h1>
            <div className={cn(
                `sm:portrait:overflow-y-scroll sm:portrait:max-h-[calc(100%-var(--p-content-xl))]`,
                `sm:landscape:contents`
            )}
            >
                <div className={cn(
                    `h-[27rem] bg-control-gray overflow-hidden rounded-small`,
                    `lg:p-[--p-content]`,
                    `md:x-[p-[--p-content-s],h-[42rem]]`,
                    `sm:p-[--p-content-xxs]`,
                    `sm:landscape:x-[p-[--p-content-xxs],h-full,row-span-2]`,
                )}
                >
                    <div className={`h-full overflow-y-scroll capitalize`}>
                        <table className={'w-full table-fixed'}>
                            <thead
                                className={`text-heading [&_td]:pb-[--p-content-xxs]   sm:text-section-3xs sm:[&_td]:pb-[--p-content-5xs]`}>
                            <tr>
                                <td className={'lg:w-[17%]  md:w-[40%]  sm:portrait:w-[40%]  sm:landscape:w-1/4'}>Order
                                    No.
                                </td>
                                <td className={'lg:w-[21%]  md:hidden  sm:portrait:hidden  sm:landscape:w-1/4'}>Date</td>
                                <td className={'lg:w-[17%]  md:hidden  sm:portrait:hidden  sm:landscape:w-[10%]'}>Cost</td>
                                <td className={'lg:w-[17%]  md:hidden  sm:hidden'}>Status</td>
                                <td>Item</td>
                            </tr>
                            </thead>
                            <tbody>{OrderRows}</tbody>
                        </table>
                    </div>
                </div>
                <div className={cn(
                    `flex-col inline-flex`,
                    `gap-y-[--p-content-s] mt-[--p-content-l] text-section-xs`,
                    `md:x-[gap-y-[--p-content-xs],mt-[1.88rem],text-basic]`,
                    `sm:x-[gap-y-[--p-content-4xs],mt-[--p-content-xs],text-section-xxs]`,
                    `sm:landscape:x-[col-start-1,gap-y-[--p-content-4xs],w-fit,place-content-end,text-section-3xs]`,
                )}
                >
                    <span className={`font-bold
                                    mb-[--p-content-5xs] text-heading
                                    sm:text-basic
                                    sm:landscape:mb-0`}
                    >
                        Additional Resources
                    </span>
                    <PageLink href={Route.ManageSubscriptions}/>
                    <PageLink href={Route.PurchasingInformation}/>
                    <span
                        className={'cursor-pointer'}
                        onClick={() => modalCtx.openModal(<HelpModal type={'brc'}/>, {darkenBg: true})}
                    >
                        Billing resolution center
                    </span>
                </div>
            </div>
            <ScrollEnd/>
        </div>
    )
}

export default BillingPage;