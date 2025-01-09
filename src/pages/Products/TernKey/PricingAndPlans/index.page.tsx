import {FC, useEffect, useState} from "react";

import {Route} from "@/app/static";
import {SubscriptionPreview} from "@/app/types/subscription";

import {useUser} from "@/app/context";

import {PricingAndPlansScreen} from "@/app/ui/templates";

import SVG_DIAMOND from "@/assets/images/icons/diamond.svg";
import SVG_DIAMOND_ACE from "@/assets/images/icons/diamond-ace.svg";

const PLAN_TEMPLATE: SubscriptionPreview = {
  subscription: "TernKey",
  isBasicKind: true,
  route: Route.TernKeySubscribe,
  type: {
    Basic: {
      icon: SVG_DIAMOND_ACE,
      priceUSD: { monthly: 8, annual: 10 },
      benefits: [
        "Unlimited Key drafts",
        "10 daily Key compositions",
        "Access to standard G, TERN, and BTMC language capabilities",
        "Personalization features in settings",
        "Ability to import and export programs on your device",
      ],
    },
    Pro: {
      icon: SVG_DIAMOND,
      priceUSD: { monthly: 20, annual: 18 },
      benefits: [
        "Access to Explore Keys",
        "Unlimited daily Key compositions",
        "Access to sidebar with saved history",
        "Ability to save and publish Keys",
        "Early access to new features and updates",
      ],
    },
  },
};


const PricingAndPlansPage: FC = () => {
    const [subscription, setSubscription] = useState<SubscriptionPreview | null>(
        null
    );
    const {userData} = useUser();
    useEffect(() => {
        try {
            setSubscription(PLAN_TEMPLATE);
        } catch (error: unknown) {
        }
    }, []);

    return <PricingAndPlansScreen subscriptionData={subscription}/>;
};

export default PricingAndPlansPage;
