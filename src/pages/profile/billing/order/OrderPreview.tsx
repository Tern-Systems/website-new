import React, {FC, ReactElement} from "react";
import Image from "next/image";

import {Invoice} from "@/app/types/billing";

import {ScrollEnd} from "@/app/ui/misc";
import {Button} from "@/app/ui/form";

import SVG_TERN_LOGO from "/public/images/insignia-logo.png";
import SVG_DOCUMENT from "/public/images/document.svg";


const BTN_CN = 'flex-grow px-[min(4.5dvw,1rem)] w-full max-w-[21rem] rounded-full py-[min(4.5dvw,1rem)]';


interface Props {
    invoice: Invoice | null;
    card: string;
    invoiceDate: string;
    VisibilityToggle: ReactElement;
    className?: string;
}

const OrderPreview: FC<Props> = (props: Props) => {
    const {invoice, className, VisibilityToggle, card, invoiceDate} = props;


    // eslint-disable-next-line
    const handleDocumentDownload = async (isReceipt: boolean) => {
        // TODO
        try {

        } catch (error: unknown) {
        }
    }


    return (
        <div className={`relative shadow-2xl ${className}`}>
            <h2 className={`mb-[min(10.7dvw,1.25rem)] font-bold text-header-l flex gap-[0.92rem] text-nowrap items-center`}>
                <Image src={SVG_TERN_LOGO} alt={'tern-logo'} className={'w-[2.48rem] h-auto sm:hidden'}/>
                Tern Systems, LLC
            </h2>
            <div
                className={'min-w-[min(100%,53rem)] px-[min(5.3dvw,6.6rem)] place-self-center mt-[min(10.7dvw,4.1rem)]'}>
                <div className={'text-center font-bold mb-[min(8dvw,1.5rem)]'}>
                    <Image src={SVG_DOCUMENT} alt={'document'}
                           className={'w-[min(24.7dvw,5.4rem)] h-auto place-self-center'}/>
                    <span
                        className={'block text-content my-[--1hdr]'}>Invoice {invoice?.status ?? '--'}</span>
                    <span className={'block text-[3rem]'}>${invoice?.subtotalUSD.toFixed(2) ?? '--'}</span>
                </div>

                <div
                    className={`grid text-[min(4.8dvw,var(--fz-content-))] gap-y-[min(5.3dvw,1.9rem)] grid-cols-[minmax(0,1fr),minmax(0,max-content)]`}>
                    <span>Status</span>
                    <span className={'text-right capitalize'}>{invoice?.status ?? '--'}</span>
                    <span>Order (invoice) number</span>
                    <span className={'text-right'}>{invoice?.id ?? '--'}</span>
                    <span>Payment date</span>
                    <span className={'text-right'}>{invoiceDate}</span>
                    <span>Payment method</span>
                    <span className={`capitalize text-right`}>{card}</span>
                </div>

                <div className={`text-content font-bold mt-[--2hdr] flex gap-x-[0.75rem] justify-center items-center
                                    sm:flex-col sm:gap-y-[4dvw]`}>
                    <Button
                        icon={'download'}
                        className={`[&_path]:fill-gray border-small border-control-gray ${BTN_CN}`}
                        onClick={() => handleDocumentDownload(false)}
                    >
                        Download Invoice
                    </Button>
                    <Button
                        icon={'download'}
                        className={`[&_path]:fill-primary bg-control-gray text-primary ${BTN_CN}`}
                        onClick={() => handleDocumentDownload(true)}
                    >
                        Download Receipt
                    </Button>
                </div>

                {VisibilityToggle}
            </div>
            <ScrollEnd/>
        </div>
    );
}


export {OrderPreview};
