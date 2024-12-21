import React, {ReactElement} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {DocumentationScreen} from "@/app/ui/templates";
import {DocumentationMobileLayout} from "@/app/ui/layout/DocumentationMobile";


const DOCUMENTATION_CONTENTS: Record<Route.ProductUserManual, DocumentationContent> = {
    [Route.ProductUserManual]: COMING_SOON_DOC,
}


function UserManualPage () {
    return <DocumentationScreen contents={DOCUMENTATION_CONTENTS}/>;
}


UserManualPage.getMobileLayout = (page: ReactElement) => (
    <DocumentationMobileLayout>{page}</DocumentationMobileLayout>
);

export default UserManualPage;