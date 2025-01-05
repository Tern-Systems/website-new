import React, {ReactElement} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {useLoginCheck} from "@/app/hooks";

import {DocumentationMobileLayout} from "@/app/ui/layout/DocumentationMobile";
import {DocumentationScreen} from "@/app/ui/templates/DocumentationScreen";
import {TernKeyManualAnchors, TernKeyManualContent} from "./TernKeyManual";
import {GHandbookAnchors, GHandbookContent} from "./GHandbook";


type Content =
    | Route.TernKeyManual
    | Route.GHandbook
    | Route.ARHostingManual
    | Route.TernKitManual
    | Route.TernHandbook
    | Route.ARCHManual
    | Route.BTMCHandbook;

const CONTENTS: Record<Content, DocumentationContent> = {
    [Route.TernKeyManual]: {anchors: TernKeyManualAnchors, children: <TernKeyManualContent/>},
    [Route.GHandbook]: {anchors: GHandbookAnchors, children: <GHandbookContent/>, isChapter: true},
    [Route.ARHostingManual]: COMING_SOON_DOC,
    [Route.TernKitManual]: COMING_SOON_DOC,
    [Route.TernHandbook]: COMING_SOON_DOC,
    [Route.ARCHManual]: COMING_SOON_DOC,
    [Route.BTMCHandbook]: COMING_SOON_DOC,
}


function DocumentationPage() {
    const isLoggedIn = useLoginCheck();
    return isLoggedIn ? <DocumentationScreen contents={CONTENTS}/> : null;
};


DocumentationPage.getMobileLayout = (page: ReactElement) => (
    <DocumentationMobileLayout>{page}</DocumentationMobileLayout>
);

export {CONTENTS};
export default DocumentationPage;
