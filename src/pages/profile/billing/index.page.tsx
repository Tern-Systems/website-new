import React, { FC, ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { Invoice } from '@/app/types/billing';
import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { useLoginCheck, useNavigate } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';

import { formatDate } from '@/app/utils';
import { ScrollEnd } from '@/app/ui/misc';
import { PageLink } from '@/app/ui/layout';
import { HelpModal, MessageModal } from '@/app/ui/modals';

import styles from '@/app/common.module.css';

const BillingPage: FC = () => {
    const userContext = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();
    const [navigate] = useNavigate();

    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!userContext.userData) return;
            try {
                const { payload: invoices } = await BillingService.getInvoices(userContext.userData.email);
                setInvoices(invoices);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchInvoices();
        //eslint-disable-next-line
    }, [userContext.isLoggedIn])

    if (!isLoggedIn) return null;

    // Elements
    const OrderRows: ReactElement[] = (invoices ?? []).map((order, idx) => {
        const renderTd = (title: string | number, className: string, type?: 'first' | 'last') => {
            const cn =
                type === undefined
                    ? className
                    : 'px-[0.75rem] text-nowrap overflow-ellipsis overflow-hidden   sm:px-[0.38rem] ' +
                      (type === 'first'
                          ? `rounded-l-[0.56rem] sm:rounded-l-[0.18rem]`
                          : `rounded-r-[0.56rem] sm:rounded-r-[0.18rem]`);
            return <td className={cn}>{title}</td>;
        };
        return (
            <tr
                key={order.id + idx}
                onClick={() => {
                    sessionStorage.setItem('invoice', JSON.stringify(order));
                    navigate(Route.Invoice);
                }}
                className={cn(
                    styles.clickable,
                    `cursor-pointer text-nowrap align-middle [&_td]:odd:bg-[#b3b3b326]`,
                    `text-heading-s hover:bg-gray-l0`,
                    `lg:h-[3.125rem]`,
                    `md:h-[3.57rem]`,
                    `sm:x-[h-xs,text-section-xs]`,
                    `sm:landscape:x-[h-xs,text-section-xs]`,
                )}
            >
                {renderTd(order?.id, '', 'first')}
                {renderTd(formatDate(new Date(order?.startDate)), 'md:hidden  sm:portrait:hidden')}
                {renderTd(
                    order?.paidUSD?.toFixed(2),
                    'before:content-["$"] before:-mr-[0.1rem]  md:hidden  sm:portrait:hidden',
                )}
                {renderTd(order?.status, 'md:hidden  sm:hidden')}
                {renderTd(order?.item?.name, '', 'last')}
            </tr>
        );
    });

    return (
        <div
            className={cn(
                `grid h-full w-full max-w-[90rem] auto-rows-min place-self-center text-left`,
                `lg:mt-3xl`,
                `md:x-[mt-l,px-l]`,
                `sm:grid-rows-[min-content,1fr]`,
                `sm:px-xs`,
                `sm:landscape:grid-cols-[1fr,3fr]`,
                `sm:landscape:x-[auto-rows-auto,pt-xs]`,
            )}
        >
            <h1
                className={cn(
                    `flex text-heading-l font-bold`,
                    `lg:pb-[1.87rem]`,
                    `md:x-[pb-xxs]`,
                    `sm:x-[mb-0,text-section-s]`,
                    `sm:portrait:x-[pb-4xs,h-[4.69rem],items-end]`,
                    `sm:landscape:text-heading-s`,
                )}
            >
                Order Information
            </h1>
            <div
                className={cn(
                    `sm:portrait:max-h-[calc(100%-var(--p-xl))] sm:portrait:overflow-y-scroll`,
                    `sm:landscape:contents`,
                )}
            >
                <div
                    className={cn(
                        `h-[27rem] overflow-hidden rounded-s bg-gray`,
                        `lg:--p-n`,
                        `md:x-[p-s,h-[42rem]]`,
                        `sm:p-xxs`,
                        `sm:landscape:x-[p-xxs,h-full,row-span-2]`,
                    )}
                >
                    <div className={`h-full overflow-y-scroll capitalize`}>
                        <table className={'w-full table-fixed'}>
                            <thead
                                className={cn(
                                    `sticky top-0 z-10 bg-gray text-heading [&_td]:pb-xxs`,
                                    `sm:text-section-3xs sm:[&_td]:pb-5xs`,
                                )}
                            >
                                <tr>
                                    <td className={'md:w-[40%] lg:w-[17%] sm:portrait:w-[40%] sm:landscape:w-1/4'}>
                                        Order No.
                                    </td>
                                    <td className={'md:hidden lg:w-[21%] sm:portrait:hidden sm:landscape:w-1/4'}>
                                        Date
                                    </td>
                                    <td className={'md:hidden lg:w-[17%] sm:portrait:hidden sm:landscape:w-[10%]'}>
                                        Cost
                                    </td>
                                    <td className={'sm:hidden md:hidden lg:w-[17%]'}>Status</td>
                                    <td>Item</td>
                                </tr>
                            </thead>
                            <tbody>{OrderRows}</tbody>
                        </table>
                    </div>
                </div>
                <div
                    className={cn(
                        `inline-flex flex-col`,
                        `mt-l gap-y-s text-section-xs`,
                        `md:x-[gap-y-xs,mt-[1.88rem],text-basic]`,
                        `sm:x-[gap-y-4xs,mt-xs,text-section-xxs]`,
                        `sm:landscape:x-[col-start-1,gap-y-4xs,w-fit,place-content-end,text-section-3xs]`,
                    )}
                >
                    <span className={`mb-5xs text-heading font-bold sm:text-basic sm:landscape:mb-0`}>
                        Additional Resources
                    </span>
                    <PageLink href={Route.ManageSubscriptions} />
                    <PageLink href={Route.PurchasingInformation} />
                    <span
                        className={'cursor-pointer'}
                        onClick={() => modalCtx.openModal(<HelpModal type={'brc'} />, { darkenBg: true })}
                    >
                        Billing Resolution Center
                    </span>
                </div>
            </div>
            <ScrollEnd />
        </div>
    );
};

export default BillingPage;
