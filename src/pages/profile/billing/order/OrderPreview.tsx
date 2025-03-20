'use client';

import React, { FC, ReactElement } from 'react';
import { Margin, Resolution, usePDF } from 'react-to-pdf';
import Image from 'next/image';
import cn from 'classnames';

import { Invoice } from '@/app/types/billing';

import { checkNumber } from '@/app/utils';

import { ScrollEnd } from '@/app/ui/organisms';
import { Button } from '@/app/ui/form';

import SVG_TERN_LOGO from '/public/images/insignia-logo.png';
import SVG_DOCUMENT from '/public/images/document.svg';

import { faDownload } from '@fortawesome/free-solid-svg-icons';

const BTN_CN = 'flex-grow px-[min(4.5dvw,1rem)] w-full max-w-[21rem] rounded-full py-[min(4.5dvw,1rem)]';

interface Props {
    invoice: Invoice;
    card: string;
    invoiceDate: string;
    VisibilityToggle: ReactElement;
    className?: string;
    toPDFReceipt: () => void;
}

const OrderPreview: FC<Props> = (props: Props) => {
    const { toPDFReceipt, invoice, className, VisibilityToggle, card, invoiceDate } = props;
    const { toPDF, targetRef } = usePDF({
        filename: 'invoice.pdf',
        method: 'open',
        page: { margin: Margin.LARGE },
        resolution: Resolution.NORMAL,
    });

    const subtotal: string = checkNumber(invoice?.subtotalUSD)
        ? '$' + invoice.subtotalUSD.toFixed(2)
        : '-- missing price --';
    const status: string = invoice?.status ? 'Invoice ' + invoice.status : '-- missing status --';

    return (
        <div className={`relative md:landscape:shadow-2xl lg:shadow-2xl ${className}`}>
            <div className={'relative place-self-center mx-[min(5.3dvw,6.6rem)] py-n max-w-[43.75rem]'}>
                <div ref={targetRef}>
                    <h2
                        className={cn(
                            `mb-[min(10.7dvw,5.25rem)] flex items-center gap-[0.92rem] text-nowrap text-heading font-bold`,
                            `md:text-heading-xl lg:text-heading-xl`,
                        )}
                    >
                        <Image
                            src={SVG_TERN_LOGO}
                            alt={'tern-logo'}
                            className={'h-auto w-[2.48rem] sm:hidden'}
                        />
                        Tern Systems, LLC
                    </h2>
                    <div className={'mb-n md:mb-xl lg:mb-xl text-center font-bold'}>
                        <Image
                            src={SVG_DOCUMENT}
                            alt={'document'}
                            className={'h-auto w-[min(24.7dvw,5.4rem)] place-self-center'}
                        />
                        <span className={'my-s block text-heading-s'}>{status}</span>
                        <span className={'block text-heading-l  md:text-heading-xxl  lg:text-heading-xxl'}>
                            {subtotal}
                        </span>
                    </div>

                    <div
                        className={`grid grid-cols-[1fr,1fr] gap-y-xs text-basic  md:text-heading-s  lg:text-heading-s`}
                    >
                        <span className='md:hidden  lg:hidden'>Status</span>
                        <span className={'text-right capitalize  md:hidden  lg:hidden'}>{status}</span>
                        <span>Order number</span>
                        <span className={'text-right'}>{invoice?.id ?? '-- missing id --'}</span>
                        <span>Payment date</span>
                        <span className={'text-right'}>{invoiceDate}</span>
                        <span>Payment methods</span>
                        <span className={`text-right capitalize`}>{card}</span>
                    </div>
                </div>

                <div
                    className={cn(
                        `mt-xl flex items-center justify-center gap-y-xxs gap-x-[0.75rem] text-heading-s font-bold sm:flex-col md:landscape:flex-col lg:flex-col`,
                        `md:text-heading-s  lg:text-heading-s`,
                    )}
                >
                    <Button
                        icon={faDownload}
                        className={`border-s border-gray [&_path]:fill-gray ${BTN_CN}`}
                        onClick={() => toPDF({})}
                    >
                        Download Invoice
                    </Button>
                    <Button
                        icon={faDownload}
                        className={`bg-gray text-primary [&_path]:fill-primary ${BTN_CN}`}
                        onClick={() => toPDFReceipt()}
                    >
                        Download Receipt
                    </Button>
                </div>

                {VisibilityToggle}
            </div>
            <ScrollEnd />
        </div>
    );
};

export { OrderPreview };
