"use client";

import React, {ReactElement} from "react";
import {Route} from "@/app/static";

import {FullScreenLayout} from "@/app/ui/layout";
import {SubscribeTool} from "@/app/ui/templates";


function SubscribePage() {
    return <SubscribeTool/>;
}

SubscribePage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.ServicePricing}>{page}</FullScreenLayout>
);
SubscribePage.getMobileLayout = SubscribePage.getLayout;


export default SubscribePage;
