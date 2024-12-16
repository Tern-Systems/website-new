import React, {ReactElement} from "react";
import {useParams} from "next/navigation";

import {Route} from "@/app/static";

import {FullPageLayout} from "@/app/ui/layout";
import {PaymentMethodTool} from "@/app/ui/templates";


function AddPurchasingMethodPage() {
    const {type} = useParams() as { type: string };
    return <PaymentMethodTool isPaymentCreation={type === 'Add'}/>;
}

AddPurchasingMethodPage.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.PurchasingInformation}>{page}</FullPageLayout>
);


export default AddPurchasingMethodPage;
