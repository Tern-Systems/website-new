import {FC} from "react";

import {DocumentationContent} from "@/app/types/documentation";
import {Route} from "@/app/static";
import {COMING_SOON_DOC} from "@/app/static/documentation";

import {DocumentationScreenTool} from "@/app/ui/templates";


type Content = Route.ServiceUserManual;

const DOCUMENTATION_CONTENTS: Record<Content, DocumentationContent> = {
    [Route.ServiceUserManual]: COMING_SOON_DOC,
}


const UserManualPage: FC = () => <DocumentationScreenTool contents={DOCUMENTATION_CONTENTS}/>;


export default UserManualPage;