"use client";

import React, {FC, ReactElement, useEffect, useState} from "react";

import {Subscription} from "@/app/types/subscription";
import {Route} from "@/app/static";

import {useLoginCheck} from "@/app/hooks";

import {FullPageLayout} from "@/app/ui/layout";
import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";


const SubscribePage: FC = () => {
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
        <div className={'flex font-oxygen text-gray h-full'}>
            <PaymentInfo subscription={subscription}/>
            <PaymentForm
                type={subscription?.type}
                recurrency={subscription?.recurrency}
                priceUSD={subscription?.priceUSD}
            />
        </div>
    );
}

SubscribePage.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.ServicePricing}>{page}</FullPageLayout>
);


export default SubscribePage;