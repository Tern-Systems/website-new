import {FC} from "react";
import {useParams} from "next/navigation";

import {ARCodeTool} from "@/app/ui/templates";


const EditCodePage: FC = () => {
    const {code} = useParams() as { code: string } ?? {};
    return <ARCodeTool editID={code}/>
}

export default EditCodePage;

