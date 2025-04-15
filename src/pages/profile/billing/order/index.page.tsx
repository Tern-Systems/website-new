'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Margin, Resolution, usePDF } from 'react-to-pdf';
import cn from 'classnames';

import { Invoice } from '@/app/types/billing';
import { Route } from '@/app/static';

import { formatDate, getCardName } from '@/app/utils';
import { useModal } from '@/app/hooks';

import { FullScreenLayout } from '@/app/ui/layout';
import { Button } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { OrderDetails } from './OrderDetails';
import { OrderPreview } from './OrderPreview';

function OrderPage() {
    const modalCtx = useModal();
    const { toPDF, targetRef: receiptRef } = usePDF({
        filename: 'receipt.pdf',
        method: 'open',
        page: { margin: Margin.LARGE },
        resolution: Resolution.NORMAL,
    });

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isDetailsToggled, setDetailsToggleState] = useState(false);

    useEffect(() => {
        try {
            const subscriptionData = sessionStorage.getItem('invoice');
            if (!subscriptionData) throw 'Error retrieving invoice data';
            const invoice = JSON.parse(subscriptionData) as Invoice;
            if (invoice) setInvoice(invoice);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }, []);

    const handleToggleDetails = () => setDetailsToggleState((prevState) => !prevState);

    // Elements
    const ToggleDetailsBtn = (
        <div className={'mt-3xl text-center text-14 sm:landscape:mt-xs md:text-18  lg:text-18'}>
            <Button
                onClick={handleToggleDetails}
                className={'justify-self-center underline md:landscape:hidden lg:hidden'}
            >
                {isDetailsToggled ? 'Hide' : 'See'} Details
            </Button>
        </div>
    );

    let invoiceDateStr = '--';
    let renewDateStr = '--';
    if (invoice?.startDate) {
        const invoiceDate = new Date(invoice.startDate);
        const renewDate = new Date(
            new Date(invoiceDate).setMonth(invoiceDate.getMonth() + (invoice?.type === 'monthly' ? 1 : 12)),
        );
        invoiceDateStr = formatDate(invoiceDate);
        renewDateStr = formatDate(renewDate);
    }

    const card: string = getCardName(invoice?.card);

    return (
        <div
            className={
                'grid h-full w-full flex-col bg-white mx-auto  lg:x-[grid-cols-2,gap-6] md:landscape:grid-cols-2'
            }
        >
            {invoice ? (
                <>
                    <OrderPreview
                        toPDFReceipt={toPDF}
                        invoice={invoice}
                        card={card}
                        invoiceDate={invoiceDateStr}
                        className={cn(
                            'md:pt-5xl lg:pt-5xl',
                            isDetailsToggled ? 'sm:hidden' : '',
                            isDetailsToggled ? 'md:hidden' : '',
                        )}
                        VisibilityToggle={ToggleDetailsBtn}
                    />
                    <OrderDetails
                        ref={receiptRef}
                        invoice={invoice}
                        card={card}
                        invoiceDate={invoiceDateStr}
                        renewDate={renewDateStr}
                        className={cn(
                            'md:pt-5xl lg:pt-5xl',
                            isDetailsToggled ? '' : 'hidden  md:landscape:block',
                            'lg:block',
                        )}
                        VisibilityToggle={ToggleDetailsBtn}
                    />
                </>
            ) : null}
        </div>
    );
}

OrderPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
OrderPage.getMobileLayout = OrderPage.getLayout;

export default OrderPage;
