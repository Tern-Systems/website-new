import {FC, ReactElement, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";
import {PlanRecurrency, PlanType, useUser} from "@/app/context/User.context";

import {navigate} from "@/app/utils/router";

import {useModal} from "@/app/context/Modal.context";

import {AuthModal} from "@/app/components/modals/Auth";
import {LimitsModal} from "./LimitsModal";

import {Button} from "@/app/components/form/Button";

import SVG_DIAMOND from '@/assets/images/icons/diamond.svg'
import SVG_DIAMOND_ACE from '@/assets/images/icons/diamond-ace.svg'


type PlanEntry = {
    name: NonNullable<PlanType>;
    icon: string;
    priceUSD: Record<PlanRecurrency, number>;
    benefits: string[];
}

const PLAN_TIME_RANGE: PlanRecurrency[] = ['Monthly', 'Annual'];
const PLANS: PlanEntry[] = [
    {
        name: 'Standard',
        icon: SVG_DIAMOND_ACE,
        priceUSD: {Monthly: 10, Annual: 8},
        benefits: [
            'Create and manage one AR code',
            '100 scans per month',
            'Detailed scan analytics',
            'Custom personalization features',
            'Data import and export',
        ]
    },
    {
        name: 'Pro',
        icon: SVG_DIAMOND,
        priceUSD: {Monthly: 50, Annual: 40},
        benefits: [
            'Manage up to 5 AR codes',
            '1,000 scans per month',
            'AR code design customization',
            'Video support up to 30 seconds',
            'Access to dedicated support team'
        ]
    }
]

const PricingView: FC = () => {
    const router = useRouter();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [selectedPlanTime, setSelectedPlanTime] = useState<PlanRecurrency>('Monthly');

    const handleSubmitClick = () => {
        if (!userCtx.isLoggedIn) {
            const info = 'You must have a TernKey account to manage saved codes. Please create an account below.';
            return modalCtx.openModal(<AuthModal info={info}/>);
        }

        navigate(SectionsEnum.Subscribe, router);
    }

    const showBillingModal = () => {
        const BillingModal = () => (
            <div className={'flex flex-col items-center w-[26.31rem]'}>
                <span className={'mb-[1.22rem]'}>Email: brc@tern.ac</span>
                <span>Phone: +1 (914) 306-5528</span>
            </div>
        );
        modalCtx.openModal(<BillingModal/>, {title: 'Billing Resolution Center', isSimple: false});
    }

    const showLimitsModal = () =>
        modalCtx.openModal(<LimitsModal/>, {title: 'Limits Apply'});


    const BillingResolution = (
        <span
            className={'underline cursor-pointer'}
            onClick={() => showBillingModal()}
        >
            billing resolution center
        </span>
    );

    const Columns: ReactElement[] = PLANS.map((plan: PlanEntry, index) => {
        const Benefits: ReactElement[] = plan.benefits.map((benefit, subIndex) => {
            let listInsideRule = 'list-image-[url("../assets/images/icons/bullet.svg")]';
            if (plan.name === 'Pro')
                listInsideRule = 'list-image-[url("../assets/images/icons/star.svg")]';

            return (
                <li
                    key={plan.name + subIndex}
                    className={`list-inside ${listInsideRule}`}
                >
                    {benefit}
                </li>
            );
        });

        if (index) {
            const Additional = (
                <div className={''}>
                    <span>Everything in {PLANS[index - 1].name}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const isAnnualOption = selectedPlanTime === 'Annual';
        const isMonthlyPlan = userCtx.userData?.planRecurrency === 'Monthly';
        const isCurrentPlan = userCtx.userData?.planType === plan.name;
        const isCurrentReccurency = userCtx.userData?.planRecurrency === selectedPlanTime;
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

        if (!userCtx.userData?.planType) {
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
                    subscribeBtnText = `${index ? 'Up' : 'Down'}grade to ` + PLANS[index].name;
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
                key={plan.name}
                className={`flex flex-col flex-grow p-[--py] w-[25.125rem] max-h-[35.21rem] rounded-[0.5625rem] border-small border-control3 bg-control text-left text-primary leading-none`}
            >
                <h2 className={'flex mb-[0.95rem] font-oxygen text-header font-bold'}>
                    <Image src={plan.icon} alt={plan.name + ' icon'} className={'mr-[0.32rem]'}/>
                    <span>{plan.name}</span>
                </h2>
                <div className={'text-secondary mb-[2.2rem] text-[1.25rem]'}>
                    <span>
                        ${plan.priceUSD[selectedPlanTime]}/month{isAnnualOption ? '*' : null}
                    </span>
                </div>
                <Button
                    btnType={'button'}
                    onClick={() => handleSubmitClick()}
                    className={`bg-control3 font-bold disabled:bg-inherit disabled:border-small disabled:border-control disabled:text-secondary`}
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

    const SwitchOptions: ReactElement[] = PLAN_TIME_RANGE.map((entry) => (
            <div
                key={entry}
                className={`px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold leading-none ${selectedPlanTime === entry ? 'bg-control2' : 'text-secondary'}`}
                onClick={() => setSelectedPlanTime(entry)}
            >
                {entry}
            </div>
        )
    );

    const BillingResolutionBlock = !userCtx.userData?.planType
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
                    {SwitchOptions}
                </div>
                <div className={'flex place-self-center gap-[4.13rem] mt-[3.12rem]'}>
                    {Columns}
                </div>
            </div>
            {BillingResolutionBlock}
        </>
    )
}

export {PricingView}