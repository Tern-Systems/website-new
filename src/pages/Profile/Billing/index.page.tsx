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
    card: {cardNumber: '1111222233334444', type: 'visa', nickname: 'john doe'},
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
                : 'px-[--s-dl-small] '
                + (type === 'first'
                    ? `rounded-l-[0.56rem]`
                    : `rounded-r-[0.56rem]`);
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
                className={`h-[min(5.3dvw,3.125rem)]  text-content odd:bg-[#b3b3b326] cursor-pointer align-middle text-nowrap
                            hover:bg-control-gray-l0 ${styles.clickable}
                            sm:landscape:x-[h-[3dvw],text-small]`}
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
        <div className={`grid place-self-center text-left h-full
                        my-auto w-[min(100%,90rem)]
                        sm:landscape:x-[grid-rows-2,grid-cols-2,my-0]`}>
            <h1 className={`text-section-header font-bold pb-[--1qdr]
                            sm:mb-0
                            sm:landscape:x-[pb-[0.5dvw],text-content]`}>
                Order Information
            </h1>
            <div className={`sm:portrait:x-[overflow-y-scroll,max-h-[65dvh]]
                            sm:landscape:x-[contents,text-[1.2dvw]]`}>
                <div
                    className={`bg-control-gray overflow-hidden rounded-small h-[27rem]
                                p-[--2dr] 
                                sm:landscape:x-[p-[--1dr],h-full,row-span-2]`}>
                    <div className={`overflow-y-scroll h-full text-content capitalize`}>
                        <table className={'w-full'}>
                            <thead className={`text-[min(2.7dvw,var(--fz-header-))] [&_td]:pb-[--1dr]
                                                sm:text-small`}>
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
                <div className={`flex-col inline-flex
                                gap-y-[min(2.6dvw,1.6rem)] mt-[3rem]
                                sm:mt-[3.8rem]
                                sm:landscape:x-[col-start-1,gap-y-[1dvw],mt-[1dvw],w-fit,self-end]`}
                >
                    <span className={`font-bold
                                    mb-[0.3rem] text-header
                                    sm:landscape:x-[text-default,mb-0]`}
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
        </div>
    )
}

export default BillingPage;