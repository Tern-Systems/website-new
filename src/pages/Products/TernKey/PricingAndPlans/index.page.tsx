import { FC, useEffect, useState } from "react";

import { SubscriptionPreview } from "@/app/types/subscription";

import { PricingAndPlansScreen } from "@/app/ui/templates";
import { useUser } from "@/app/context";
import SVG_DIAMOND_ACE from "@/assets/images/icons/diamond-ace.svg";
import SVG_DIAMOND from "@/assets/images/icons/diamond.svg";
import { BillingService } from "@/app/services";
import { UserSubscription } from "@/app/context/User.context";

const PLAN_TEMPLATE: SubscriptionPreview = {
  subscription: "arch",
  isBasicKind: true,
  type: {
    basic: {
      icon: SVG_DIAMOND_ACE,
      priceUSD: { monthly: 0, annual: 0 },
      benefits: [
        "Create and manage one AR code",
        "100 scans per month",
        "Detailed scan analytics",
        "Custom personalization features",
        "Data import and export",
      ],
    },
    pro: {
      icon: SVG_DIAMOND,
      priceUSD: { monthly: 50, annual: 40 },
      benefits: [
        "Manage up to 5 AR codes",
        "1,000 scans per month",
        "AR code design customization",
        "Video support up to 30 seconds",
        "Access to dedicated support team",
      ],
    },
  },
};

const PricingAndPlansPage: FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionPreview | null>(
    null
  );
  const { userData } = useUser();
  const userCtx = useUser();
  useEffect(() => {
    try {
      // TODO fetch plan details
      const fetchPlanDetails = async () => {
        if (!userCtx.userData) return;
        const email = userCtx.userData.email;
        try {
          const response = await BillingService.getPlanDetails(email);
          const subscription: any = [
            {
              type: response.currentPlan == "standard" ? "basic" : "pro",
              recurrency: response.duration == 1 ? "monthly" : "yearly",
              isBasicKind: true,
              subscription: "arch",
            },
          ];

          const token = localStorage.getItem("token");
          if (token != null && userCtx.userData.subscriptions == null) {
            userCtx.setSession(
              { ...userCtx.userData, subscriptions: subscription },
              token
            );
          }
        } catch (error: unknown) {}
      };
      fetchPlanDetails();
      setSubscription(PLAN_TEMPLATE);
    } catch (error: unknown) {}
  }, [userCtx]);

  return (
    <>
      {userCtx.userData?.subscriptions && (
        <PricingAndPlansScreen subscriptionData={subscription} />
      )}
    </>
  );
};

export default PricingAndPlansPage;
