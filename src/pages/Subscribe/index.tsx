"use client";

import React, {ReactElement, useEffect, useState} from "react";

import {Subscription} from "@/app/types/subscription";
import {Route} from "@/app/static";

import {FullPageLayout} from "@/app/ui/layout";
import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";


function SubscribePage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        const subscriptionData = localStorage.getItem('subscription');
        if (subscriptionData)
            setSubscription(JSON.parse(subscriptionData) as Subscription);
    }, [])

    return (
        <div className={'flex font-oxygen text-form h-full'}>
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