import React, {ReactElement} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {CONTENTS} from "@/pages/Profile/MyTern/Documentation/[content]/index.page";

import {DocumentationScreen} from "@/app/ui/templates";
import {DocumentationMobileLayout} from "@/app/ui/layout/DocumentationMobile";


const DOCUMENTATION_CONTENTS: Record<Route.ServiceUserManual, DocumentationContent> = {
    [Route.ServiceUserManual]: CONTENTS[Route.ARCHManual],
}


function UserManualPage() {
    return <DocumentationScreen contents={DOCUMENTATION_CONTENTS}/>;
}


UserManualPage.getMobileLayout = (page: ReactElement) => (
    <DocumentationMobileLayout>{page}</DocumentationMobileLayout>
);

export default UserManualPage;