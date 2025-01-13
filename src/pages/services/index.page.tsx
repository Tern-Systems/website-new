import React, {FC} from "react";
import Image from "next/image";
import cn from "classnames";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import SVG_ARCH from "/public/images/arch-logo.svg";
import SVG_QR from "/public/images/qr.png";


const ARCHPage: FC = () => (
    <div className={cn(
        'grid grid-cols-3 m-auto py-[--p-content-xs]',
        'md:portrait:x-[flex,flex-col-reverse,gap-y-[--p-content-3xl]]',
        'sm:mx-0',
        'sm:portrait:x-[flex,flex-col-reverse,gap-y-[--p-content-xxl]]',
    )}>
        <ul className={cn(
            'm-auto w-fit list-decimal text-[4rem] leading-[1.25] text-left',
            'md:text-heading-l',
            'sm:text-section',
            'sm:portrait:row-start-2',
            'sm:landscape:x-[pl-[35%],text-section]',
        )}
        >
            <li>Scan code</li>
            <li>Click allow</li>
            <li>Scan code</li>
            <li>Click play</li>
        </ul>
        <div className={'flex flex-col'}>
            <Image src={SVG_ARCH} alt={'arch-logo'}
                   className={cn(
                       'max-h-[4rem] h-[4dvw] w-auto place-self-center',
                       'md:portrait:h-[10dvw]',
                       'sm:portrait:h-[8dvw]',
                       'sm:landscape:h-[3dvw]',
                   )}
            />
            <Image
                src={SVG_QR}
                alt={'qr'}
                className={cn(
                    `rounded-small`,
                    'my-[--p-content] max-w-[37rem] w-[31dvw] h-auto cursor-pointer place-self-center',
                    'md:portrait:w-[50dvw]',
                    'sm:x-[w-[50dvw],my-[--p-content-3xs]]',
                    'sm:landscape:w-[20dvw]',
                )}
            />
            <PageLink
                href={Route.ARCodeToolCreate}
                className={cn(
                    'place-self-center px-[--p-content-xl] py-[--p-content-5xs] rounded-full bg-control-white text-black font-bold',
                    'md:text-heading',
                    'sm:landscape:x-[px-[--p-content-xs],py-[0.1rem],text-basic]',
                )}
            >
                Create
            </PageLink>
        </div>
    </div>
);


export default ARCHPage;