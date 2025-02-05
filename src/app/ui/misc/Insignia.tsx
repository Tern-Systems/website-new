import React, {FC} from "react";
import Image from "next/image";

import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";

import SVG_LOGO from '/public/images/tern-logo.png'


const Insignia: FC = () => {
    const [navigate] = useNavigate();
    return (
        <div>
            <Image
                src={SVG_LOGO}
                width={65}
                height={29}
                alt={'insignia'}
                onClick={() => navigate(Route.Home)}
                className={'h-[--insignia-h] w-auto  cursor-pointer'}
            />
        </div>
    );
}

export {Insignia};
