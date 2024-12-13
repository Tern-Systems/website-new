import {useParams} from "next/navigation";

import {ARCodeTool} from "@/app/ui/templates";


const ARCodeToolPage = () => {
    const {action} = useParams() as { action: string };
    return <ARCodeTool isEditMode={action === 'edit'}/>;
}

export default ARCodeToolPage;