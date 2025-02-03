import {StaticImageData} from "next/image";

import {ButtonIcon} from "@/app/ui/form/Button";
import {Route} from "@/app/static";


type InfoSection = {
    title: string;
    subTitle: string;
    description: string;
    link: Route;
    linkTitle: string;
    image: StaticImageData;
}


type SectionCard = {
    title: string;
    description: string;
    action: string;
    href: string;
    icon: StaticImageData;
    btnIcon: ButtonIcon,
    btnIconCN?: string
}


export type {SectionCard, InfoSection};
