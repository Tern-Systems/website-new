import React, {FC, ReactElement, useEffect, useState} from "react";

import {Invoice} from "@/app/types/billing";
import {Route} from "@/app/static";

import {formatDate} from "@/app/utils";

import {FullScreenLayout} from "@/app/ui/layout";
import {Button} from "@/app/ui/form";
import {OrderDetails} from "./OrderDetails";
import {OrderPreview} from "./OrderPreview";
import {BaseModal} from "@/app/ui/modals";


const COLUMN_CN = 'flex-1 pt-[min(8dvw,8rem)] px-[min(4dvw,var(--p-small))] w-1/2 overflow-y-scroll sm:w-full';


function OrderPage() {
    const [invoice, setInvoice] = useState<Invoice>();
    const [isDetailsToggled, setDetailsToggleState] = useState(false);


    useEffect(() => {
        try {
            const subscriptionData = sessionStorage.getItem('invoice');
            if (!subscriptionData)
                throw 'Error retrieving invoice data';

            // TODO fetch data
            const invoice = JSON.parse(subscriptionData) as Invoice;
            if (invoice)
                setInvoice(invoice)
        } catch (error: unknown) {
        }
    }, [])

    // Elements
    const ToggleDetailsBtn = (
        <div className={'text-center sm:mt-[13dvw]'}>
            <Button
                onClick={() => setDetailsToggleState(prevState => !prevState)}
                className={'lg:hidden md:hidden underline justify-self-center'}
            >
                {isDetailsToggled ? 'Hide' : 'See'} Details
            </Button>
        </div>
    );

    let invoiceDateStr = '--';
    let renewDateStr = '--';
    if (invoice?.date) {
        const invoiceDate = new Date(invoice.date);
        const renewDate = new Date(new Date(invoiceDate).setMonth(invoiceDate.getMonth() + (invoice?.type === 'monthly' ? 1 : 12)));
        invoiceDateStr = formatDate(invoiceDate);
        renewDateStr = formatDate(renewDate);
    }

    const card = (invoice?.card.type ?? '--') + ' •••• ' + (invoice?.card.cardNumber.slice(-4) ?? '--');

    return (
        <div className={'flex h-full font-oxygen sm:flex-col'}>
            <OrderPreview
                invoice={invoice}
                card={card}
                invoiceDate={invoiceDateStr}
                className={COLUMN_CN + (isDetailsToggled ? ' sm:hidden' : '')}
                VisibilityToggle={ToggleDetailsBtn}
            />
            <OrderDetails
                invoice={invoice}
                card={card}
                invoiceDate={invoiceDateStr}
                renewDate={renewDateStr}
                className={COLUMN_CN + (isDetailsToggled ? '' : ' sm:hidden')}
                VisibilityToggle={ToggleDetailsBtn}
            />
        </div>
    );
}


OrderPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
OrderPage.getMobileLayout = OrderPage.getLayout;


const OrderModal: FC = () => (
    <BaseModal adaptSmScreen className={'[&]:bg-control-white'} classNameContent={'sm:overflow-y-scroll sm:max-h-[90dvh]'}>
        <OrderPage/>
    </BaseModal>
);


export {OrderModal};
export default OrderPage;
