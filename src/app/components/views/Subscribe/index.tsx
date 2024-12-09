"use client";

import React, {FC} from "react";
import {useSearchParams} from "next/navigation";

import {PlanRecurrency, PlanType} from "@/app/context";

import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";


const SubscribeView: FC = () => {
    const params = useSearchParams();

    const planType = params.get('plan-type') as NonNullable<PlanType>;
    const recurrency = params.get('recurrency') as PlanRecurrency;

    return (
        <div className={'flex font-oxygen text-form h-full'}>
            <PaymentInfo planType={planType} recurrency={recurrency}/>
            <PaymentForm planType={planType} recurrency={recurrency}/>
        </div>
    );
};

export {SubscribeView}