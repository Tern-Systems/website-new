import React, {FC, PropsWithChildren} from "react";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout/Link";
import {useLayout} from "@/app/context";

import styles from "@/app/common.module.css";


interface Props extends PropsWithChildren {
    backButtonSection: Route;
}

const FullScreenLayout: FC<Props> = (props: Props) => {
    const {children, backButtonSection} = props;
    const layoutCtx = useLayout();

    return (
        <div className={"h-dvh max-h-dvh relative font-oxygen text-gray bg-control-white text-content"}>
            <div className={`relative h-full overflow-y-scroll ${layoutCtx.isFade ? styles.fadeOut : styles.fadeIn}`}>
                <PageLink
                    href={backButtonSection}
                    icon={'back'}
                    className={'absolute z-50 top-[1.7rem] left-[1.8rem] font-oxygen font-bold sm:hidden'}
                />
                {children}
            </div>
        </div>
    );
}

export {FullScreenLayout}