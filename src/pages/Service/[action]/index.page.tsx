import {useParams} from "next/navigation";

import {ARCodeTool} from "@/app/ui/templates";


const ARCodeToolPage = () => {
    const {id} = useParams() as { id: string } ?? {};
    return <ARCodeTool editID={id}/>;
}


export default ARCodeToolPage;