import {FC, ReactElement, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";
import {PlanRecurrency, PlanType, useUser} from "@/app/context/User.context";

import {useNavigate} from "@/app/hooks/useNavigate";
import {useModal} from "@/app/context/Modal.context";

import {BaseModal} from "@/app/components/modals/Base";
import {AuthModal} from "@/app/components/modals/Auth";
import {LimitsModal} from "./LimitsModal";

import {Button} from "@/app/components/form/Button";

import SVG_DIAMOND from '@/assets/images/icons/diamond.svg'
import SVG_DIAMOND_ACE from '@/assets/images/icons/diamond-ace.svg'


type Plan = Record<NonNullable<PlanType>, {
    icon: string;
    priceUSD: Record<PlanRecurrency, number>;
    benefits: string[];
}>

const PLAN_TIME_RANGE: PlanRecurrency[] = ['monthly', 'annual'];
const PLAN: Plan = {
    standard: {
        icon: SVG_DIAMOND_ACE,
        priceUSD: {monthly: 10, annual: 8},
        benefits: [
            'Create and manage one AR code',
            '100 scans per month',
            'Detailed scan analytics',
            'Custom personalization features',
            'Data import and export',
        ]
    },
    pro: {
        icon: SVG_DIAMOND,
        priceUSD: {monthly: 50, annual: 40},
        benefits: [
            'Manage up to 5 AR codes',
            '1,000 scans per month',
            'AR code design customization',
            'Video support up to 30 seconds',
            'Access to dedicated support team'
        ]
    }
}

const PricingView: FC = () => {
    const [navigate] = useNavigate();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [selectedReccurency, setSelectedReccurency] = useState<PlanRecurrency>('monthly');

    const handleSubscribeClick = (planType: NonNullable<PlanType>, reccurency: PlanRecurrency) => {
        if (!userCtx.isLoggedIn) {
            const info = 'You must have a TernKey account to subscribe. Please create or log in to your account below.';
            return modalCtx.openModal(<AuthModal info={info} isLoginAction={false}/>, {darkenBg: true});
        }

        navigate<SectionsEnum, NonNullable<PlanType> & PlanRecurrency>(
            SectionsEnum.Subscribe, {['plan-type']: planType, reccurency}
        );
    }

    const showBillingModal = () => {
        const BillingModal = (
            <BaseModal title={'Billing Resolution Center'}>
                <div className={'flex flex-col items-center w-[26.31rem]'}>
                    <span className={'mb-[1.22rem]'}>
                        Email: <a href={'mailto:brc@tern.ac'} target={'_blank'}>brc@tern.ac</a>
                    </span>
                    <span>
                        Phone: <a href={'tel:+19143065528'} target={'_blank'}>+1 (914) 306-5528</a>
                    </span>
                </div>
            </BaseModal>
        );
        modalCtx.openModal(BillingModal);
    }

    const showLimitsModal = () =>
        modalCtx.openModal(<LimitsModal/>, {darkenBg: true});


    const BillingResolution = (
        <span
            className={'underline cursor-pointer'}
            onClick={() => showBillingModal()}
        >
            billing resolution center
        </span>
    );

    const Columns: ReactElement[] = Object.entries(PLAN).map(([key, value], index) => {
        const {userData} = userCtx;

        const Benefits: ReactElement[] = value.benefits.map((benefit, subIndex) => {
            let listInsideRule = 'list-image-[url("../assets/images/icons/bullet.svg")]';
            if (key === 'pro')
                listInsideRule = 'list-image-[url("../assets/images/icons/star.svg")]';

            return (
                <li
                    key={key + subIndex}
                    className={`list-inside ${listInsideRule}`}
                >
                    {benefit}
                </li>
            );
        });

        if (index) {
            const Additional = (
                <div>
                    <span>Everything in {key}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const isAnnualOption = selectedReccurency === 'annual';
        const isMonthlyPlan = userData?.planRecurrency === 'monthly';
        const isCurrentPlan = userData?.planType === key;
        const isCurrentReccurency = userData?.planRecurrency === selectedReccurency;
        const isBtnDisabled = isCurrentPlan && isCurrentReccurency;

        let subscribeBtnText: string;
        let Links: ReactElement | null;
        const Limits: ReactElement = (
            <span
                className={'underline cursor-pointer'}
                onClick={() => showLimitsModal()}
            >
                Limits apply
            </span>
        );

        if (!userData?.planType) {
            subscribeBtnText = 'Subscribe';
            Links = Limits;
        } else {

            if (isCurrentReccurency) {
                if (isCurrentPlan) {
                    subscribeBtnText = 'Your current plan';
                    Links = (
                        <>
                            <span className={'mb-[0.44rem] underline cursor-pointer'}>Manage subscription</span>
                            <span className={'first-letter:capitalize'}>{BillingResolution}</span>
                        </>
                    );
                } else {
                    subscribeBtnText = `${index ? 'Up' : 'Down'}grade to ` + key;
                    Links = Limits;
                }
            } else {
                subscribeBtnText = `Switch to ${PLAN_TIME_RANGE[+(isMonthlyPlan)]} Plan`;
                Links = (
                    <>
                        <span className={'mb-[0.44rem]'}>
                            *Price billed {isMonthlyPlan ? 'annually' : 'monthly'}
                        </span>
                        {Limits}
                    </>
                );
            }
        }

        return (
            <div
                key={key}
                className={`flex flex-col flex-grow p-[--py] w-[25.125rem] max-h-[35.21rem] rounded-[0.5625rem]
                            border-small border-control3 bg-control text-left text-primary`}
            >
                <h2 className={'flex mb-[0.95rem] font-oxygen text-header font-bold capitalize'}>
                    <Image src={value.icon} alt={key + ' icon'} className={'mr-[0.32rem]'}/>
                    <span>{key}</span>
                </h2>
                <div className={'text-secondary mb-[2.2rem] text-[1.25rem]'}>
                    <span>
                        ${value.priceUSD[selectedReccurency]}/month{isAnnualOption ? '*' : null}
                    </span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(key as NonNullable<PlanType>, selectedReccurency)}
                    className={`bg-control3 font-bold text-[1.125rem] disabled:bg-inherit disabled:border-small disabled:border-control
                                disabled:text-secondary rounded-full py-[1.13rem]`}
                    disabled={isBtnDisabled}
                >
                    {subscribeBtnText}
                </Button>
                <ul className={'flex flex-col gap-[1.5rem] mt-[1.56rem]'}>{Benefits}</ul>
                <div
                    className={'flex flex-col mt-[2.07rem] font-oxygen text-[0.75rem] text-secondary flex-grow justify-end'}>
                    {Links}
                </div>
            </div>
        )
    });

    const Switch: ReactElement[] = PLAN_TIME_RANGE.map((entry) => (
            <div
                key={entry}
                className={`px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold ${selectedReccurency === entry ? 'bg-control2' : 'text-secondary'}`}
                onClick={() => setSelectedReccurency(entry)}
            >
                {entry}
            </div>
        )
    );

    const BillingResolutionBlock = typeof userCtx.userData?.planType === 'string'
        ? null
        : (
            <div className={'flex mt-[--py]'}>
                <span className={'font-oxygen text-[0.75rem] text-secondary self-end'}>
                    Have an existing plan? See the <span>{BillingResolution}</span>
                </span>
            </div>
        )

    return (
        <>
            <div className={'flex flex-col my-auto'}>
                <div className={'flex place-self-center p-[0.19rem] border-small rounded-full text-small'}>
                    {Switch}
                </div>
                <div className={'flex place-self-center gap-[4.13rem] mt-[3.12rem]'}>
                    {Columns}
                </div>
            </div>
            {BillingResolutionBlock}
        </>
    )
}

export {PricingView, PLAN}