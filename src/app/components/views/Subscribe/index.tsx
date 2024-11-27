"use client";

import {FC, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";

import {navigate} from "@/app/utils/router";

import {PlanRecurrency, PlanType} from "@/app/context/User.context";

import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";
import {DeclinedModal} from "./DeclinedModal";

import {Button} from "@/app/components/form/Button";
import {useModal} from "@/app/context/Modal.context";

const SubscribeView: FC = () => {
    const router = useRouter();
    const params = useSearchParams();
    const modalCtx = useModal();

    const planType = params.get('plan-type') as NonNullable<PlanType>;
    const reccurency = params.get('reccurency') as PlanRecurrency;

    const [isPaymentDeclined, setPaymentDeclined] = useState<boolean>(false);

    useEffect(() => {
        if (isPaymentDeclined)
            modalCtx.openModal(<DeclinedModal onClose={() => setPaymentDeclined(false)}/>)
    }, [isPaymentDeclined]);

    return (
        <div className={'flex font-oxygen text-form h-full'}>
            <Button
                icon={'back'}
                onClick={() => navigate(SectionsEnum.Pricing, router)}
                className={'absolute left-[--px] top-[1.7rem] p-0 font-oxygen font-bold text-[1.3125rem]'}
            >
                {SectionsEnum.Pricing}
            </Button>
            <PaymentInfo planType={planType} reccurency={reccurency}/>
            <PaymentForm setPaymentDeclined={setPaymentDeclined}/>
        </div>
    );
};

export {SubscribeView}