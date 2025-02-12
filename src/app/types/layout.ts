import { StaticImageData } from 'next/image';

import { ButtonIcon } from '@/app/ui/form/Button';
import { Route } from '@/app/static';
import { IModalContext } from '@/app/context/Modal.context';

type InfoSection = {
    title: string;
    subTitle: string;
    description: string;
    link: Route;
    linkTitle: string;
    image: StaticImageData;
};

type SectionCard = {
    title: string;
    description: string;
    action: string;
    href: string;
    icon: StaticImageData;
    btnIcon: ButtonIcon;
    btnIconCN?: string;
};

type NavDropdown = {
    name: string;
    columns: Record<string, string | ((action: IModalContext) => void)>[];
};

type NavDropdownDict = Record<string, NavDropdown>;

export type { SectionCard, InfoSection, NavDropdownDict, NavDropdown };
