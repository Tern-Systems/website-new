import {FC, ReactElement, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {handleLinkClick} from "@/app/utils/router";

import {ModalProps} from "@/app/context/Modal.context";

import {withBaseModal} from "@/app/hocs/withBaseModal";

import {SignUpModalBase} from "@/app/components/modals/SignUp";

import {Button} from "@/app/components/form/Button";


import SVG_DIAMOND from '@/assets/images/icons/diamond.svg'
import SVG_DIAMOND_ACE from '@/assets/images/icons/diamond-ace.svg'


type PlanTimeRange = 'Monthly' | 'Annual';
type Plan = 'Standard' | 'Pro';
type PlanEntry = {
    name: Plan;
    icon: string;
    priceUSD: Record<PlanTimeRange, number>;
    benefits: string[];
}

const PLAN_TIME_RANGE: PlanTimeRange[] = ['Monthly', 'Annual'];
const PLAN: PlanEntry[] = [
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

const PricingModal: FC<ModalProps> = (props: ModalProps) => {
    const [selectedPlanTime, setSelectedPlanTime] = useState<PlanTimeRange>('Monthly');

    const handleSubmitClick = () => {
        if (!props.userCtx?.isLoggedIn) {
            const info = 'You must have a TernKey account to manage saved codes. Please create an account below.';
            const SignUpModal: FC<ModalProps> = withBaseModal(
                <SignUpModalBase info={info} openModal={props.openModal}/>,
                'Create Account'
            );
            return props.openModal(SignUpModal);
        }

        handleLinkClick(SectionsEnum.Subscribe, props.router);
    }



    const Columns: ReactElement[] = PLAN.map((plan: PlanEntry, index) => {
        const Benefits: ReactElement[] = plan.benefits.map((benefit, index) => {
            let listInsideRule = 'list-image-[url("../assets/images/icons/bullet.svg")]';
            if (plan.name === 'Pro')
                listInsideRule = 'list-image-[url("../assets/images/icons/star.svg")]';

            return (
                <li
                    key={plan.name + index}
                    className={`list-inside ${listInsideRule}`}
                >
                    {benefit}
                </li>
            );
        });

        if (index) {
            const Additional = (
                <div className={''}>
                    <span>Everything in {PLAN[index - 1].name}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const isAnnual = selectedPlanTime === 'Annual';

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
                        ${plan.priceUSD[selectedPlanTime]}/month{isAnnual ? '*' : null}
                    </span>
                </div>
                <Button
                    btnType={'button'}
                    onClick={() => handleSubmitClick()}
                    className={'bg-control3'}
                >
                    Subscribe
                </Button>
                <ul className={'flex flex-col gap-[1.5rem] mt-[1.56rem]'}>{Benefits}</ul>
                <div
                    className={'flex flex-col mt-[2.07rem] font-oxygen text-[0.75rem] text-secondary flex-grow justify-end'}>
                    {isAnnual ? <span className={'mb-[0.44rem]'}>*Price billed annually</span> : null}
                    <span
                        className={'underline cursor-pointer'}
                    >
                        Limits apply
                    </span>
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
            <div className={'flex mt-[--py]'}>
                <span
                    className={'font-oxygen text-[0.75rem] text-secondary self-end'}
                >
                    Have an existing plan? See the <span className={'underline cursor-pointer'}>billing resolution center</span>
                </span>
            </div>
        </>
    )
}

export {PricingModal}