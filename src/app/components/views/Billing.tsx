import React, {FC, ReactElement, useEffect, useState} from "react";

import {Invoice} from "@/app/static/types";
import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs";
import {useRouter} from "next/navigation";
import {BillingModal} from "@/app/components/modals/BillingResolution";
import {useModal} from "@/app/context";

const BillingView: FC = () => {
    const [orders, setOrders] = useState<Invoice[]>([]);

    const router = useRouter();
    const modalCtx = useModal();

    const SectionLink = withSectionLink(router);

    useEffect(() => {
        try {
            // TODO fetch orders
            setOrders(
                [
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                    {id: 1231232, status: 'paid', cost: 23.94, date: 123412, card: 'asdsa', item: 'Asdasdadas'},
                ])
        } catch (error: unknown) {
        }
    }, [])

    // Elements
    const OrderRows: ReactElement[] = (orders ?? []).map((order, index) => (
        <tr key={order.id + index} className={'h-[3.125rem] odd:bg-[#b3b3b326]'}>
            <td className={'rounded-l-[0.5625rem]'}>{order.id}</td>
            <td>{order.date}</td>
            <td>{order.cost}</td>
            <td>{order.status}</td>
            <td className={'rounded-r-[0.5625rem]'}>{order.item}</td>
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
                    <SectionLink section={SectionsEnum.ManageSubscriptions}/>
                    <SectionLink section={SectionsEnum.PurchasingInformation}/>
                    <span className={'cursor-pointer'} onClick={() => modalCtx.openModal(<BillingModal/>)}>
                        Billing resolution center
                    </span>
                </div>
            </div>
        </div>
    )
}

export {BillingView}