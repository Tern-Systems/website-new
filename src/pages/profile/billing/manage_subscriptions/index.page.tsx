'use client';

import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { DataTestID } from '@/tests/static';

import { SelectOptions } from '@/app/ui/form/Select';
import { SavedCardFull } from '@/app/types/billing';
import { Subscription } from '@/app/types/subscription';

import { BillingService } from '@/app/services';

import { checkNumber, formatDate } from '@/app/utils';
import { useLoginCheck } from '@/app/hooks';
import { useModal, useUser } from '@/app/hooks';

import { BreadcrumbRoute } from '@/app/ui/atoms';
import { Button, Select } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { CancelModal } from './CancelModal';
import { ChangePaymentMethod } from './ChangePaymentMethod';

import styles from '@/app/common.module.css';

import SVG_CARD from '@/assets/images/icons/card.svg';
import SVG_PENCIL from '@/assets/images/icons/edit.svg';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const TestID = DataTestID.page.profile.billing.manageSubscription;

const SELECT_CN = 'h-6xl !border-0 !bg-gray  sm:h-button-xl';

const Hr = <hr className={'mb-xs mt-3xs border-white-d0'} />;

function ManageSubscriptionsPage() {
    const modalCtx = useModal();
    const { userData } = useUser();
    const isLoggedIn = useLoginCheck();

    const [selectedIdx, setSelectedIdx] = useState(-1);
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
    }, [setSavedCards, userData, updateCards]);

    useEffect(() => {
        if (userData?.subscriptions.length === 1) setSelectedIdx(0);
    }, [userData?.subscriptions]);

    if (!isLoggedIn) return null;

    const subscriptions = userData?.subscriptions?.filter(
        (subscription) => !subscription.type?.toLowerCase().includes('basic'),
    );

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedIdx];
    const subscriptionOptions: SelectOptions = Object.fromEntries(
        subscriptions?.map((subscription, idx) => [
            idx,
            subscription.subscription + ' ' + subscription.type + ' Plan',
        ]) ?? [],
    );

    const taxUSD: number | undefined = checkNumber(selectedPlan?.tax?.amount) ? selectedPlan?.tax?.amount : undefined;
    const priceUSD: number | undefined = checkNumber(selectedPlan?.priceUSD) ? selectedPlan.priceUSD : undefined;

    const price: string = priceUSD ? '$' + priceUSD.toFixed(2) : '-- missing price --';

    // Event Handlers
    const handleOpenModal = () => {
        modalCtx.openModal(<CancelModal plan={selectedPlan?.subscription} />, {
            darkenBg: true,
        });
    };

    const handleToggleDetails = () => setDetailsExpanded((prevState) => !prevState);

    const handlePaymentMethodVisibility = () => setEditPaymentMethodVisible(true);

    const handleSelectChange = (value: string) => setSelectedIdx(parseInt(value) ?? -1);

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan) return null;

        const preferredCardIdx = savedCards.length === 1 ? 0 : savedCards.findIndex((card) => card.preferred);
        const preferredCard: SavedCardFull | undefined = savedCards[preferredCardIdx];

        return (
            <div className={`mb-[24.75rem] mt-6xl-1 text-16 sm:x-[grid-cols-1,gap-y-l,mt-l]  [&>div>div>*]:px-5xs`}>
                <div>
                    <div className={'flex items-center justify-between'}>
                        <h2 className={`text-16 md:text-18 lg:text-20`}>Current Plan</h2>
                        <Button
                            data-testid={TestID.info.currentPlan.cancel.toggle}
                            className={'h-button-s border-s border-white-d0 px-5xs text-12 font-bold'}
                            onClick={handleOpenModal}
                        >
                            Cancel
                        </Button>
                    </div>
                    {Hr}
                    <div
                        className={cn(
                            `mb-xxs grid auto-rows-min`,
                            `grid-cols-[1fr,min-content] sm:grid-cols-1`,
                            `text-16 sm:text-14`,
                            `gap-y-xxs sm:gap-y-xs`,
                        )}
                    >
                        <span className={'capitalize'}>
                            {selectedPlan.subscription} {selectedPlan.type} Plan
                        </span>
                        <span className={cn('text-nowrap sm:row-start-3', 'text-16 sm:text-14')}>
                            {selectedPlan.renewDate
                                ? 'Your plan renews on ' + formatDate(selectedPlan.renewDate)
                                : '-- missing renew date --'}
                        </span>
                        <span className={'font-bold'}>
                            {price} per&nbsp;
                            {selectedPlan.recurrency
                                ? selectedPlan.recurrency === 'monthly'
                                    ? 'month'
                                    : 'year'
                                : '-- missing recurrency --'}
                        </span>
                        <Button
                            data-testid={TestID.info.currentPlan.details.toggle}
                            icon={detailsExpanded ? faChevronUp : faChevronDown}
                            className={'col-start-1 mr-auto flex-row-reverse  text-12 sm:text-14'}
                            classNameIcon={'[&_path]:fill-gray w-[0.4rem] [&_path]:fill-primary'}
                            onClick={handleToggleDetails}
                        >
                            {detailsExpanded ? 'Hide' : 'Show'} Details
                        </Button>
                    </div>
                    {detailsExpanded ? (
                        <div
                            data-testid={TestID.info.currentPlan.details.block}
                            className={cn(
                                `grid grid-cols-[1fr,min-content] grid-rows-5 text-nowrap bg-gray px-4xs py-xxs`,
                                `gap-y-xxs md:gap-y-xxs lg:gap-y-xs`,
                                `w-[16rem] min-w-fit max-w-[70%]`,
                                'mt-4xs lg:mt-3xs',
                                'text-12 sm:text-10',
                            )}
                        >
                            <span className={'capitalize'}>
                                {selectedPlan.subscription ?? '-- missing name --'}&nbsp;
                                {selectedPlan.type ? selectedPlan.type + ' Subscription' : '-- missing type --'}
                            </span>
                            <span className={'text-right'}>{price}</span>
                            <span className={'font-bold'}>Subtotal</span>
                            <span className={'text-right'}>{price}</span>
                            <hr className={'col-span-2 self-center border-white-d0'} />
                            <span>Tax</span>
                            <span className={'text-right'}>{'$' + taxUSD?.toFixed(2)}</span>
                            <span className={'font-bold'}>Total</span>
                            <span className={'text-right'}>
                                {checkNumber(priceUSD) && checkNumber(taxUSD)
                                    ? '$' + (priceUSD + taxUSD).toFixed(2)
                                    : '-- unable to calculate total --'}
                            </span>
                        </div>
                    ) : null}
                </div>
                <div className={'mt-6xl-1'}>
                    <h2 className={`text-16 md:text-18 lg:text-20`}>Payment Method</h2>
                    {Hr}
                    {!preferredCard ? (
                        <span className={'text-14'}>Error retrieving payment method</span>
                    ) : (
                        <div
                            data-testid={TestID.info.paymentMethod.entry.row}
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
                                    className={'h-auto w-xxs'}
                                />
                                <span
                                    data-testid={TestID.info.paymentMethod.entry.nickname}
                                    className={cn('mx-5xs block text-16 sm:text-14')}
                                >
                                    {preferredCard.nickName ?? preferredCard.cardType + ' **** ' + preferredCard.last4}
                                </span>
                            </span>
                            <span
                                onClick={handlePaymentMethodVisibility}
                                className={'flex cursor-pointer items-center'}
                            >
                                <span className={'mr-4xs sm:hidden'}>Change</span>
                                <ReactSVG
                                    src={SVG_PENCIL.src}
                                    className={'size-6xs lg:size-3xs'}
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
        <section
            className={cn(
                styles.section,
                styles.fullHeightSection,
                'bg-black bg-gradient-to-t from-blue to-transparent to-55% sm:to-40%',
            )}
        >
            <div className={styles.content}>
                <BreadcrumbRoute className={'!leading-l'} />
                <h1
                    className={cn(
                        `overflow-ellipsis text-nowrap`,
                        `text-27 sm:leading-s lg:text-32`,
                        `mt-4xl md:mt-3xl lg:mt-xxl`,
                    )}
                >
                    Manage Subscriptions
                </h1>
                <div className={`mt-xs md:mt-s lg:mt-n`}>
                    <Select
                        altIcon
                        options={subscriptionOptions}
                        value={selectedIdx.toString()}
                        placeholder={'Select'}
                        onChange={handleSelectChange}
                        className={{
                            select: cn(SELECT_CN, `px-xxs sm:px-3xs`),
                            option: cn(SELECT_CN, '!border-t-s !border-gray-l0'),
                            wrapper: cn(
                                `flex-col gap-y-xxs`,
                                `text-14 md:text-16 lg:text-18`,
                                `w-full md:w-1/2 lg:w-1/3`,
                            ),
                            label: 'mr-auto',
                            selected: 'w-full ',
                            chevron: 'ml-auto',
                        }}
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
