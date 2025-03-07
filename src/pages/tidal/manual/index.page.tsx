import React from 'react';

import { DocumentationContent } from '@/app/types/documentation';
import { Route } from '@/app/static';

import { CONTENTS } from '@/pages/support/documentation/[content]/index.page';

import { DocumentationSection } from '@/app/ui/templates';

const DOCUMENTATION_CONTENTS: Record<Route.TidalProductManual, DocumentationContent> = {
    [Route.TidalProductManual]: CONTENTS[Route.TidalDoc],
};

function UserManualPage() {
    return <DocumentationSection contents={DOCUMENTATION_CONTENTS} />;
}

export default UserManualPage;
