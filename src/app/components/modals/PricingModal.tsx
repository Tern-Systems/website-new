import {FC, ReactElement, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {handleLinkClick} from "@/app/utils/router";

import {ModalProps} from "@/app/context/Modal.context";

import {Button} from "@/app/components/form/Button";
import {SignUpModal} from "@/app/components/modals/SignUp";

import SVG_DIAMOND from '@/assets/images/icons/diamond.svg'
import SVG_DIAMOND_ACE from '@/assets/images/icons/diamond-ace.svg'


type PlanTimeRange = 'Monthly' | 'Annual';
type Plan = 'Standard' | 'Pro';
type PlanEntry = {
    name: Plan;
    icon: string;
    priceUSD: Record<PlanTimeRange, number>;
    benefits: string[];
    notes: {
        info?: string,
        link?: {
            title: string,
            link: SectionsEnum
        }
    }
}

const PLAN_TIME_RANGE: PlanTimeRange[] = ['Monthly', 'Annual'];
const PLAN: PlanEntry[] = [
    {
        name: 'Standard',
        icon: SVG_DIAMOND_ACE,
        priceUSD: {Monthly: 10, Annual: 100},
        benefits: [
            'Create and manage one AR code',
            '100 scans per month',
            'Detailed scan analytics',
            'Custom personalization features',
            'Data import and export',
        ],
        notes: {
            info: 'Have an existing plan? See the ',
            link: {
                title: 'billing resolution center',
                link: SectionsEnum.Subscribe // TODO
            }
        }
    },
    {
        name: 'Pro',
        icon: SVG_DIAMOND,
        priceUSD: {Monthly: 50, Annual: 550},
        benefits: [
            'Create and manage one AR code',
            '100 scans per month',
            'Detailed scan analytics',
            'Custom personalization features',
            'Data import and export',
        ],
        notes: {
            link: {
                title: 'Limits apply',
                link: SectionsEnum.Subscribe // TODO
            }
        }
    }
]

const PricingModal: FC<ModalProps> = (props: ModalProps) => {
    const [selectedPlanTime, setSelectedPlanTime] = useState<PlanTimeRange>('Monthly');

    const handleSubmitClick = () => {
        if (!props.userCtx?.isLoggedIn)
            return props.openModal(SignUpModal);

        handleLinkClick(SectionsEnum.Subscribe, props.router);
    }

    const Columns: ReactElement[] = PLAN.map((plan: PlanEntry) => {
        const {info, link} = plan.notes;

        const Benefits: ReactElement[] = plan.benefits.map((benefit, index) => (
            <li
                key={plan.name + index}
                className={`list-inside list-image-[url("../assets/images/icons/${plan.name === 'Standard' ? 'bullet' : 'star'}.svg")]`}
            >
                {benefit}
            </li>
        ));

        return (
            <div
                key={plan.name}
                className={`p-[--py] w-[30.31rem] rounded-[0.5625rem] border-small border-control3 bg-control text-primary leading-none`}
            >
                <h2 className={'flex mb-[0.95rem] font-oxygen text-header font-bold'}>
                    <Image src={plan.icon} alt={plan.name + ' icon'} className={'mr-[0.32rem]'}/>
                    <span>{plan.name}</span>
                </h2>
                <div className={'text-secondary mb-[2.2rem] text-[1.25rem]'}>
                    <span>${plan.priceUSD[selectedPlanTime]}/month</span></div>
                <Button
                    btnType={'button'}
                    onClick={() => handleSubmitClick()}
                    className={'bg-control3'}
                >
                    Subscribe
                </Button>
                <ul className={'flex flex-col gap-[2.5rem] mt-[1.56rem] mb-[6.21rem]'}>{Benefits}</ul>
                <div className={'font-oxygen text-[0.75rem] text-secondary'}>
                    <span>{info}</span>
                    <span
                        className={'underline cursor-pointer'}
                        onClick={() => link?.link && handleLinkClick(link.link, props.router)}
                    >
                        {link?.title}
                    </span>
                </div>
            </div>
        )
    });

    const SwitchOptions: ReactElement[] = PLAN_TIME_RANGE.map((entry) => (
            <div
                key={entry}
                className={`px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold ${selectedPlanTime === entry ? 'bg-control2' : 'text-secondary'}`}
                onClick={()=> setSelectedPlanTime(entry)}
            >
                {entry}
            </div>
        )
    );
    const Switch = (
        <div className={'flex place-self-center mb-[3.12rem] p-[0.19rem] border-small rounded-full text-small'}>
            {SwitchOptions}
        </div>
    )

    return (
        <>
            {Switch}
            <div className={'flex gap-[4.13rem]'}>
                {Columns}
            </div>
        </>
    )
}

export {PricingModal}