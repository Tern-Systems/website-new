import { ReactNode } from 'react';
import { StaticImageData } from 'next/image';

import { ButtonIcon } from '@/app/ui/form/Button';
import { IModalContext } from '@/app/contexts/modal.context';
import { Route } from '@/app/static';
import { SubscriptionBase } from '@/app/types/subscription';

type ResourceLink = {
    title: string;
    description: string;
    href?: string;
    icon?: StaticImageData;
};

type CardLink = {
    title: string;
    description?: string;
    icon: StaticImageData;
    action: { title: string; href: string };
    alt?: true;
    bullets?: string[];
};

type DocumentationLink = ResourceLink & Pick<SubscriptionBase, 'subscription'>;

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
    action?: (props: { sm: boolean; navigate: (link: Route) => void; modalCtx: IModalContext }) => void;
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
    ResourceLink,
    CardLink,
    DocumentationLink,
    SectionCard,
    InfoSectionData,
    ResourceSectionData,
    NavDropdownDict,
    NavDropdown,
    TableSection,
};
