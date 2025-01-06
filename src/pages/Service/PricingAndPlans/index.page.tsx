import {FC, useEffect, useState} from "react";

import {SubscriptionPreview} from "@/app/types/subscription";

import {PricingAndPlansScreen} from "@/app/ui/templates";

import SVG_DIAMOND_ACE from "@/assets/images/icons/diamond-ace.svg";
import SVG_DIAMOND from "@/assets/images/icons/diamond.svg";
import {Route} from "@/app/static";


const PLAN_TEMPLATE: SubscriptionPreview = {
    subscription: 'ARCH',
    isBasicKind: false,
    route: Route.ServiceSubscribe,
    type: {
        standard: {
            icon: SVG_DIAMOND_ACE,
            priceUSD: {monthly: 10, annual: 8},
            benefits: [
                'Create and manage one AR code',
                '100 scans per month',
                'Detailed scan analytics',
                'Custom personalization features',
                'Data import and export',
            ]
        },
        pro: {
            icon: SVG_DIAMOND,
            priceUSD: {monthly: 50, annual: 40},
            benefits: [
                'Manage up to 5 AR codes',
                '1,000 scans per month',
                'AR code design customization',
                'Video support up to 30 seconds',
                'Access to dedicated support team'
            ]
        }
    }
}


const PricingAndPlansPage: FC = () => {
    const [subscription, setSubscription] = useState<SubscriptionPreview | null>(null);

    useEffect(() => {
        try {
            // TODO fetch plan details
            setSubscription(PLAN_TEMPLATE);
        } catch (error: unknown) {
        }
    }, []);

    return <PricingAndPlansScreen subscriptionData={subscription}/>;
}


export default PricingAndPlansPage;