import React, {ReactElement} from "react";

import {Route} from "@/app/static";

import {FullPageLayout} from "@/app/ui/layout";
import {PaymentMethodTool} from "@/app/ui/templates";


function EditPurchasingInfoPage() {
    return <PaymentMethodTool/>;
}

EditPurchasingInfoPage.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.PurchasingInformation}>{page}</FullPageLayout>
);


export default EditPurchasingInfoPage;
