import React, {FC, ReactElement} from "react";

import {SectionsEnum} from "@/app/utils/sections";

import {Navigate, useNavigate} from "@/app/hooks/useNavigate";

import {OpenModal, useModal} from "@/app/context";

import {ShareModal} from "./ShareModal";

import {Button, ButtonIcon} from "@/app/components/form";
import {DeleteModal} from "@/app/components/views/Services/SavedARCodes/DeleteModal";

type ARCode = {
    name: string;
    file: string;
    moduleColor: string;
    backgroundColor: string;
}

type MenuItems = 'Edit' | 'Download' | 'Share' | 'Delete';
type MenuItem = Record<MenuItems, {
    svg: ButtonIcon;
    action: (args: any) => void;
}>

type MenuData = {
    isOpened: boolean;
    arCode: ARCode | null;
    x: number;
    y: number;
}

const MENU_ITEMS: MenuItem = {
    Edit: {
        svg: 'pencil',
        action: (args: { arCode: ARCode, navigate: Navigate }) => {
            const {arCode, navigate} = args;
            navigate(SectionsEnum.ARCodeTool, {'ar-code': JSON.stringify(arCode)});
        }
    },
    Download: {
        svg: 'download',
        action: async () => null
    }, // TODO
    Share: {
        svg: 'share',
        action: (args: { openModal: OpenModal, arCode: ARCode }) =>
            args.openModal(<ShareModal name={args.arCode.name} file={args.arCode.file}/>)
    },
    Delete: {
        svg: 'delete',
        action: async (args: { openModal: OpenModal, arCode: ARCode }) =>
            args.openModal(<DeleteModal adCode={args.arCode}/>)
    }
}


interface Props {
    menuData: MenuData;
}

const CodeMenu: FC<Props> = (props: Props) => {
    const {menuData} = props;

    const [navigate] = useNavigate();
    const {openModal} = useModal();

    const MenuItems: ReactElement[] = Object.entries(MENU_ITEMS).map(([name, value], index) => (
        <Button
            key={name + index}
            icon={value.svg}
            className={'flex gap-x-[0.57rem] font-bold'}
            onClick={() => value.action({openModal, navigate, arCode: menuData.arCode})}
        >
            {name}
        </Button>
    ));

    return (
        <div
            id={'code-menu'}
            style={{top: menuData.y, left: menuData.x}}
            className={`absolute flex flex-col bg-black border-small border-control3 rounded-[0.375rem] p-[0.63rem]
                            gap-y-[0.62rem] z-10`}
        >
            {MenuItems}
        </div>
    );
}

export {CodeMenu}
export type {ARCode, MenuData}