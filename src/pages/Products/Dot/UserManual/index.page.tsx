import React, {ReactElement} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {useLoginCheck} from "@/app/hooks";

import {DocumentationScreen} from "@/app/ui/templates";
import {DocumentationMobileLayout} from "@/app/ui/layout/DocumentationMobile";


const DOCUMENTATION_CONTENTS: Record<Route.DotProductManual, DocumentationContent> = {
    [Route.DotProductManual]: COMING_SOON_DOC,
}

function UserManualPage() {
    const isLoggedIn = useLoginCheck();
    return isLoggedIn ? <DocumentationScreen contents={DOCUMENTATION_CONTENTS}/> : null;
}


UserManualPage.getMobileLayout = (page: ReactElement) => (
    <DocumentationMobileLayout>{page}</DocumentationMobileLayout>
);

export default UserManualPage;