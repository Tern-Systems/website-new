import {FC} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {DocumentationScreen} from "@/app/ui/templates";


const DOCUMENTATION_CONTENTS: Record<Route.ServiceUserManual, DocumentationContent> = {
    [Route.ServiceUserManual]: COMING_SOON_DOC,
}


const UserManualPage: FC = () => <DocumentationScreen contents={DOCUMENTATION_CONTENTS}/>;


export default UserManualPage;