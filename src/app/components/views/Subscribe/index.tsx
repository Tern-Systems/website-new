"use client";

import React, {FC, useEffect, useState} from "react";

import {Subscription} from "@/app/static/types";

import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";


const SubscribeView: FC = () => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        const subscriptionData = localStorage.getItem('subscription');
        if (subscriptionData)
            setSubscription(JSON.parse(subscriptionData) as Subscription);
    }, [])

    return (
        <div className={'flex font-oxygen text-form h-full'}>
            <PaymentInfo subscription={subscription}/>
            <PaymentForm type={subscription?.type} recurrency={subscription?.recurrency}
                         priceUSD={subscription?.priceUSD}/>
        </div>
    );
};

export {SubscribeView}