import React, {FC} from "react";
import Image from "next/image";

import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";

import SVG_INSIGNIA from '/public/images/insignia-logo.png'


const Insignia: FC = () => {
    const [navigate] = useNavigate();
    return (
        <div>
            <Image
                src={SVG_INSIGNIA}
                width={29}
                height={29}
                alt={'insignia'}
                onClick={() => navigate(Route.Home)}
                className={'w-[--insignia-moved-size] h-auto  cursor-pointer'}
            />
        </div>
    );
}

export {Insignia};
