import React, {FC} from "react";
import Image from "next/image";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import SVG_ARCH from "@/assets/images/arch-logo.svg";
import SVG_QR from "@/assets/images/qr.svg";


const ARCHPage: FC = () => (
    <div className={'my-auto'}>
        <Image src={SVG_ARCH} alt={'arch-logo'} className={'h-[min(13dvw,4rem)] place-self-center mb-[min(5.3dvw,1.25rem)]'}/>
        <Image
            src={SVG_QR}
            alt={'qr'}
            className={'mb-[min(5.3dvw,1.87rem)] w-[min(90dw,37rem)] cursor-pointer place-self-center'}
        />
        <PageLink
            href={Route.ARCodeToolCreate}
            className={'bg-control-white text-black rounded-full font-bold px-[min(4dvw,2rem)] place-self-center'}
        />
    </div>
);


export default ARCHPage;