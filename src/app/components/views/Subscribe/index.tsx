"use client";

import {FC} from "react";
import {useSearchParams} from "next/navigation";
import {SectionsEnum} from "@/app/utils/sections";

import {PlanRecurrency, PlanType} from "@/app/context";

import {useNavigate} from "@/app/hooks/useNavigate";

import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";

import {Button} from "@/app/components/form";

const SubscribeView: FC = () => {
    const [navigate] = useNavigate();
    const params = useSearchParams();

    const planType = params.get('plan-type') as NonNullable<PlanType>;
    const recurrency = params.get('recurrency') as PlanRecurrency;

    return (
        <div className={'flex font-oxygen text-form h-full'}>
            <Button
                icon={'back'}
                onClick={() => navigate(SectionsEnum.Pricing, navigate)}
                className={'absolute left-[--px] top-[1.7rem] p-0 font-oxygen font-bold text-[1.3125rem]'}
            >
                {SectionsEnum.Pricing}
            </Button>
            <PaymentInfo planType={planType} recurrency={recurrency}/>
            <PaymentForm planType={planType} recurrency={recurrency}/>
        </div>
    );
};

export {SubscribeView}