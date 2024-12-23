import React, {FC, ReactElement, useEffect, useState} from "react";

import {Invoice} from "@/app/types/billing";
import {INVOICE_TEMPLATE, Route} from "@/app/static";

import {useModal} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";
import {useLoginCheck} from "@/app/hooks";

import styles from '@/app/common.module.css'


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
            const side = type === 'first' ? 'l' : 'r';
            return (
                <td className={type ? `rounded-${side}-[0.5625rem] p${side}-[0.75rem]` : ''}>
                    <PageLink href={Route.Invoice} className={'hover:transform-none w-full'}>{title}</PageLink>
                </td>
            );
        }

        return (
            <tr
                key={order.id + idx}
                className={`h-[3.125rem] odd:bg-[#b3b3b326] cursor-pointer align-middle ${styles.clickable}`}
                onClick={() => sessionStorage.setItem('invoice', JSON.stringify(order))}
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
        <div className={'place-self-center my-auto text-left w-[90.625rem]'}>
            <h1 className={'text-[2.25rem] font-bold mb-[1.87rem] text-left'}>Order Information</h1>
            <div className={'bg-control-gray overflow-hidden rounded-small p-[--p-small] h-[26.875rem]'}>
                <div
                    className={`overflow-y-scroll h-full text-content capitalize`}>
                    <table className={'w-full'}>
                        <thead className={'text-header'}>
                        <tr>
                            <td className={'pb-[0.94rem]'}>Order No.</td>
                            <td className={'pb-[0.94rem]'}>Date</td>
                            <td className={'pb-[0.94rem]'}>Cost</td>
                            <td className={'pb-[0.94rem]'}>Status</td>
                            <td className={'pb-[0.94rem]'}>Item</td>
                        </tr>
                        </thead>
                        <tbody>{OrderRows}</tbody>
                    </table>
                </div>
            </div>
            <div className={'mt-[3.12rem]'}>
                <h2 className={'text-header mb-[1.87rem] font-bold'}>Additional Resources</h2>
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
    )
}

export default BillingPage;