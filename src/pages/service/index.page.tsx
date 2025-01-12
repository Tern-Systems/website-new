import React, {FC} from "react";
import Image from "next/image";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import SVG_ARCH from "/public/images/arch-logo.svg";
import SVG_QR from "/public/images/qr.svg";


const ARCHPage: FC = () => (
    <div className={'my-auto'}>
        <Image src={SVG_ARCH} alt={'arch-logo'} className={'h-[min(13dvw,4rem)] w-auto place-self-center mb-[min(5.3dvw,1.25rem)]'}/>
        <Image
            src={SVG_QR}
            alt={'qr'}
            className={'mb-[min(5.3dvw,--p-content)] w-[min(90dw,37rem)] h-auto cursor-pointer place-self-center'}
        />
        <PageLink
            href={Route.ARCodeToolCreate}
            className={'bg-control-white text-black rounded-full font-bold px-[min(4dvw,2rem)] place-self-center'}
        >
                Create
        </PageLink>
    </div>
);


export default ARCHPage;