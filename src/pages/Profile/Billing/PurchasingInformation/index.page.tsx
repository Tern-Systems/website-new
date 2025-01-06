import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";

import {InvoiceHistory, SavedCard} from "@/app/types/billing";
import {Route} from "@/app/static";

import {BillingService} from "@/app/services";

import {useBreakpointCheck, useLoginCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {FullScreenLayout, PageLink} from "@/app/ui/layout";
import {MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {ExportInvoiceModal} from "./ExportInvoiceModal";

import SVG_CARD from "@/assets/images/icons/card.svg";


function PurchasingInformationPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();
    const isSmScreen = useBreakpointCheck();

    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    // eslint-disable-next-line
    const [defaultCardIdx, setDefaultCardIdx] = useState(-1);
    const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistory[]>([]);


    useEffect(() => {
        const fetchSubscriptionDetailsAndCards = async () => {
            if (!userCtx.userData)
                return;
            try {
                const {payload: invoices} = await BillingService.postGetInvoices(userCtx.userData.email);
                setInvoiceHistory(invoices);

                const {payload: cards} = await BillingService.getCards(userCtx.userData.email);
                setSavedCards(cards);
            } catch (error) {
                let message: string = 'Unknown error';
                if (axios.isAxiosError(error))
                    message = error.cause?.message ?? message;
                else if (typeof error === 'string')
                    message = error;
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }
        }
        fetchSubscriptionDetailsAndCards();
        // eslint-disable-next-line
    }, [userCtx.userData]);


    if (!isLoggedIn)
        return null;

    const defaultCard: SavedCard | undefined = savedCards[defaultCardIdx];

    // Elements
    let Cards: ReactElement[] = savedCards.map((card, idx) => {
        if (card.preferred)
            setDefaultCardIdx(idx);
        return (
            <li key={card.last4 + idx} className={'flex gap-[0.65rem] text-content items-center'}>
                <Image src={SVG_CARD} alt={'card'} className={'w-[1.35419rem] h-auto'}/>
                <span>{card.nickname}</span>
                <span
                    hidden={!card.preferred}
                    className={'text-note py-[0.28rem] px-[0.76rem] bg-control-white-d0 rounded-smallest1'}
                >
                    Preferred
                </span>
            </li>
        );
    })

    if (!Cards.length)
        Cards = [<span key={0}>No saved cards</span>];

    const InvoiceRows: ReactElement[] = invoiceHistory.map((order, idx) => {
        const invoiceDate = new Date(order.startDate);
        return (
            <tr key={idx}>
                <td>{invoiceDate.toLocaleString('default', {month: 'long'})} {invoiceDate.getDate()}th, {invoiceDate.getFullYear()}</td>
                <td className={'sm:hidden'}>${order.amount}</td>
                <td className={'text-right sm:hidden'}>{order.name}</td>
            </tr>
        )
    });

    const Hr = <hr className={'border-control-white-d0 mt-[--s-small] mb-[--s-normal]'}/>;

    return (
        <div className={`mt-[min(8dvw,9rem)] px-[min(5.3dvw,1.83rem)] sm:x-[mt-[--2dr]]`}>
            <h1 className={`text-header-l font-bold mb-[min(8dvw,5.76rem)]
                            sm:landscape:x-[mb-[--2dr],text-content]`}
            >
                Purchasing Information
            </h1>
            <div className={'px-[min(2.7dvw,0.625rem)] sm:portrait:px-0 text-default'}>
                <div className={`grid grid-cols-2 gap-[min(8dvw,10rem)] mb-[min(8dvw,7rem)]
                            sm:grid-cols-1
                            sm:landscape:x-[gap-y-[--2dr],mb-[--2dr]]`}>
                    <div>
                        <div className={`flex justify-between`}>
                            <h2 className={'text-header font-bold   sm:landscape:text-content'}>Payment Method</h2>
                            <PageLink href={Route.EditPaymentMethod} prevent={!savedCards.length}>
                                <Button icon={'edit'} className={'text-small flex-row-reverse'}>
                                    {isSmScreen ? '' : 'Edit'}
                                </Button>
                            </PageLink>
                        </div>
                        {Hr}
                        <ul className={`flex flex-col gap-[--1dr]`}>
                            {Cards}
                        </ul>
                        <PageLink href={Route.AddPaymentMethod}
                                  className={'font-bold mt-[min(2.7dvw,1.5rem)]    sm:landscape:mt-[--s-d-small]'}>
                            <Button icon={'plus'}>Add alternative payment method</Button>
                        </PageLink>
                    </div>
                    <div>
                        <h2 className={`text-header font-bold   sm:landscape:text-content`}>Billing Details</h2>
                        {Hr}
                        <div
                            className={`grid grid-rows-2 grid-cols-[max-content,max-content]
                                        gap-y-[--1qdrs] gap-x-[min(10dvw,3rem)]
                                        sm:landscape:gap-y-[--s-d-small]`}
                        >
                            <span>Name</span>
                            <span>
                                {defaultCard
                                    ? defaultCard.billingAddress.firstName + ' ' + defaultCard.billingAddress.lastName
                                    : '--'}
                            </span>
                            <span>Billing Address</span>
                            {defaultCard ? (
                                    <ul>
                                        <li>{defaultCard.billingAddress.address}</li>
                                        <li>
                                            {defaultCard.billingAddress.city}, {defaultCard.billingAddress.state}&nbsp;
                                            {defaultCard.billingAddress.zip}
                                        </li>
                                        <li>{defaultCard.billingAddress.country}</li>
                                    </ul>
                                )
                                : <span>--</span>}
                        </div>
                    </div>
                </div>
                <div className={`flex justify-between items-center`}>
                    <h2 className={'text-header font-bold text-left   sm:landscape:text-content'}>Invoice History</h2>
                    <Button
                        className={'border-small border-control-white-d0 px-[min(2.1dvw,1rem)] text-small h-[--h-control] rounded-full font-bold'}
                        onClick={() => modalCtx.openModal(<ExportInvoiceModal/>, {darkenBg: true})}
                    >
                        Export
                    </Button>
                </div>
                {Hr}
                <div className={'overflow-hidden rounded-small max-h-[27rem]'}>
                    <div className={`overflow-y-scroll h-full capitalize`}>
                        <table className={'w-full'} cellPadding={'1.25'}>
                            <tbody>{InvoiceRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ScrollEnd/>
        </div>
    )
}

PurchasingInformationPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
PurchasingInformationPage.getMobileLayout = PurchasingInformationPage.getLayout;


export default PurchasingInformationPage;