'use client';

import { FC, ReactElement } from 'react';
import { Margin, Resolution, usePDF } from 'react-to-pdf';
import Image from 'next/image';
import cn from 'classnames';

import { Invoice } from '@/app/types/billing';

import { checkNumber } from '@/app/utils';

import { ScrollEnd } from '@/app/ui/organisms';
import { Button } from '@/app/ui/form';

import SVG_TERN_LOGO from '@/assets/images/insignia-logo.png';
import SVG_DOCUMENT from '@/assets/images/document.svg';

import { faDownload } from '@fortawesome/free-solid-svg-icons';

const BTN_CN =
    'flex-grow px-[min(4.5dvw,1rem)] w-full max-w-[21rem] rounded-full py-[min(4.5dvw,1rem)] sm:landscape:x-[h-n,py-0]';

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

    // Event handlers
    const handleDownloadInvoice = () => toPDF({});

    const handleDownloadReceipt = () => toPDFReceipt();

    return (
        <div className={`relative md:landscape:shadow-2xl lg:shadow-2xl ${className}`}>
            <div
                className={cn(
                    'relative place-self-center mx-[min(5.3dvw,6.6rem)] py-n max-w-[43.75rem]',
                    'sm:landscape:x-[grid,py-0,pt-xs] sm:landscape:[&]:w-[90dvw]  sm:landscape:grid-cols-2',
                )}
            >
                <div ref={targetRef}>
                    <div>
                        <h2
                            className={cn(
                                `mb-[min(10.7dvw,5.25rem)] flex items-center gap-xxs text-nowrap text-27 font-bold`,
                                `sm:landscape:mb-xs md:text-40 md:landscape:text-36 lg:text-40`,
                            )}
                        >
                            <Image
                                src={SVG_TERN_LOGO}
                                alt={'tern-logo'}
                                className={'h-auto w-3xl sm:hidden'}
                            />
                            Tern Systems, LLC
                        </h2>
                        <div className={'mb-n md:mb-xl lg:mb-xl text-center font-bold  sm:landscape:mb-0'}>
                            <Image
                                src={SVG_DOCUMENT}
                                alt={'document'}
                                className={'h-auto w-[min(24.7dvw,5.4rem)] place-self-center'}
                            />
                            <span className={'my-s block text-21  sm:landscape:my-xs'}>{status}</span>
                            <span className={'block text-36  md:text-48  lg:text-48'}>{subtotal}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`grid grid-cols-[1fr,1fr] gap-y-xs text-16  sm:landscape:gap-y-xxs md:text-21  lg:text-21`}
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
                        `mt-xl flex items-center justify-center gap-y-xxs gap-x-3xs-1 text-21 font-bold sm:flex-col md:landscape:flex-col lg:flex-col`,
                        `sm:landscape:x-[mt-xs,text-16] md:text-21  lg:text-21`,
                    )}
                >
                    <Button
                        icon={faDownload}
                        className={`border-s border-gray [&_path]:fill-gray ${BTN_CN}`}
                        onClick={handleDownloadInvoice}
                    >
                        Download Invoice
                    </Button>
                    <Button
                        icon={faDownload}
                        className={`bg-gray text-primary [&_path]:fill-primary ${BTN_CN}`}
                        onClick={handleDownloadReceipt}
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
