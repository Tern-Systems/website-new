import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";

import {CardData, InvoiceHistory} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useBreakpointCheck, useLoginCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {FullScreenLayout, PageLink} from "@/app/ui/layout";
import {Button} from "@/app/ui/form";
import {ExportInvoiceModal} from "./ExportInvoiceModal";

import SVG_CARD from "@/assets/images/icons/card.svg";
import {SavedCard} from "@/app/types/billing";
const PX_CN = 'px-[min(2.7dvw,0.625rem)]';


function PurchasingInformationView() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();
    const isSmScreen = useBreakpointCheck();

    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<CardData[]>([]);
    // eslint-disable-next-line
    const [defaultCardIdx, setDefaultCardIdx] = useState(-1);
    const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistory[]>([]);
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
        const fetchSubscriptionDetails = async () => {
          try {
            const result = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}get-subscription-details`,
                data: {
                    email: userCtx.userData?.email
                },
                withCredentials: true,
            });
            const dataArray = [];
            dataArray.push(result.data)
            setInvoiceHistory(dataArray);

            } catch (error) {
                console.error(error);
            }
        }
        
        fetchSubscriptionDetails();
    // eslint-disable-next-line
    }, []);

    const fetchCards = async (): Promise<void> => {
        try {
            const result = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}get-saved-cards`,
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
    // eslint-disable-next-line
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
        <div className={'mt-[min(8dvw,9rem)] px-[min(5.3dvw,1.83rem)]'}>
            <div className={'max-w-[29.0625rem] text-nowrap mb-[min(8dvw,5.76rem)]'}>
                <h1 className={'text-header-l font-bold'}>
                    Purchasing Information
                </h1>
            </div>
            <div className={'grid gap-[min(8dvw,10rem)] grid-cols-2 mb-[min(8dvw,7rem)] sm:grid-cols-1'}>
                <div>
                    <div className={`flex justify-between ${PX_CN}`}>
                        <h2 className={'text-header font-bold'}>Payment Method</h2>
                        <PageLink href={Route.EditPaymentMethod} prevent={!savedCards.length}>
                            <Button icon={'edit'} className={'text-small flex-row-reverse'}>
                                {isSmScreen ? '' : 'Edit'}
                            </Button>
                        </PageLink>
                    </div>
                    {Hr}
                    <ul className={`flex flex-col gap-[--1dr] ${PX_CN}`}>
                        {Cards}
                    </ul>
                    <PageLink href={Route.AddPaymentMethod} className={PX_CN}>
                        <Button icon={'plus'} className={'font-bold text-content mt-[min(2.7dvw,1.51rem)]'}>
                            Add alternative payment method
                        </Button>
                    </PageLink>
                </div>
                <div>
                    <h2 className={`text-header font-bold ${PX_CN}`}>Billing Details</h2>
                    {Hr}
                    <div className={`grid grid-rows-2 grid-cols-[max-content,max-content] gap-y-[min(2.7dvw,3rem)] gap-x-[min(10dvw,3rem)] ${PX_CN}`}>
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
            <div className={`flex justify-between items-center ${PX_CN}`}>
                <h2 className={'text-header font-bold text-left'}>Invoice History</h2>
                <Button
                    className={'border-small border-control-white-d0 px-[min(2.1dvw,1rem)] text-small h-[--h-control] rounded-full font-bold'}
                    onClick={() => modalCtx.openModal(<ExportInvoiceModal/>, {darkenBg: true})}
                >
                    Export
                </Button>
            </div>
            {Hr}
            <div className={'overflow-hidden rounded-small px-[--2dr] max-h-[27rem]'}>
                <div className={`overflow-y-scroll h-full text-[min(3.2dvw,var(--fz-content-))] capitalize`}>
                    <table className={'w-full'} cellPadding={'1.25'}>
                        <tbody>{InvoiceRows}</tbody>
                    </table>
                </div>
            </div>
            <ScrollEnd/>
        </div>
    )
}

PurchasingInformationView.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
PurchasingInformationView.getMobileLayout = PurchasingInformationView.getLayout;


export default PurchasingInformationView;