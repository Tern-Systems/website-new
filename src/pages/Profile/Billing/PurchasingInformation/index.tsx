import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";

import {CardData, Invoice} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useModal, useUser} from "@/app/context";

import {FullPageLayout, PageLink} from "@/app/ui/layout";
import {Button} from "@/app/ui/form";
import {ExportInvoiceModal} from "./ExportInvoiceModal";

import SVG_CARD from "@/assets/images/icons/card.svg";
import {useLoginCheck} from "@/app/hooks";


function PurchasingInformationView() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [savedCards, setSavedCards] = useState<CardData[]>([]);
    const [defaultCardIdx, setDefaultCardIdx] = useState(-1);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        try {
            // TODO fetch cards, invoices
        } catch (error: unknown) {
        }
    }, [])

    if (!isLoggedIn)
        return null;

    let Cards: ReactElement[] = savedCards.map((card, idx) => {
        if (card.isDefault)
            setDefaultCardIdx(idx);
        return (
            <li key={card.cardNumber + idx} className={'flex gap-[0.65rem] text-[1.3125rem] items-center'}>
                <Image src={SVG_CARD} alt={'card'} className={'size-[1.35419rem]'}/>
                <span>{card.nickName}</span>
                <span
                    hidden={!card.isDefault}
                    className={'text-[0.75rem] py-[0.28rem] px-[0.76rem] bg-[#D9D9D9] rounded-[0.25rem]'}
                >
                Preferred
            </span>
            </li>
        );
    })

    if (!Cards.length)
        Cards = [<span key={0} className={'text-[1rem]'}>No saved cards</span>];

    const InvoiceRows: ReactElement[] = invoices.map((order, idx) => {
        const invoiceDate = new Date(order.date);
        return (
            <tr key={order.id + idx}>
                <td>{order.id}</td>
                <td>{invoiceDate.toLocaleString('default', {month: 'long'})} {invoiceDate.getDate()}th, {invoiceDate.getFullYear()}</td>
                <td>{order.totalDue.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.card.nickName}</td>
                <td className={'text-right'}>{order.item.name}</td>
            </tr>
        )
    });

    return (
        <div className={'pt-[9.14rem] px-[1.83rem]'}>
            <div className={'w-[29.0625rem] text-nowrap mb-[5.76rem]'}>
                <h1 className={'text-[3rem] font-bold'}>
                    Purchasing Information
                </h1>
            </div>
            <div className={'grid gap-[10rem] grid-rows-1 grid-cols-2 mb-[7rem]'}>
                <div>
                    <div className={'flex justify-between'}>
                        <h2 className={'text-[1.6875rem] font-bold'}>Payment Method</h2>
                        <PageLink href={Route.EditPaymentMethod}>
                            <Button icon={'edit'} className={'px-[1rem] text-[0.875rem] flex-row-reverse'}>
                                Edit
                            </Button>
                        </PageLink>
                    </div>
                    <hr className={'border-control3 mt-[0.81rem] mb-[1.57rem]'}/>
                    <ul className={'flex flex-col gap-[0.93rem]'}>
                        {Cards}
                    </ul>
                    <PageLink href={Route.AddPaymentMethod}>
                        <Button icon={'plus'} className={'font-bold text-[1.3125rem] mt-[1.51rem]'}>
                            Add alternative payment method
                        </Button>
                    </PageLink>
                </div>
                <div>
                    <h2 className={'text-[1.6875rem] font-bold'}>Billing Details</h2>
                    <hr className={'border-control3 mt-[0.81rem] mb-[1.57rem]'}/>
                    <div className={'grid grid-rows-2 grid-cols-[max-content,max-content] gap-[3rem]'}>
                        <span>Name</span>
                        <span>{userCtx.userData?.email ?? '--'}</span>
                        <span>Billing Address</span>
                        <span>{savedCards?.[defaultCardIdx]?.billingAddress ?? '--'}</span>
                    </div>
                </div>
            </div>
            <div className={'flex justify-between items-center'}>
                <h2 className={'text-[1.6875rem] font-bold text-left'}>Invoice History</h2>
                <Button
                    className={'border-small border-control3 px-[1rem] text-[0.875rem] h-[1.44rem] rounded-full font-bold'}
                    onClick={() => modalCtx.openModal(<ExportInvoiceModal/>, {darkenBg: true})}
                >
                    Export
                </Button>
            </div>
            <hr className={'border-control3 mt-[0.81rem] mb-[1.57rem]'}/>
            <div className={'overflow-hidden rounded-[0.5625rem] p-[--py] h-[26.875rem]'}>
                <div
                    className={`overflow-y-scroll h-full text-[1.3125rem] capitalize`}>
                    <table className={'w-full'} cellPadding={'1.25'}>
                        <tbody>{InvoiceRows}</tbody>
                    </table>
                </div>
            </div>
            <span className={'block pt-[--py]'}/>
        </div>
    )
}

PurchasingInformationView.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.Billing}>{page}</FullPageLayout>
);


export default PurchasingInformationView;