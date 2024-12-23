import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";

import {CardData, Invoice} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useModal, useUser} from "@/app/context";

import {FullPageLayout, PageLink} from "@/app/ui/layout";
import {Button} from "@/app/ui/form";
import {ExportInvoiceModal} from "./ExportInvoiceModal";

import SVG_CARD from "@/assets/images/icons/card.svg";
import {useLoginCheck} from "@/app/hooks";
import {SavedCard} from "@/app/types/billing";


function PurchasingInformationView() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<CardData[]>([]);
    const [defaultCardIdx, setDefaultCardIdx] = useState(-1);
    // eslint-disable-next-line
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [billingAddress, setBillingAddress] = useState<{
        firstName: string,
        lastName: string,
        country: string,
        address: string,
        city: string,
        zip: string,
        state: string,
    }>();

    useEffect(() => {
        try {
            // TODO fetch cards, invoices
        } catch (error: unknown) {
        }
    }, [])

    const fetchCards = async (): Promise<void> => {
        try {
            const result = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}/get-saved-cards`,
                data: {
                  email: userCtx.userData?.email
                },
                withCredentials: true,
            });
            
            const preferredCardIdx = result.data.findIndex((card: SavedCard) => card.preferred === true);
            
            if (preferredCardIdx !== -1) {
                setBillingAddress(result.data[preferredCardIdx].billingAddress);
            }
            
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCards()
    }, [])

    if (!isLoggedIn)
        return null;

    let Cards: ReactElement[] = savedCards.map((card, idx) => {
        if (card.isDefault)
            setDefaultCardIdx(idx);
        return (
            <li key={card.cardNumber + idx} className={'flex gap-[0.65rem] text-content items-center'}>
                <Image src={SVG_CARD} alt={'card'} className={'size-[1.35419rem]'}/>
                <span>{card.nickName}</span>
                <span
                    hidden={!card.isDefault}
                    className={'text-note py-[0.28rem] px-[0.76rem] bg-control-white-d0 rounded-smallest1'}
                >
                Preferred
            </span>
            </li>
        );
    })

    if (!Cards.length)
        Cards = [<span key={0}>No saved cards</span>];

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
                        <h2 className={'text-header font-bold'}>Payment Method</h2>
                        <PageLink href={Route.EditPaymentMethod}>
                            <Button icon={'edit'} className={'px-[1rem] text-small flex-row-reverse'}>
                                Edit
                            </Button>
                        </PageLink>
                    </div>
                    <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.57rem]'}/>
                    <ul className={'flex flex-col gap-[0.93rem]'}>
                        {Cards}
                    </ul>
                    <PageLink href={Route.AddPaymentMethod}>
                        <Button icon={'plus'} className={'font-bold text-content mt-[1.51rem]'}>
                            Add alternative payment method
                        </Button>
                    </PageLink>
                </div>
                <div>
                    <h2 className={'text-header font-bold'}>Billing Details</h2>
                    <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.57rem]'}/>
                    <div className={'grid grid-rows-2 grid-cols-[max-content,max-content] gap-[3rem]'}>
                        <span>Name</span>
                        <span>{billingAddress ? `${billingAddress.firstName} ${billingAddress.lastName}` : '--'}</span>
                        <span>Billing Address</span>
                        {billingAddress ? (
                            <ul>
                                <li>{billingAddress?.address}</li>
                                <li>
                                {billingAddress?.city}, {billingAddress?.state}{" "}
                                {billingAddress?.zip}
                                </li>
                                <li>{billingAddress?.country}</li>
                            </ul>
                        ) : (
                            <span>--</span>
                        )}
                    </div>
                </div>
            </div>
            <div className={'flex justify-between items-center'}>
                <h2 className={'text-header font-bold text-left'}>Invoice History</h2>
                <Button
                    className={'border-small border-control-white-d0 px-[1rem] text-small h-[1.44rem] rounded-full font-bold'}
                    onClick={() => modalCtx.openModal(<ExportInvoiceModal/>, {darkenBg: true})}
                >
                    Export
                </Button>
            </div>
            <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.57rem]'}/>
            <div className={'overflow-hidden rounded-small p-[--p-small] h-[26.875rem]'}>
                <div
                    className={`overflow-y-scroll h-full text-content capitalize`}>
                    <table className={'w-full'} cellPadding={'1.25'}>
                        <tbody>{InvoiceRows}</tbody>
                    </table>
                </div>
            </div>
            <span className={'block pt-[--p-small]'}/>
        </div>
    )
}

PurchasingInformationView.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.Billing}>{page}</FullPageLayout>
);


export default PurchasingInformationView;