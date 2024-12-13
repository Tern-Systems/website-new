import React, {Dispatch, FC, PropsWithChildren, SetStateAction, useEffect} from "react";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout/Link";


interface Props extends PropsWithChildren {
    setHeadingsHidden?: Dispatch<SetStateAction<boolean>>;
    backButtonSection: Route;
}

const FullPageLayout: FC<Props> = (props: Props) => {
    const {children, setHeadingsHidden, backButtonSection} = props;


    useEffect(() => {
        setHeadingsHidden?.(true);
    }, [setHeadingsHidden])

    return (
        <div
            className={'relative font-oxygen text-form h-full bg-control4 text-[1.3125rem] overflow-y-scroll'}>
            <PageLink
                href={backButtonSection}
                icon={'back'}
                className={'absolute top-[1.7rem] left-[1.83rem] font-oxygen font-bold'}
            />
            {children}
        </div>
    )
}

export {FullPageLayout}