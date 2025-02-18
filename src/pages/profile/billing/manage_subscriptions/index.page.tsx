import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { SavedCardFull } from '@/app/types/billing';
import { Subscription } from '@/app/types/subscription';

import { BillingService } from '@/app/services';

import { formatDate } from '@/app/utils';
import { useLoginCheck } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';
import { MessageModal } from '@/app/ui/modals';
import { Button, Select } from '@/app/ui/form';
import { CancelModal } from './CancelModal';
import { ChangePaymentMethod } from './ChangePaymentMethod';

import styles from '@/app/common.module.css';

import SVG_CARD from '/public/images/icons/card.svg';
import SVG_PENCIL from '/public/images/icons/edit.svg';
import { BreadcrumbRoute } from '@/app/ui/atoms';

const SELECT_CN = 'h-[3.1375rem] !border-0 !bg-gray  sm:h-button-xl';

const Hr = <hr className={'mb-xs mt-3xs border-white-d0'} />;

function ManageSubscriptionsPage() {
    const modalCtx = useModal();
    const { userData } = useUser();
    const isLoggedIn = useLoginCheck();

    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [detailsExpanded, setDetailsExpanded] = useState(false);
    const [editPaymentMethodVisible, setEditPaymentMethodVisible] = useState(false);
    const [updateCards, setUpdateCards] = useState(true);
    const [savedCards, setSavedCards] = useState<SavedCardFull[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            if (!userData || !updateCards) return;
            try {
                const { payload: cards } = await BillingService.getEditCards(userData.email);
                setSavedCards(cards);
                setUpdateCards(false);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchCards();
        // eslint-disable-next-line
    }, [setSavedCards, userData, updateCards]);

    if (!isLoggedIn) return null;

    const subscriptions = userData?.subscriptions?.filter(
        (subscription) => !subscription.type.toLowerCase().includes('basic'),
    );

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, idx) => [
            idx,
            subscription.subscription + ' ' + subscription.type + ' Plan',
        ]) ?? [],
    );

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan) return null;

        const preferredCardIdx = savedCards.findIndex((card) => card.preferred);
        const preferredCard: SavedCardFull | undefined = savedCards[preferredCardIdx];

        return (
            <div className={`mb-[24.75rem] mt-[6rem] text-basic sm:x-[grid-cols-1,gap-y-l,mt-l]  [&>div>div>*]:px-5xs`}>
                <div>
                    <div className={'flex items-center justify-between'}>
                        <h2 className={`text-basic md:text-section-s lg:text-section`}>Current Plan</h2>
                        <Button
                            className={'h-button-s border-s border-white-d0 px-5xs text-section-xxs font-bold'}
                            onClick={() =>
                                modalCtx.openModal(<CancelModal plan={selectedPlan?.subscription} />, {
                                    darkenBg: true,
                                })
                            }
                        >
                            Cancel
                        </Button>
                    </div>
                    {Hr}
                    <div
                        className={cn(
                            `mb-xxs grid auto-rows-min`,
                            `grid-cols-[1fr,min-content] sm:grid-cols-1`,
                            `text-basic sm:text-section-xs`,
                            `gap-y-xxs sm:gap-y-xs`,
                        )}
                    >
                        <span className={'capitalize'}>
                            {selectedPlan.subscription} {selectedPlan.type} Plan
                        </span>
                        <span className={cn('text-nowrap sm:row-start-3', 'text-basic sm:text-section-xs')}>
                            Your plan renews on {formatDate(new Date(selectedPlan.renewDate))}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.priceUSD.toFixed(2)} per&nbsp;
                            {selectedPlan.recurrency === 'monthly' ? 'month' : 'year'}
                        </span>
                        <Button
                            icon={'chevron'}
                            isIconFlippedY={detailsExpanded}
                            className={'col-start-1 mr-auto flex-row-reverse  text-section-xxs sm:text-section-xs'}
                            classNameIcon={'[&_path]:fill-gray [&_*]:w-[0.4rem] [&_path]:fill-primary'}
                            onClick={() => setDetailsExpanded((prevState) => !prevState)}
                        >
                            {detailsExpanded ? 'Hide' : 'Show'} Details
                        </Button>
                    </div>
                    {detailsExpanded ? (
                        <div
                            className={cn(
                                `grid grid-cols-[1fr,min-content] grid-rows-5 text-nowrap bg-gray px-4xs py-xxs`,
                                `gap-y-xxs md:gap-y-[1rem] lg:gap-y-xs`,
                                `w-[16rem] min-w-fit max-w-[70%]`,
                                'mt-4xs lg:mt-3xs',
                                'text-section-xxs sm:text-section-3xs',
                            )}
                        >
                            <span className={'capitalize'}>
                                {selectedPlan.subscription} {selectedPlan.type} Subscription
                            </span>
                            <span className={'text-right'}>${selectedPlan.priceUSD.toFixed(2)}</span>
                            <span className={'font-bold'}>Subtotal</span>
                            <span className={'text-right'}>${selectedPlan.priceUSD.toFixed(2)}</span>
                            <hr className={'col-span-2 self-center border-white-d0'} />
                            <span>Tax</span>
                            <span className={'text-right'}>${selectedPlan.tax.toFixed(2)}</span>
                            <span className={'font-bold'}>Total</span>
                            <span className={'text-right'}>
                                ${(selectedPlan.priceUSD + selectedPlan.tax).toFixed(2)}
                            </span>
                        </div>
                    ) : null}
                </div>
                <div className={'mt-[6rem]'}>
                    <h2 className={`text-basic md:text-section-s lg:text-section`}>Payment Method</h2>
                    {Hr}
                    {!preferredCard ? (
                        <span className={'text-section-xs'}>Error retrieving payment method</span>
                    ) : (
                        <div
                            className={cn(
                                'relative grid grid-cols-[1fr,max-content] items-center [&_path]:fill-primary',
                            )}
                        >
                            <span
                                className={
                                    'flex max-w-full items-center overflow-x-hidden overflow-ellipsis text-nowrap'
                                }
                            >
                                <ReactSVG
                                    src={SVG_CARD.src}
                                    className={'h-auto w-[1.35rem]'}
                                />
                                <span className={cn('mx-5xs block text-basic sm:text-section-xs')}>
                                    {preferredCard.nickName ?? preferredCard.cardType + ' **** ' + preferredCard.last4}
                                </span>
                            </span>
                            <span
                                onClick={() => setEditPaymentMethodVisible(true)}
                                className={'flex cursor-pointer items-center'}
                            >
                                <span className={'mr-4xs sm:hidden'}>Change</span>
                                <ReactSVG
                                    src={SVG_PENCIL.src}
                                    className={'[&_*]:size-[0.8rem] lg:[&_*]:size-[1.3rem]'}
                                />
                                {editPaymentMethodVisible ? (
                                    <ChangePaymentMethod
                                        openState={[editPaymentMethodVisible, setEditPaymentMethodVisible]}
                                        savedCards={savedCards}
                                        setUpdateCards={setUpdateCards}
                                    />
                                ) : null}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className={cn(styles.section, styles.fullHeightSection)}>
            <div className={styles.content}>
                <BreadcrumbRoute />
                <h1
                    className={cn(
                        `overflow-hidden overflow-ellipsis text-nowrap`,
                        `text-heading sm:leading-s lg:text-section-xl`,
                        `mt-4xl md:mt-3xl lg:mt-xxl`,
                    )}
                >
                    Manage Subscriptions
                </h1>
                <div className={`mt-xs md:mt-s lg:mt-n`}>
                    <Select
                        altIcon
                        options={subscriptionOptions}
                        value={selectedSubscriptionIdx.toString()}
                        placeholder={'Select'}
                        onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value ?? -1)}
                        classNameWrapper={cn(
                            `flex-col gap-y-xxs`,
                            `text-section-xs md:text-basic lg:text-section-s`,
                            `w-full md:w-1/2 lg:w-1/3`,
                        )}
                        classNameLabel={'mr-auto'}
                        classNameSelected={'w-full '}
                        classNameChevron={'ml-auto'}
                        className={cn(SELECT_CN, `px-xxs sm:px-3xs`)}
                        classNameOption={cn(SELECT_CN, '!border-t-s !border-gray-l0')}
                    >
                        Choose Subscription
                    </Select>
                    {RenderPlanInfo()}
                </div>
            </div>
        </section>
    );
}

export default ManageSubscriptionsPage;
