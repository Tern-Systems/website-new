import React, { ReactElement } from 'react';

import { DocumentationContent } from '@/app/types/documentation';
import { Route } from '@/app/static';
import { COMING_SOON_DOC } from '@/app/static/documentation';

import { DocumentationMobileLayout } from '@/app/ui/layout/DocumentationMobile';
import { DocumentationScreen } from '@/app/ui/templates/DocumentationScreen';

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
    return <DocumentationScreen contents={CONTENTS} />;
}

DocumentationPage.getMobileLayout = (page: ReactElement) => (
    <DocumentationMobileLayout>{page}</DocumentationMobileLayout>
);

export { CONTENTS };
export default DocumentationPage;
