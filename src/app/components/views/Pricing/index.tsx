import {FC, ReactElement, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";
import {PlanRecurrency, PlanType, useModal, useUser} from "@/app/context";

import {PLAN} from "@/app/static/constants";

import {useNavigate} from "@/app/hooks/useNavigate";

import {AuthModal, BaseModal} from "@/app/components/modals";
import {LimitsModal} from "./LimitsModal";

import {Button} from "@/app/components/form";
import {BillingModal} from "@/app/components/modals/BillingResolution";


const PLAN_TIME_RANGE: PlanRecurrency[] = ['monthly', 'annual'];

const PricingView: FC = () => {
    const [navigate] = useNavigate();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [selectedRecurrency, setSelectedRecurrency] = useState<PlanRecurrency>('monthly');

    const handleSubscribeClick = (planType: NonNullable<PlanType>, recurrency: PlanRecurrency) => {
        if (!userCtx.isLoggedIn) {
            const info = 'You must log into a Tern account to subscribe to TernKey. Please login or create an account to purchase a Plan.';
            return modalCtx.openModal(<AuthModal info={info} isLoginAction={false}/>);
        }

        navigate<SectionsEnum, NonNullable<PlanType> & PlanRecurrency>(
            SectionsEnum.Subscribe, {['plan-type']: planType, recurrency}
        );
    }

    const BillingResolution = (
        <span
            className={'underline cursor-pointer'}
            onClick={() => modalCtx.openModal(<BillingModal/>)}
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

        const isAnnualOption = selectedRecurrency === 'annual';
        const isMonthlyPlan = userData?.planRecurrency === 'monthly';
        const isCurrentPlan = userData?.planType === key;
        const isCurrentRecurrency = userData?.planRecurrency === selectedRecurrency;
        const isBtnDisabled = isCurrentPlan && isCurrentRecurrency;

        let subscribeBtnText: string;
        let Links: ReactElement | null;
        const Limits: ReactElement = (
            <span
                className={'underline cursor-pointer'}
                onClick={() => modalCtx.openModal(<LimitsModal/>)}
            >
                Limits apply
            </span>
        );

        if (!userData?.planType) {
            subscribeBtnText = 'Subscribe';
            Links = Limits;
        } else {

            if (isCurrentRecurrency) {
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
                        ${value.priceUSD[selectedRecurrency]}/month{isAnnualOption ? '*' : null}
                    </span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(key as NonNullable<PlanType>, selectedRecurrency)}
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
                className={`px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold ${selectedRecurrency === entry ? 'bg-control2' : 'text-secondary'}`}
                onClick={() => setSelectedRecurrency(entry)}
            >
                {entry}
            </div>
        )
    );

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
            <div
                hidden={typeof userCtx.userData?.planType === 'string'}
                className={'flex mt-[--py]'}
            >
                <span className={'font-oxygen text-[0.75rem] text-secondary self-end'}>
                    Have an existing plan? See the <span>{BillingResolution}</span>
                </span>
            </div>
        </>
    )
}

export {PricingView}