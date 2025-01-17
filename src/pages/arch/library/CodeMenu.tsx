import React, {Dispatch, FC, ReactElement, SetStateAction} from "react";
import cn from "classnames";

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
    updateList: Dispatch<SetStateAction<boolean>>;
}

const MENU_ITEMS: MenuItem = {
    Edit: {
        svg: 'pencil',
        action: (args: { arCode: ARCode, navigate: (route: string) => void }) => {
            const {arCode, navigate} = args;
            sessionStorage.setItem('qr-code-edit', JSON.stringify(arCode));
            navigate(Route.ARCodeToolEdit);
        }
    },
    Download: {
        svg: 'download',
        action: async (args: { arCode: ARCode }) => window.open(args.arCode.downloadUrl, '_blank')
    },
    Share: {
        svg: 'share',
        action: (args: { openModal: OpenModal, arCode: ARCode }) =>
            args.openModal(<ShareModal name={args.arCode.name} file={args.arCode.qrCodeUrl}/>, {darkenBg: true})
    },
    Delete: {
        svg: 'delete',
        action: async (args: { openModal: OpenModal, arCode: ARCode, updateList: Dispatch<SetStateAction<boolean>> }) =>
            args.openModal(<DeleteModal adCode={args.arCode} updateList={args.updateList}/>, {darkenBg: true})
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
            className={'flex gap-x-[0.58rem] font-bold w-full [&]:justify-start'}
            classNameIcon={'[&_svg]:w-[1.125rem]'}
            onClick={() => value.action({
                openModal,
                navigate,
                arCode: menuData.arCode,
                updateList: menuData.updateList
            })}
        >
            {name}
        </Button>
    ));

    return (
        <div
            id={'code-menu'}
            style={{top: menuData.y, left: menuData.x}}
            className={cn(
                `absolute z-10 flex flex-col gap-y-[--p-content-4xs] p-[--p-content-4xs] items-start`,
                `rounded-smallest border-small bg-black border-control-white-d0 text-section-xxs`,
            )}
        >
            {MenuItems}
        </div>
    );
}

export {CodeMenu}
export type {CodeMenuData}