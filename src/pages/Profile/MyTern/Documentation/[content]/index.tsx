import React, {FC} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {useLoginCheck} from "@/app/hooks";

import {DocumentationScreenTool} from "@/app/ui/templates/DocumentationScreen";
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


const DocumentationPage: FC = () => {
    const isLoggedIn = useLoginCheck();
    return isLoggedIn ? <DocumentationScreenTool contents={CONTENTS}/> : null;
};


export default DocumentationPage;