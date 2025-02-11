import React, {ReactElement, useEffect, useState} from "react";
import {Margin, Resolution, usePDF} from "react-to-pdf";
import cn from "classnames";

import {Invoice} from "@/app/types/billing";
import {Route} from "@/app/static";

import {formatDate} from "@/app/utils";

import {FullScreenLayout} from "@/app/ui/layout";
import {Button} from "@/app/ui/form";
import {OrderDetails} from "./OrderDetails";
import {OrderPreview} from "./OrderPreview";

import styles from './Order.module.css'


function OrderPage() {
    const {toPDF, targetRef: receiptRef} = usePDF({
        filename: 'receipt.pdf',
        method: 'open',
        page: {margin: Margin.LARGE},
        resolution: Resolution.NORMAL
    });

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isDetailsToggled, setDetailsToggleState] = useState(false);


    useEffect(() => {
        try {
            const subscriptionData = sessionStorage.getItem('invoice');
            if (!subscriptionData)
                throw 'Error retrieving invoice data';
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
    if (invoice?.startDate) {
        const invoiceDate = new Date(invoice.startDate);
        const renewDate = new Date(new Date(invoiceDate).setMonth(invoiceDate.getMonth() + (invoice?.type === 'monthly' ? 1 : 12)));
        invoiceDateStr = formatDate(invoiceDate);
        renewDateStr = formatDate(renewDate);
    }

    const card = (invoice?.card.cardType ?? '--') + ' •••• ' + (invoice?.card.last4 ?? '--');

    return (
        <div className={'flex h-full font-gothic sm:flex-col'}>
            <OrderPreview
                toPDFReceipt={toPDF}
                invoice={invoice}
                card={card}
                invoiceDate={invoiceDateStr}
                className={cn(styles.column, isDetailsToggled ? ' sm:hidden' : '')}
                VisibilityToggle={ToggleDetailsBtn}
            />
            <OrderDetails
                ref={receiptRef}
                invoice={invoice}
                card={card}
                invoiceDate={invoiceDateStr}
                renewDate={renewDateStr}
                className={cn(styles.column, isDetailsToggled ? '' : styles.hidden)}
                VisibilityToggle={ToggleDetailsBtn}
            />
        </div>
    );
}


OrderPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
OrderPage.getMobileLayout = OrderPage.getLayout;


export default OrderPage;
