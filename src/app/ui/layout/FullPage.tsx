import React, {FC, PropsWithChildren} from "react";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout/Link";


interface Props extends PropsWithChildren {
    backButtonSection: Route;
}

const FullPageLayout: FC<Props> = (props: Props) => {
    const {children, backButtonSection} = props;


    return (
        <div className={"h-dvh max-h-dvh relative"}>
            <div
                className={'relative font-oxygen text-gray h-full bg-control-white text-content overflow-y-scroll'}>
                <PageLink
                    href={backButtonSection}
                    icon={'back'}
                    className={'absolute top-[1.7rem] left-[1.8rem] font-oxygen font-bold'}
                />
                {children}
            </div>
        </div>
    );
}

export {FullPageLayout}