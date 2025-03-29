'use client';

import { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Invoice, SavedCard } from '@/app/types/billing';
import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { useLoginCheck } from '@/app/hooks';
import { useModal, useUser } from '@/app/hooks';

import { ScrollEnd } from '@/app/ui/organisms';
import { FullScreenLayout, PageLink } from '@/app/ui/layout';
import { MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { ExportInvoiceModal } from './ExportInvoiceModal';

import SVG_CARD from '@/assets/images/icons/card.svg';
import { checkNumber, getCardName } from '@/app/utils';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function PurchasingInformationPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [defaultCardIdx, setDefaultCardIdx] = useState<number>(-1);
    const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchSubscriptionDetailsAndCards = async () => {
            if (!userCtx.userData) return;
            try {
                const { payload: invoices } = await BillingService.getInvoices(userCtx.userData.email);
                setInvoiceHistory(invoices);

                const { payload: cards } = await BillingService.getCards(userCtx.userData.email);
                setSavedCards(cards);
                if (cards.length === 1) setDefaultCardIdx(0);
            } catch (error) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchSubscriptionDetailsAndCards();
    }, [userCtx.userData]);

    if (!isLoggedIn) return null;

    const defaultCard: SavedCard | null = savedCards[defaultCardIdx] ?? null;

    // Elements
    let Cards: ReactElement[] = savedCards.map((card, idx) => {
        if (card.preferred && defaultCardIdx === -1) setDefaultCardIdx(idx);

        return (
            <li
                key={card.last4 ?? 'card-' + idx}
                className={'flex items-center gap-[0.65rem] text-21'}
            >
                <Image
                    src={SVG_CARD}
                    alt={'card'}
                    className={'h-auto w-[1.35419rem]'}
                />
                <span>{card.nickName ?? card.cardType + ' **** ' + card.last4}</span>
                <span
                    hidden={!card.preferred}
                    className={'rounded-xxs bg-white-d0 px-[0.76rem] py-[0.28rem] text-16'}
                >
                    Preferred
                </span>
            </li>
        );
    });

    if (!Cards.length) Cards = [<span key={0}>No saved cards</span>];

    const InvoiceRows: ReactElement[] = invoiceHistory.map((order, idx) => {
        const { card } = order;

        const invoiceDate: Date | undefined = order.startDate ? new Date(order.startDate) : undefined;
        const localDate: string = invoiceDate
            ? `${invoiceDate.toLocaleString('default', { month: 'long' })}} ${invoiceDate.getDate()}th, ` +
              invoiceDate.getFullYear()
            : '-- missing date --';

        return (
            <tr key={idx}>
                <td className={'leading-[1.5rem] md:w-[31%] lg:w-[15%]'}> {order.id}</td>
                <td className={'md:hidden lg:w-[15%]'}>{localDate}</td>
                <td className={'md:w-[21%] lg:w-[11%]'}>
                    {checkNumber(order.paidUSD) ? order.paidUSD : '-- missing price --'}
                </td>
                <td className={'md:hidden lg:w-[11%]'}>{order.status ?? '-- missing status --'}</td>
                <td className={'lg:table-cell lg:w-[22%]'}>{getCardName(card)}</td>
                <td className={'sm:hidden'}>{order.item?.name}</td>
            </tr>
        );
    });

    const Hr = <hr className={'mb-s mt-3xs border-white-d0'} />;

    return (
        <div className={`mt-[min(8dvw,9rem)] px-[min(5.3dvw,1.83rem)] sm:x-[mt-l]`}>
            <h1 className={`mb-[min(8dvw,5.76rem)] text-36 font-bold sm:landscape:x-[mb-l,text-21]`}>
                Purchasing Information
            </h1>
            <div className={'px-[min(2.7dvw,0.625rem)] text-16 sm:portrait:px-0'}>
                <div
                    className={`mb-[min(8dvw,7rem)] grid grid-cols-2 gap-[min(8dvw,10rem)] sm:grid-cols-1 sm:landscape:x-[gap-y-l,mb-l]`}
                >
                    <div>
                        <div className={`flex justify-between`}>
                            <h2 className={'text-27 font-bold sm:landscape:text-21'}>Payment Method</h2>
                            <PageLink
                                href={Route.EditPaymentMethod}
                                prevent={!savedCards.length}
                            >
                                <Button
                                    icon={faPen}
                                    className={'flex-row-reverse text-20'}
                                    onClick={() => router.push(Route.EditPaymentMethod)}
                                >
                                    <span className={'sm:hidden'}>Edit</span>
                                </Button>
                            </PageLink>
                        </div>
                        {Hr}
                        <ul className={`flex flex-col gap-xxs`}>{Cards}</ul>
                        <PageLink
                            href={Route.AddPaymentMethod}
                            className={'mt-[min(2.7dvw,1.5rem)] font-bold sm:landscape:mt-3xs'}
                        >
                            <Button icon={faPlus}>Add alternative payment method</Button>
                        </PageLink>
                    </div>
                    <div>
                        <h2 className={`text-27 font-bold sm:landscape:text-21`}>Billing Details</h2>
                        {Hr}
                        <div
                            className={`grid grid-cols-[max-content,1fr] grid-rows-2 gap-x-[min(10dvw,3rem)] gap-y-xs sm:landscape:gap-y-3xs`}
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
                            ) : (
                                <span>--</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`flex items-center justify-between`}>
                    <h2 className={'text-left text-27 font-bold sm:landscape:text-21'}>Invoice History</h2>
                    <Button
                        className={
                            'h-h-button-n rounded-full border-s border-white-d0 px-[min(2.1dvw,1rem)] text-20 font-bold'
                        }
                        onClick={() => modalCtx.openModal(<ExportInvoiceModal />, { darkenBg: true })}
                    >
                        Export
                    </Button>
                </div>
                {Hr}
                <div className={'max-h-[27rem] overflow-hidden rounded-s'}>
                    <div className={`h-full overflow-y-scroll capitalize`}>
                        <table
                            className={'w-full'}
                            cellPadding={'1.25'}
                        >
                            <tbody>{InvoiceRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ScrollEnd />
        </div>
    );
}

PurchasingInformationPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
PurchasingInformationPage.getMobileLayout = PurchasingInformationPage.getLayout;

export default PurchasingInformationPage;
