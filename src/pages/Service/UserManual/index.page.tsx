import React, {FC, ReactElement} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {DocumentationScreen} from "@/app/ui/templates";
import {DocumentationMobileLayout} from "@/app/ui/layout/DocumentationMobile";
import DocumentationPage from "@/pages/Profile/MyTern/Documentation/[content]/index.page";


const DOCUMENTATION_CONTENTS: Record<Route.ServiceUserManual, DocumentationContent> = {
    [Route.ServiceUserManual]: COMING_SOON_DOC,
}


const UserManualPage: FC = () => <DocumentationScreen contents={DOCUMENTATION_CONTENTS}/>;


DocumentationPage.getMobileLayout = (page: ReactElement) => (
    <DocumentationMobileLayout>{page}</DocumentationMobileLayout>
);

export default UserManualPage;