import React, {FC, ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";
import axios from "axios";

import {Invoice} from "@/app/types/billing";

import {Subscription} from "@/app/ui/templates/PaymentMethodTool";
import {Route} from "@/app/static";

import {formatDate} from "@/app/utils";
import {useLoginCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {BaseModal} from "@/app/ui/modals";
import {ExportInvoiceModal} from "../PurchasingInformation/ExportInvoiceModal";
import {FullScreenLayout} from "@/app/ui/layout";
import {Button, Select} from "@/app/ui/form";
import {CancelModal} from "./CancelModal";
import {ChangePaymentMethodModal} from "./ChangePaymentMethodModal";


import SVG_CARD from "@/assets/images/icons/card.svg";
import SVG_PENCIL from "@/assets/images/icons/edit.svg";

const PX_CN = 'px-[min(2.7dvw,0.625rem)]';
const Hr = <hr className={'border-control-white-d0 mt-[min(2.7dvw,0.81rem)] mb-[min(2.7dvw,1.57rem)]'}/>;

const SUBSCRIPTIONS_TEMPLATE: Subscription[] = [
    {
        plan: {
            type: 'pro',
            recurrency: 'monthly',
            tax: 4.5,
            priceUSD: 55.2,
            lastBillingDate: 123,
        },
        savedCards: [
            {
                type: 'visa',
                cardNumber: '1234123412341234',
                expirationDate: '01/01',
                cvc: '000',
                cardholderName: 'NAME SURNAME',
                billingCountry: 'US',
                billingAddress: '123 St',
                addressLine1: '',
                addressLine2: '',
                city: 'City',
                postalCode: '98738',
                state: 'SC',
                nickName: 'John’s Personal Debit Card',
                isDefault: true
            }
        ]
    },
    {
        plan: {
            type: 'standard',
            recurrency: 'annual',
            tax: 5.5,
            priceUSD: 40.1,
            lastBillingDate: 1234
        },
        savedCards: [],
    },
];

function ManageSubscriptionsPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [isDetailsExpanded, setDetailsExpandedState] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        // TODO fetch data
        setSubscriptions(SUBSCRIPTIONS_TEMPLATE);
    }, [])

    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
          try {
            const result = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}/get-subscription-details`,
                data: {
                    email: userCtx.userData?.email
                },
                withCredentials: true,
            });
            let dataArray = [];
            dataArray.push(result.data)
            setInvoices(dataArray);

            } catch (error) {
                console.error(error);
            }
        }
        
        fetchSubscriptionDetails();
    }, []);

    if (!isLoggedIn)
        return null;

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, idx) =>
            [idx, 'ARCH ' + subscription.plan.type + ' Plan'])
        ?? []
    );


    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan)
            return null;

        let SavedCards = selectedPlan.savedCards.map((method, idx) => (
            <li key={method.nickName + idx} className={'flex [&&_path]:fill-gray items-center'}>
                <span className={'flex gap-x-[min(1.6dvw,0.6rem)]'}>
                    <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem]'}/>
                    <span className={'text-content'}>{method.nickName}</span>
                    <span className={`flex items-center bg-control-white-d0 rounded-smallest1 px-[min(1.3dvw,1rem)] h-[min(3.5dvw,1.3rem)]
                                        text-gray text-center text-note font-oxygen`}>
                        Preferred
                    </span>
                </span>
                <ReactSVG
                    src={SVG_PENCIL.src}
                    onClick={() => modalCtx.openModal(
                        <ChangePaymentMethodModal
                            savedCards={subscriptions?.[+selectedSubscriptionIdx].savedCards ?? []}/>,
                        {darkenBg: true}
                    )}
                    className={'size-[min(2.4dvw,0.8rem)] [&_path]:fill-primary ml-auto cursor-pointer'}
                />
            </li>
        ));

        if (!SavedCards.length)
            SavedCards = [<li key={0} className={'text-gray'}>No saved cards</li>];

        let renewDate: Date;
        const billingDate = new Date(selectedPlan.plan.lastBillingDate ?? 0);
        if (selectedPlan.plan.recurrency === 'monthly')
            renewDate = new Date(new Date(billingDate).setMonth(billingDate.getMonth() + 1));
        else
            renewDate = new Date(new Date(billingDate).setFullYear(billingDate.getFullYear() + 1));


        const Hr = <hr className={'border-control-white-d0 mt-[min(2.7dvw,0.81rem)] mb-[min(5.3dvw,1.2rem)]'}/>;

        return (
            <div className={'grid gap-[min(13.3dvw,10rem)] grid-cols-2 mt-[min(13.3dvw,5.4rem)] sm:grid-cols-1'}>
                <div>
                    <div className={'flex justify-between items-center'}>
                        <h2 className={'text-[min(3.7dvw,var(--fz-header-))] font-bold'}>Current Plan</h2>
                        <Button
                            className={'border-small border-control-white-d0 px-[min(2.4dvw,1rem)] text-small h-[min(4.3dvw,1.44rem)] rounded-full font-bold'}
                            onClick={() => modalCtx.openModal(<CancelModal/>, {darkenBg: true})}
                        >
                            Cancel Plan
                        </Button>
                    </div>
                    {Hr}
                    <div
                        className={'grid grid-rows-2 grid-cols-[max-content,1fr] gap-y-[min(2.7dvw,0.93rem)] mb-[min(2.7dvw,0.93rem)] text-[min(3.2dvw,1rem)]'}>
                        <span>ARCH {selectedPlan.plan.type} Plan</span>
                        <span className={'text-[min(2.7dvw,var(--fz-content-small-))] text-right'}>
                            Your plan renews on {formatDate(renewDate)}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.plan.priceUSD.toFixed(2)} per {selectedPlan.plan.recurrency === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                    <Button
                        icon={'chevron'}
                        isIconFlippedY={isDetailsExpanded}
                        className={'flex-row-reverse font-bold [&_img]:w-[0.625rem] [&_path]:fill-gray justify-end'}
                        onClick={() => setDetailsExpandedState(prevState => !prevState)}
                    >
                        {isDetailsExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                    <div
                        className={`grid grid-rows-5 grid-cols-[1fr,min-content] bg-control-white-d0 w-[66%] max-w-[26rem] text-[min(2.1dvw,1rem)]
                                    rounded-[min(2.4dvw,1.44rem)] px-[min(2.7dvw,1.56rem)] py-[min(2.7dvw,1.22rem)] gap-y-[min(2.7dvw,1rem)] mt-[min(2.7dvw,1rem)]
                                    ${isDetailsExpanded ? '' : 'hidden'}`}>
                        <span>ARCH {selectedPlan.plan.type} Subscription</span>
                        <span className={'text-right'}>${selectedPlan.plan.priceUSD.toFixed(2)}</span>
                        <span className={'font-bold'}>Subtotal</span>
                        <span className={'font-bold text-right'}>${selectedPlan.plan.priceUSD.toFixed(2)}</span>
                        <hr className={'border-small border-control-white-d0 col-span-2 self-center'}/>
                        <span>Tax</span>
                        <span className={'text-right'}>${selectedPlan.plan.tax.toFixed(2)}</span>
                        <span className={'font-bold'}>Total</span>
                        <span
                            className={'font-bold text-right'}>${(selectedPlan.plan.priceUSD + selectedPlan.plan.tax).toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <h2 className={'text-header font-bold'}>Payment Method</h2>
                    {Hr}
                    <ul className={'flex flex-col gap-[min(2.7dvw,0.93rem)]'}>{SavedCards}</ul>
                </div>
            </div>
        );
    }

    const InvoiceRows: ReactElement[] = invoices.map((order, idx) => {
        const invoiceDate = new Date(order.startDate);
        return (
            <tr key={idx}>
                <td>{invoiceDate.toLocaleString('default', {month: 'long'})} {invoiceDate.getDate()}th, {invoiceDate.getFullYear()}</td>
                <td className={'sm:hidden'}>${order.amount}</td>
                <td className={'text-right sm:hidden'}>{order.name}</td>
            </tr>
        )
    });

    return (
        <div className={'mt-[min(8dvw,9.1rem)] px-[min(5.3dvw,1.8rem)]'}>
            <div className={'w-[min(100%,29rem)] text-nowrap text-content'}>
                <h1 className={'text-[min(7.2dvw,3rem)] font-bold mb-[min(8dvw,3.1rem)]'}>
                    Manage Subscriptions
                </h1>
                <Select
                    options={subscriptionOptions}
                    value={selectedSubscriptionIdx.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value)}
                    classNameWrapper={'flex-col gap-y-[min(2.7dvw,0.94rem)]'}
                    classNameOption={'sm:h-[min(5.9dvw,3.25rem)]'}
                    className={`px-[min(1.6dvw,0.62rem)] w-full py-[min(2dvw,0.8rem)] h-[min(5.9dvw,3.25rem)] border-small rounded-smallest border-control-white-d0`}
                    classNameLabel={'font-bold place-self-start'}
                >
                    Choose Subscription to Manage
                </Select>
            </div>
            {RenderPlanInfo()}
            <ScrollEnd/>
            <div className={`flex justify-between items-center mt-[90px]`}>
                <h2 className={'text-header font-bold text-left'}>Invoice History</h2>
                <Button
                    className={'border-small border-control-white-d0 px-[min(2.1dvw,1rem)] text-small h-[min(4.3dvw,1.44rem)] rounded-full font-bold'}
                    onClick={() => modalCtx.openModal(<ExportInvoiceModal/>, {darkenBg: true})}
                >
                    Export
                </Button>
            </div>
            {Hr}
            <div className={'overflow-hidden rounded-small px-[min(4dvw,var(--p-small))] max-h-[27rem]'}>
                <div className={`overflow-y-scroll h-full text-[min(3.2dvw,var(--fz-content-))] capitalize`}>
                    <table className={'w-full'} cellPadding={'1.25'}>
                        <tbody>{InvoiceRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


ManageSubscriptionsPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
ManageSubscriptionsPage.getMobileLayout = ManageSubscriptionsPage.getLayout;


const ManageSubscriptionsModal: FC = () => (
    <BaseModal adaptSmScreen
               className={'[&]:bg-control-white'}
               classNameContent={'sm:overflow-y-scroll sm:h-[90dvh] font-oxygen'}>
        <ManageSubscriptionsPage/>
    </BaseModal>
);


export {ManageSubscriptionsModal};
export default ManageSubscriptionsPage;
