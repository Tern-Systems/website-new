import React, {FC, ReactElement} from "react";

import {ARCode} from "@/app/types/arcode";
import {OpenModal} from "@/app/context/Modal.context";
import {ButtonIcon} from "@/app/ui/form/Button";
import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";
import {useModal} from "@/app/context";

import {Button} from "@/app/ui/form";
import {ShareModal} from "./ShareModal";
import {DeleteModal} from "./DeleteModal";


type MenuItems = 'Edit' | 'Download' | 'Share' | 'Delete';
type MenuItem = Record<MenuItems, {
    svg: ButtonIcon;
    // eslint-disable-next-line
    action: (args: any) => void;
}>

type CodeMenuData = {
    isOpened: boolean;
    arCode: ARCode | null;
    x: number;
    y: number;
}

const MENU_ITEMS: MenuItem = {
    Edit: {
        svg: 'pencil',
        action: (args: { arCode: ARCode, navigate: (route: string) => void }) => {
            const {arCode, navigate} = args;
            navigate(Route.ARCodeToolEdit + '/' + arCode.id);
        }
    },
    Download: {
        svg: 'download',
        action: async () => null
    }, // TODO
    Share: {
        svg: 'share',
        action: (args: { openModal: OpenModal, arCode: ARCode }) =>
            args.openModal(<ShareModal name={args.arCode.name} file={args.arCode.file}/>, {darkenBg: true})
    },
    Delete: {
        svg: 'delete',
        action: async (args: { openModal: OpenModal, arCode: ARCode }) =>
            args.openModal(<DeleteModal adCode={args.arCode}/>, {darkenBg: true})
    }
}


interface Props {
    menuData: CodeMenuData;
}

const CodeMenu: FC<Props> = (props: Props) => {
    const {menuData} = props;

    const {openModal} = useModal();
    const [navigate] = useNavigate();

    const MenuItems: ReactElement[] = Object.entries(MENU_ITEMS).map(([name, value], idx) => (
        <Button
            key={name + idx}
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
export type {CodeMenuData}