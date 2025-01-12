import React, {FC, useEffect, useState} from "react";

import {ARCode} from "@/app/types/arcode";

import {useLoginCheck} from "@/app/hooks";

import {ARCodeTool} from "@/app/ui/templates";


const EditCodePage: FC = () => {
    const isLoggedIn = useLoginCheck();

    const [arCode, setArCode] = useState<ARCode>();


    useEffect(() => {
        const arCodeStr = sessionStorage.getItem('qr-code-edit');
        if (!arCodeStr)
            return;
        const arCode = JSON.parse(arCodeStr) as ARCode;
        const arCodeEdit: ARCode = {
            ...arCode,
            videoPath: arCode.videoPath.split('/').pop() ?? '',
        }
        setArCode(arCodeEdit);
    }, []);

    return isLoggedIn ? <ARCodeTool arCode={arCode}/> : null;
}

export default EditCodePage;
