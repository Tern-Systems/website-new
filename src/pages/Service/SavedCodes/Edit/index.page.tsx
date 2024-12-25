import {FC, useEffect, useState} from "react";

import {ARCode} from "@/app/types/arcode";

import {useLoginCheck} from "@/app/hooks";

import {ARCodeTool} from "@/app/ui/templates";


const EditCodePage: FC = () => {
    const isLoggedIn = useLoginCheck();

    const [arCode, setArCode] = useState<ARCode>();


    useEffect(() => {
        const arCode = sessionStorage.getItem('qr-code-edit');
        if (arCode)
            setArCode(JSON.parse(arCode) as ARCode);
    }, []);

    return isLoggedIn ? <ARCodeTool arCode={arCode}/> : null;
}

export default EditCodePage;

