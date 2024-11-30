"use client";

import {FC, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";

import {PlanRecurrency, PlanType, useFlow, useModal} from "@/app/context";
import {useNavigate} from "@/app/hooks/useNavigate";

import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";
import {DeclinedModal} from "./DeclinedModal";

import {Button} from "@/app/components/form";

const SubscribeView: FC = () => {
    const flowCtx = useFlow();
    const [navigate] = useNavigate();
    const params = useSearchParams();
    const modalCtx = useModal();

    const planType = params.get('plan-type') as NonNullable<PlanType>;
    const reccurency = params.get('reccurency') as PlanRecurrency;

    const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);

    useEffect(() => {
        if (paymentStatus === false)
            modalCtx.openModal(<DeclinedModal onClose={() => setPaymentStatus(null)}/>);
        else if (paymentStatus) {
            const next = flowCtx.next();
            if (next)
                return next();
            navigate(SectionsEnum.Home);
        }
    }, [paymentStatus, modalCtx, flowCtx, setPaymentStatus, navigate]);

    return (
        <div className={'flex font-oxygen text-form h-full'}>
            <Button
                icon={'back'}
                onClick={() => navigate(SectionsEnum.Pricing, navigate)}
                className={'absolute left-[--px] top-[1.7rem] p-0 font-oxygen font-bold text-[1.3125rem]'}
            >
                {SectionsEnum.Pricing}
            </Button>
            <PaymentInfo planType={planType} reccurency={reccurency}/>
            <PaymentForm setPaymentStatus={setPaymentStatus}/>
        </div>
    );
};

export {SubscribeView}