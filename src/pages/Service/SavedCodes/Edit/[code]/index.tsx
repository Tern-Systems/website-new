import {FC} from "react";
import {useParams} from "next/navigation";

import {useLoginCheck} from "@/app/hooks";

import {ARCodeTool} from "@/app/ui/templates";


const EditCodePage: FC = () => {
    const {code} = useParams() as { code: string } ?? {};
    const isLoggedIn = useLoginCheck();
    return isLoggedIn ? <ARCodeTool editID={code}/> : null;
}

export default EditCodePage;

