import React, {FC, useEffect, useState} from "react";

import {SubscriptionBase} from "@/app/types/subscription";
import {useLoginCheck} from "@/app/hooks";

import {PaymentInfo} from "./PaymentInfo";
import {PaymentForm} from "./PaymentForm";


const SubscribeTool: FC = () => {
    const [subscription, setSubscription] = useState<SubscriptionBase | null>(null);
    const isLoggedIn = useLoginCheck();


    useEffect(() => {
        const subscriptionData = sessionStorage.getItem('subscription');
        if (subscriptionData)
            setSubscription(JSON.parse(subscriptionData) as SubscriptionBase);
    }, [])

    if (!isLoggedIn)
        return null;

    return (
        <div className={`flex h-full font-oxygen text-gray
                            text-heading-s
                            sm:x-[text-basic,flex-col]`}>
            <PaymentInfo subscription={subscription}/>
            <PaymentForm
                type={subscription?.type}
                recurrency={subscription?.recurrency}
                priceUSD={subscription?.priceUSD}
            />
        </div>
    );
}


export {SubscribeTool};
