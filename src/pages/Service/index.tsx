import {FC} from "react";
import Image from "next/image";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import SVG_QR from "@/assets/images/qr.png";


const ARCHPage: FC = () => (
    <div className={'my-auto'}>
        <Image
            src={SVG_QR}
            alt={'qr'}
            className={'mb-[1.87rem] max-w-[37.69rem] cursor-pointer place-self-center'}
        />
        <PageLink
            href={Route.ARCodeToolCreate}
            className={'bg-white text-black rounded-full font-bold px-[2rem] py-[0.1rem] w-fit place-self-center'}
        />
    </div>
);


export default ARCHPage;