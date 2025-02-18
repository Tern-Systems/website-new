import { ReactNode } from 'react';
import { StaticImageData } from 'next/image';

import { ButtonIcon } from '@/app/ui/form/Button';
import { Route } from '@/app/static';
import { IModalContext } from '@/app/context/Modal.context';
import { PlanName } from '@/app/types/subscription';

type DocumentationLink = { title: string; text: string; route: Route; subscription: PlanName };

type InfoSectionData = {
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

type ResourceSectionData = {
    Node: ReactNode;
    action?: (props: { isSm: boolean; navigate: (link: Route) => void; modalCtx: IModalContext }) => void;
};

type NavDropdown = {
    name: string;
    columns: Record<string, string | ((action: IModalContext) => void)>[];
};

type NavDropdownDict = Record<string, NavDropdown>;

type TableSection<T extends object> = {
    title: string;
    data: T[];
    fallback: ReactNode;
};

export type {
    DocumentationLink,
    SectionCard,
    InfoSectionData,
    ResourceSectionData,
    NavDropdownDict,
    NavDropdown,
    TableSection,
};
