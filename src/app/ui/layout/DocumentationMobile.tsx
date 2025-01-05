import React, {FC, PropsWithChildren} from "react";
import {usePathname} from "next/navigation";

import {Route} from "@/app/static";

import {getRouteLeave} from "@/app/utils/router";
import {useBackground, useMenu} from "@/app/hooks";

import {Button} from "@/app/ui/form";


const DocumentationMobileLayout: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const {children} = props;

    const route = usePathname();

    const subNavLinks: Route[] = [Route.Documentation, getRouteLeave(route) as Route];
    const [openMenu] = useMenu(subNavLinks);
    const bgSrc = useBackground();


    return (
        <div
            style={{backgroundImage: `url("${bgSrc}")`}}
            className={'h-dvh max-h-dvh p-[1.25rem] font-neo text-primary bg-content bg-cover bg-no-repeat bg-fixed bg-bottom'}>
            <div className={`h-[3.05rem] flex items-center justify-end`}>
                <Button
                    onClick={() => openMenu()}
                    icon={'burger'}
                    className={`[&&_*]:size-[1.8rem] absolute z-40 pl-[0.9rem]  before:h-[2.25rem] border-l-small border-control-gray-l0`}
                />
            </div>
            <div className={`flex-col flex-grow h-[95.5%]`}>
                {children}
            </div>
        </div>
    );
}

export {DocumentationMobileLayout}