import React from 'react';

import { DocumentationContent } from '@/app/types/documentation';
import { Route } from '@/app/static';
import { COMING_SOON_DOC } from '@/app/static/documentation';

import { DocumentationSection } from '@/app/ui/templates';

import { TidalManualAnchors, TidalManualContent } from './tidal';
import { GHandbookAnchors, GHandbookContent } from './g';

type Content = Route.TidalDoc | Route.GDoc | Route.TernKitDoc | Route.TernDoc | Route.BTMCDoc;

const CONTENTS: Record<Content, DocumentationContent> = {
    [Route.TidalDoc]: {
        anchors: TidalManualAnchors,
        children: <TidalManualContent />,
    },
    [Route.GDoc]: {
        anchors: GHandbookAnchors,
        children: <GHandbookContent />,
        isChapter: true,
    },
    [Route.TernKitDoc]: COMING_SOON_DOC,
    [Route.TernDoc]: COMING_SOON_DOC,
    [Route.BTMCDoc]: COMING_SOON_DOC,
};

function DocumentationPage() {
    return <DocumentationSection contents={CONTENTS} />;
}

export { CONTENTS };
export default DocumentationPage;
