import React, {ReactElement} from "react";
import {useParams} from "next/navigation";

import {Route} from "@/app/static";

import {FullScreenLayout} from "@/app/ui/layout";
import {PaymentMethodTool} from "@/app/ui/templates";


function PurchasingMethodPage() {
    const {action} = useParams() as { action: string } ?? {};
    return <PaymentMethodTool isPaymentCreation={action === 'Add'}/>;
}

PurchasingMethodPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.PurchasingInformation}>{page}</FullScreenLayout>
);


export default PurchasingMethodPage;
