import React, {FC} from "react";
import {useQRCode} from "next-qrcode";
import Image from "next/image";
import cn from "classnames";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import SVG_ARCH from "/public/images/arch-logo.svg";


const ARCHPage: FC = () => {
    const {SVG} = useQRCode();
    return (
        <div className={cn(
            'flex flex-col m-auto py-[--p-content-xs]',
            'sm:mx-0',
        )}>
            <div className={'flex flex-col'}>
                <Image src={SVG_ARCH} alt={'arch-logo'}
                       className={cn(
                           'max-h-[4rem] h-[4dvw] w-auto place-self-center',
                           'md:portrait:h-[10dvw]',
                           'sm:min-h-[1.56rem]',
                           'sm:portrait:h-[8dvw]',
                           'sm:landscape:h-[3dvw]',
                       )}
                />
                <div
                    className={cn(
                        `rounded-small overflow-hidden`,
                        'my-[--p-content] max-w-[37rem] w-[31dvw] h-auto cursor-pointer place-self-center',
                        '[&_*]:w-full [&_*]:h-full',
                        'md:portrait:w-[50dvw]',
                        'sm:x-[w-[50dvw],my-[--p-content-3xs],min-w-[10rem]]',
                        'sm:landscape:w-[20dvw]',
                    )}
                >
                    <SVG text={'https://arch.tern.ac/'} options={{margin: 1}}/>
                </div>
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
}

export default ARCHPage;