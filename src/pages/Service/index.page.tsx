import React, {FC} from "react";
import Image from "next/image";
import cn from "classnames";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import SVG_ARCH from "@/assets/images/arch-logo.svg";
import SVG_QR from "@/assets/images/qr.svg";


const ARCHPage: FC = () => (
    <div className={'grid grid-cols-3 m-auto py-[--p-content-xs] sm:m-0'}>
        <ul className={cn(
            'm-auto w-fit list-decimal text-[4rem] leading-[1.25] text-left',
            'md:text-heading',
            'sm:text-heading',
        )}
        >
            <li>Scan code</li>
            <li>Click allow</li>
            <li>Scan code</li>
            <li>Click play</li>
        </ul>
        <div>
            <Image src={SVG_ARCH} alt={'arch-logo'} className={'max-h-[4rem] h-[3dvw] w-auto place-self-center'}/>
            <Image
                src={SVG_QR}
                alt={'qr'}
                className={cn(
                    'my-[--p-content] max-w-[37rem] w-[31dvw] h-auto cursor-pointer place-self-center',
                    'sm:x-[w-[20dvw],my-[--p-content-5xs]]'
                )}
            />
            <PageLink
                href={Route.ARCodeToolCreate}
                className={'place-self-center px-[--p-content-xs] py-[0.1rem] rounded-full bg-control-white text-black font-bold'}
            >
                Create
            </PageLink>
        </div>
    </div>
);


export default ARCHPage;