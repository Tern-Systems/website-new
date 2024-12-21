import React, {FC, PropsWithChildren} from "react";
import Spline from "@splinetool/react-spline";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout/Link";
import {useNavigate} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";

import {Button} from "@/app/ui/form";

import styles from "@/app/common.module.css";


const cn = `absolute z-50 size-[15rem] bg-transparent sm:-ml-[0.75rem] cursor-pointer   md:hidden lg:hidden
            left-[--insignia-pl-moved] top-[--insignia-pt-moved] scale-[--insignia-scale-moved] origin-top-left`;


interface Props extends PropsWithChildren {
    backButtonSection: Route;
}

const FullScreenLayout: FC<Props> = (props: Props) => {
    const {children, backButtonSection} = props;
    const layoutCtx = useLayout();
    const modalCtx = useModal();
    const [navigate] = useNavigate();

    return (
        <div className={`h-dvh max-h-dvh relative font-oxygen text-gray bg-control-white text-content
                         ${modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'}`}>
            <div
                onClick={() => navigate(Route.Home)}
                className={cn}
            >
                <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}
                        className={'pointer-events-none'}/>
            </div>
            <div className={`flex items-center justify-between font-oxygen h-[4.3rem] p-[1.25rem] lg:hidden md:hidden`}>
                <Button
                    icon={'close'}
                    onClick={() => history.back()}
                    className={'[&_path]:fill-blue ml-auto [&_svg]:size-[1.125rem]'}
                />
            </div>
            <hr className={`lg:hidden md:hidden`}/>
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