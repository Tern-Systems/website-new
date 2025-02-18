import React from 'react';

import { DocumentationContent } from '@/app/types/documentation';
import { Route } from '@/app/static';
import { COMING_SOON_DOC } from '@/app/static/documentation';

import { DocumentationSection } from '@/app/ui/templates';

import { TernKeyManualAnchors, TernKeyManualContent } from './ternkey';
import { GHandbookAnchors, GHandbookContent } from './g';

type Content = Route.TernKeyDoc | Route.GDoc | Route.TernKitDoc | Route.TernDoc | Route.BTMCDoc;

const CONTENTS: Record<Content, DocumentationContent> = {
    [Route.TernKeyDoc]: { anchors: TernKeyManualAnchors, children: <TernKeyManualContent /> },
    [Route.GDoc]: { anchors: GHandbookAnchors, children: <GHandbookContent />, isChapter: true },
    [Route.TernKitDoc]: COMING_SOON_DOC,
    [Route.TernDoc]: COMING_SOON_DOC,
    [Route.BTMCDoc]: COMING_SOON_DOC,
};

function DocumentationPage() {
    return <DocumentationSection contents={CONTENTS} />;
}

export { CONTENTS };
export default DocumentationPage;
