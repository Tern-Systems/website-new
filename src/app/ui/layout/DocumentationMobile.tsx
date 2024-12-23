import React, {FC, PropsWithChildren} from "react";

import {PROFILE_LINKS, Route} from "@/app/static";

import {useModal} from "@/app/context";

import {MenuModal} from "@/app/ui/layout/Header/MenuModal";
import {Button} from "@/app/ui/form";
import {usePathname} from "next/navigation";
import {getRouteLeave} from "@/app/utils/router";


const DocumentationMobileLayout: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const {children} = props;

    const modalCtx = useModal();
    const route = usePathname();

    const subNavLinks: Route[] = [Route.Documentation, getRouteLeave(route) as Route];

    const toggleNav = () => modalCtx.openModal(
        <MenuModal navLinks={PROFILE_LINKS} subNavLinks={subNavLinks}/>
    );

    return (
        <div
            className={'h-dvh max-h-dvh p-[1.25rem] font-neo text-primary bg-content bg-cover bg-no-repeat bg-fixed bg-bottom'}>
            <div className={`h-[3.05rem] flex items-center justify-end`}>
                <Button
                    onClick={() => toggleNav()}
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