import React, {FC, ReactElement, useEffect, useState} from "react";
import Image from "next/image";

import {ARCode} from "@/app/types/arcode";
import {FADE_DURATION, Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";
import {useUser} from "@/app/context";

import {CodeMenu, CodeMenuData} from "./CodeMenu";
import {Button} from "@/app/ui/form";


const SAVED_CODES_TEMPLATE: ARCode[] = [
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 0', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 1', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 2', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 3', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 4', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 5', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 6', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 7', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 8', file: '/', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'Example Name 9', file: '/', moduleColor: '#000', backgroundColor: '#fff'}
]


const SavedCodesPage: FC = () => {
    const [menuData, setMenuData] = useState<CodeMenuData>({arCode: null, x: 0, y: 0, isOpened: false});
    const [codeId, setCodeId] = useState<string | null>(null);
    const [navigate] = useNavigate();
    const userCtx = useUser();


    useEffect(() => {
        if (!userCtx.isLoggedIn) {
            setTimeout(() => {
                navigate(Route.ServicePricing);
            }, FADE_DURATION);
        }
    }, [userCtx.isLoggedIn])

    if (!userCtx.isLoggedIn)
        return null;

    const SavedCodes: ReactElement[] = SAVED_CODES_TEMPLATE.map((arCode, idx) => {
        const id = (arCode.name + idx).toLowerCase().split(' ').join('-');
        return (
            <div key={id} id={id}>
                <div className={'p-[0.44rem] bg-section2 cursor-pointer mb-[0.94rem] min-h-[14.76rem]'}>
                    <Image src={arCode.file} alt={'qr'} width={10} height={10} className={'h-full w-full'}/>
                </div>
                <div
                    className={'relative flex bg-control h-[2.3125rem] items-center justify-center rounded-[0.375rem]'}>
              <span
                  className={'px-[1rem] text-primary text-[1.6875rem] overflow-ellipsis text-nowrap overflow-x-hidden'}>
                  {arCode.name}
              </span>
                    <Button
                        icon={'dots'}
                        className={`absolute inline right-[0.63rem] w-[0.3rem] h-[1.15rem] cursor-pointer place-self-center`}
                        onClick={() => {
                            setMenuData(prevState => ({
                                ...prevState,
                                x: 0,
                                arCode,
                                isOpened: codeId === id ? !prevState.isOpened : true
                            }));
                            setCodeId(id);
                        }}
                    />
                </div>
            </div>
        )
    });

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            setMenuData((prevState) => {
                const codeMenu = document.querySelector('#code-menu');
                const targetCodeCard = document.querySelector('#' + codeId);
                const contentDiv = document.querySelector('#content');

                if (!targetCodeCard || !contentDiv || !codeMenu)
                    return prevState;
                if (menuData.isOpened && !targetCodeCard.contains(event.target as Node))
                    return ({...prevState, isOpened: false, x: 0})

                if (menuData.isOpened && menuData.x !== 0)
                    return prevState;

                const x = contentDiv.clientWidth < event.x + codeMenu.clientWidth
                    ? event.x - codeMenu.clientWidth
                    : event.x + 10;
                const y = contentDiv.clientHeight < event.y - 144 + codeMenu.clientHeight
                    ? event.y + contentDiv.scrollTop - 144 - codeMenu.clientHeight
                    : event.y + contentDiv.scrollTop - 144;
                return ({...prevState, x, y})
            })
        }

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [codeId, menuData])

    return (
        <div
            className={'grid grid-cols-[repeat(auto-fill,minmax(15.625rem,1fr))] gap-y-[4.5rem] gap-x-[5.94rem] after:flex-auto'}>
            {SavedCodes}
            {menuData.isOpened ? <CodeMenu menuData={menuData}/> : null}
        </div>
    );
}

export default SavedCodesPage;