import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {Invoice, SavedCard} from "@/app/types/billing";
import {Route} from "@/app/static";

import {BillingService} from "@/app/services";

import {useLoginCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {FullScreenLayout, PageLink} from "@/app/ui/layout";
import {MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {ExportInvoiceModal} from "./ExportInvoiceModal";

import SVG_CARD from "/public/images/icons/card.svg";


function PurchasingInformationPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    // eslint-disable-next-line
    const [defaultCardIdx, setDefaultCardIdx] = useState<number>(-1);
    const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchSubscriptionDetailsAndCards = async () => {
            if (!userCtx.userData)
                return;
            try {
                const {payload: invoices} = await BillingService.getInvoices(userCtx.userData.email);
                setInvoiceHistory(invoices);

                const {payload: cards} = await BillingService.getCards(userCtx.userData.email);
                setSavedCards(cards);
                if (cards.length === 1)
                    setDefaultCardIdx(0);
            } catch (error) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchSubscriptionDetailsAndCards();
        // eslint-disable-next-line
    }, [userCtx.userData]);


    if (!isLoggedIn)
        return null;

    const defaultCard: SavedCard | null = savedCards[defaultCardIdx] ?? null;

    // Elements
    let Cards: ReactElement[] = savedCards.map((card, idx) => {
        if (card.preferred && defaultCardIdx === -1)
            setDefaultCardIdx(idx);

        return (
            <li key={card.last4 + idx} className={'flex gap-[0.65rem] text-heading-s items-center'}>
                <Image src={SVG_CARD} alt={'card'} className={'w-[1.35419rem] h-auto'}/>
                <span>{card.nickName ?? (card.cardType + ' **** ' + card.last4)}</span>
                <span
                    hidden={!card.preferred}
                    className={'text-basic py-[0.28rem] px-[0.76rem] bg-white-d0 rounded-xxs'}
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
                <td className={'leading-[1.5rem] lg:w-[15%]  md:w-[31%]'}> {order.id}</td>
                <td className={'lg:w-[15%]  md:hidden'}>
                    {invoiceDate.toLocaleString('default', {month: 'long'})} {invoiceDate.getDate()}th, {invoiceDate.getFullYear()}
                </td>
                <td className={'lg:w-[11%]  md:w-[21%]'}>${order.paidUSD}</td>
                <td className={'lg:w-[11%]  md:hidden'}>{order.status}</td>
                <td className={'lg:w-[22%]  lg:table-cell'}>{order.card?.nickName ?? (order.card.cardType + ' **** ' + order.card.last4)}</td>
                <td className={'sm:hidden'}>{order.item?.name}</td>
            </tr>
        )
    });

    const Hr = <hr className={'border-white-d0 mt-3xs mb-s'}/>;

    return (
        <div className={`mt-[min(8dvw,9rem)] px-[min(5.3dvw,1.83rem)] sm:x-[mt-l]`}>
            <h1 className={`text-heading-l font-bold mb-[min(8dvw,5.76rem)]
                            sm:landscape:x-[mb-l,text-heading-s]`}
            >
                Purchasing Information
            </h1>
            <div className={'px-[min(2.7dvw,0.625rem)] sm:portrait:px-0 text-basic'}>
                <div className={`grid grid-cols-2 gap-[min(8dvw,10rem)] mb-[min(8dvw,7rem)]
                            sm:grid-cols-1
                            sm:landscape:x-[gap-y-l,mb-l]`}>
                    <div>
                        <div className={`flex justify-between`}>
                            <h2 className={'text-heading font-bold   sm:landscape:text-heading-s'}>Payment Method</h2>
                            <PageLink href={Route.EditPaymentMethod} prevent={!savedCards.length}>
                                <Button icon={'edit'} className={'text-section flex-row-reverse'}
                                        onClick={() => router.push(Route.EditPaymentMethod)}>
                                    <span className={'sm:hidden'}>Edit</span>
                                </Button>
                            </PageLink>
                        </div>
                        {Hr}
                        <ul className={`flex flex-col gap-xxs`}>
                            {Cards}
                        </ul>
                        <PageLink href={Route.AddPaymentMethod}
                                  className={'font-bold mt-[min(2.7dvw,1.5rem)]    sm:landscape:mt-3xs'}>
                            <Button icon={'plus'}>Add alternative payment method</Button>
                        </PageLink>
                    </div>
                    <div>
                        <h2 className={`text-heading font-bold   sm:landscape:text-heading-s`}>Billing Details</h2>
                        {Hr}
                        <div
                            className={`grid grid-rows-2 grid-cols-[max-content,1fr]
                                        gap-y-xs gap-x-[min(10dvw,3rem)]
                                        sm:landscape:gap-y-3xs`}
                        >
                            <span>Name</span>
                            <span>
                                {defaultCard
                                    ? defaultCard.billingAddress?.firstName + ' ' + defaultCard.billingAddress?.lastName
                                    : '--'}
                            </span>
                            <span>Billing Address</span>
                            {defaultCard ? (
                                    <ul>
                                        <li>{defaultCard.billingAddress?.address?.split('|')?.join('')}</li>
                                        <li>
                                            {defaultCard.billingAddress?.city}, {defaultCard.billingAddress?.state}&nbsp;
                                            {defaultCard.billingAddress?.zip}
                                        </li>
                                        <li>{defaultCard.billingAddress?.country}</li>
                                    </ul>
                                )
                                : <span>--</span>}
                        </div>
                    </div>
                </div>
                <div className={`flex justify-between items-center`}>
                    <h2 className={'text-heading font-bold text-left   sm:landscape:text-heading-s'}>Invoice History</h2>
                    <Button
                        className={'border-s border-white-d0 px-[min(2.1dvw,1rem)] text-section h-h-button-n rounded-full font-bold'}
                        onClick={() => modalCtx.openModal(<ExportInvoiceModal/>, {darkenBg: true})}
                    >
                        Export
                    </Button>
                </div>
                {Hr}
                <div className={'overflow-hidden rounded-s max-h-[27rem]'}>
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