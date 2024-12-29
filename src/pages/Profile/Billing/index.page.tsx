import React, {FC, ReactElement, useEffect, useState} from "react";

import {Invoice} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useLoginCheck} from "@/app/hooks";
import {useModal} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";

import styles from '@/app/common.module.css'


const INVOICE_TEMPLATE: Invoice = {
    id: 111111111111,
    date: Date.now(),
    to: 'John Doe',
    from: 'Tern Systems, LLC',
    card: {cardNumber: '1111222233334444', type: 'visa', nickName: 'john doe'},
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


const ORDERS_TEMPLATE: Invoice[] = [INVOICE_TEMPLATE]


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
        const renderTd = (title: string | number, type?: 'first' | 'last') => {
            const cn = type === undefined
                ? 'sm:hidden'
                : `rounded-l-[0.56rem] px-[--s-dl-small]`;
            return (
                <td className={`overflow-ellipsis overflow-hidden ${cn}`}>
                    <PageLink href={Route.Invoice} className={'hover:transform-none w-full'}>
                        {title}
                    </PageLink>
                </td>
            );
        }
        return (
            <tr
                key={order.id + idx}
                onClick={() => sessionStorage.setItem('invoice', JSON.stringify(order))}
                className={`h-[min(5.3dvw,3.125rem)]  text-content odd:bg-[#b3b3b326] cursor-pointer align-middle
                            hover:bg-control-gray-l0 ${styles.clickable}`}
            >
                {renderTd(order.id, 'first')}
                {renderTd(order.date)}
                {renderTd(order.subtotalUSD)}
                {renderTd(order.status)}
                {renderTd(order.item.name, 'last')}
            </tr>
        )
    });

    return (
        <div className={'place-self-center my-auto text-left w-[min(100%,90rem)]'}>
            <h1 className={`text-section-header font-bold pb-[--1qdr] block sm:mb-0`}>
                Order Information
            </h1>
            <div className={'sm:overflow-y-scroll sm:max-h-[65dvh]'}>
                <div
                    className={'bg-control-gray overflow-hidden rounded-small p-[--2dr] h-[26.875rem]'}>
                    <div
                        className={`overflow-y-scroll h-full text-content capitalize`}>
                        <table className={'w-full'}>
                            <thead className={'text-[min(2.7dvw,var(--fz-header-))] [&_td]:pb-[--1dr]'}>
                            <tr>
                                <td>Order No.</td>
                                <td className={'sm:hidden'}>Date</td>
                                <td className={'sm:hidden'}>Cost</td>
                                <td className={'sm:hidden'}>Status</td>
                                <td>Item</td>
                            </tr>
                            </thead>
                            <tbody>{OrderRows}</tbody>
                        </table>
                    </div>
                </div>
                <div className={'flex-col inline-flex gap-y-[min(2.6dvw,1.6rem)] mt-[3rem] sm:mt-[3.8rem]'}>
                    <h2 className={'text-header font-bold mb-[0.3rem]'}>Additional Resources</h2>
                    <div className={'inline-flex flex-col gap-[1.56rem] text-small'}>
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
            </div>
        </div>
    )
}

export default BillingPage;