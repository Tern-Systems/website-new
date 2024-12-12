import React, {Dispatch, FC, PropsWithChildren, SetStateAction, useEffect} from "react";

import {SectionsEnum} from "@/app/static";

import {useNavigate} from "@/app/hooks";
import {Button} from "@/app/ui/form";


interface Props extends PropsWithChildren {
    setHeadingsHidden?: Dispatch<SetStateAction<boolean>>;
    backButtonSection: SectionsEnum;
}

const FullscreenViewWrapper: FC<Props> = (props: Props) => {
    const {children, setHeadingsHidden, backButtonSection} = props;

    const [navigate] = useNavigate();

    useEffect(() => {
        setHeadingsHidden?.(true);
    }, [setHeadingsHidden])

    return (
        <div
            className={'relative font-oxygen text-form h-full bg-control4 text-[1.3125rem] overflow-y-scroll'}>
            <Button
                icon={'back'}
                onClick={() => navigate(backButtonSection, navigate)}
                className={'absolute top-[1.7rem] left-[1.83rem] font-oxygen font-bold'}
            >
                {backButtonSection}
            </Button>
            {children}
        </div>
    )
}

export {FullscreenViewWrapper}