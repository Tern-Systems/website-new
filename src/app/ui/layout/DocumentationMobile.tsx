import React, {FC, PropsWithChildren} from "react";

import {Route} from "@/app/static";

import {useBackground, useMenu} from "@/app/hooks";

import {Button} from "@/app/ui/form";
import {usePathname} from "next/navigation";
import {checkSubRoute} from "@/app/utils";


const DocumentationMobileLayout: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const {children} = props;

    const route = usePathname();
    const [openMenu] = useMenu(checkSubRoute(route, Route.Documentation));
    const bgSrc = useBackground();


    return (
        <div
            style={{backgroundImage: `url("${bgSrc}")`}}
            className={'h-dvh max-h-dvh p-[--p-content-s] font-neo text-primary bg-content bg-cover bg-no-repeat bg-fixed bg-bottom'}>
            <div className={`h-[3.05rem] flex items-center justify-end`}>
                <Button
                    onClick={() => openMenu()}
                    icon={'burger'}
                    className={`[&&_*]:size-[1.8rem] absolute z-40 pl-[0.9rem] border-l-small border-control-gray-l0 before:h-[2.25rem]`}
                />
            </div>
            <div className={`flex-col flex-grow h-[calc(100%-3.05rem)]`}>
                {children}
            </div>
        </div>
    );
}

export {DocumentationMobileLayout}