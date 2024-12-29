"use client";

import React, {ReactElement, useEffect, useState} from "react";

import {Subscription} from "@/app/types/subscription";
import {Route} from "@/app/static";

import {useLoginCheck} from "@/app/hooks";

import {FullScreenLayout} from "@/app/ui/layout";
import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";


function SubscribePage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const isLoggedIn = useLoginCheck();


    useEffect(() => {
        const subscriptionData = sessionStorage.getItem('subscription');
        if (subscriptionData)
            setSubscription(JSON.parse(subscriptionData) as Subscription);
    }, [])

    if (!isLoggedIn)
        return null;

    return (
        <div className={'flex font-oxygen text-gray h-full sm:flex-col'}>
            <PaymentInfo subscription={subscription}/>
            <hr className={'my-[--1hdr] border-control-gray-l0'}/>
            <PaymentForm
                type={subscription?.type}
                recurrency={subscription?.recurrency}
                priceUSD={subscription?.priceUSD}
            />
        </div>
    );
}

SubscribePage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.ServicePricing}>{page}</FullScreenLayout>
);
SubscribePage.getMobileLayout = SubscribePage.getLayout;

export default SubscribePage;