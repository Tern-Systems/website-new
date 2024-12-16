import React, {FC, ReactElement, useEffect, useState} from "react";

import {Invoice} from "@/app/types/billing";
import {INVOICE_TEMPLATE, Route} from "@/app/static";

import {useModal} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";


const ORDERS_TEMPLATE: Invoice[] = [INVOICE_TEMPLATE]


const BillingPage: FC = () => {
    const [orders, setOrders] = useState<Invoice[]>([]);

    const modalCtx = useModal();


    useEffect(() => {
        try {
            // TODO fetch orders
            const orders: Invoice[] = ORDERS_TEMPLATE;
            if (orders)
                setOrders(ORDERS_TEMPLATE)
        } catch (error: unknown) {
        }
    }, [])

    // Elements
    const OrderRows: ReactElement[] = (orders ?? []).map((order, idx) => (
        <tr
            key={order.id + idx}
            className={'h-[3.125rem] odd:bg-[#b3b3b326] cursor-pointer'}
            onClick={() => sessionStorage.setItem('invoice', JSON.stringify(order))}
        >
            <PageLink href={Route.Invoice} className={'contents align-middle'}>
                <td className={'rounded-l-[0.5625rem] px-[0.75rem]'}>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.subtotalUSD}</td>
                <td>{order.status}</td>
                <td className={'rounded-r-[0.5625rem]'}>{order.item.name}</td>
            </PageLink>
        </tr>
    ));

    return (
        <div className={'place-self-center my-auto text-left w-[90.625rem]'}>
            <h1 className={'text-[2.25rem] font-bold mb-[1.87rem] text-left'}>Order Information</h1>
            <div className={'bg-control overflow-hidden rounded-[0.5625rem] p-[--py] h-[26.875rem]'}>
                <div
                    className={`overflow-y-scroll h-full text-[1.3125rem] capitalize`}>
                    <table className={'w-full'}>
                        <thead className={'text-[1.6875rem]'}>
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
                <h2 className={'text-[1.6875rem] mb-[1.87rem] font-bold'}>Additional Resources</h2>
                <div className={'inline-flex flex-col gap-[1.56rem] text-[0.875rem]'}>
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