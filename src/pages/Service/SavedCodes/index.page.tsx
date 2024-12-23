import React, {FC, ReactElement, useEffect, useState} from "react";
import {useQRCode} from "next-qrcode";

import {UserSubscription} from "@/app/context/User.context";
import {ARCode} from "@/app/types/arcode";
import {LAYOUT, Route} from "@/app/static";

import {useLoginCheck, useNavigate} from "@/app/hooks";
import {useUser} from "@/app/context";

import {CodeMenu, CodeMenuData} from "./CodeMenu";
import {Button} from "@/app/ui/form";


const SAVED_CODES_TEMPLATE: ARCode[] = [
    {id: '9uhrgqhi03fjpo-j', name: 'QR 0', file: '', moduleColor: '#000', backgroundColor: '#fff'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 1', file: '', moduleColor: '#000', backgroundColor: '#129'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 2', file: '', moduleColor: '#000', backgroundColor: '#456'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 3', file: '', moduleColor: '#000', backgroundColor: '#147'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 4', file: '', moduleColor: '#000', backgroundColor: '#280'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 5', file: '', moduleColor: '#000', backgroundColor: '#163'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 6', file: '', moduleColor: '#000', backgroundColor: '#692'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 7', file: '', moduleColor: '#000', backgroundColor: '#027'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 8', file: '', moduleColor: '#000', backgroundColor: '#835'},
    {id: '9uhrgqhi03fjpo-j', name: 'QR 9', file: '', moduleColor: '#000', backgroundColor: '#500'}
]


const AR_CODE_WIDTH = 300;


const SavedCodesPage: FC = () => {
    const [menuData, setMenuData] = useState<CodeMenuData>({arCode: null, x: 0, y: 0, isOpened: false});
    const [codeId, setCodeId] = useState<string | null>(null);
    const [navigate] = useNavigate();
    const userCtx = useUser();
    const isLoggedIn = useLoginCheck();
    const {SVG} = useQRCode();

    useEffect(() => {
        const subscription: UserSubscription | undefined = userCtx.userData?.subscriptions.find((entry: UserSubscription) => entry.subscription === 'ternKey');
        if (!subscription) {
            setTimeout(() => {
                navigate(Route.ServicePricing);
            }, LAYOUT.fadeDuration);
        }
        //eslint-disable-next-line
    }, [userCtx.isLoggedIn])

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

    if (!isLoggedIn)
        return null;

    const SavedCodes: ReactElement[] = SAVED_CODES_TEMPLATE.map((arCode, idx) => {
        const id = (arCode.name + idx).toLowerCase().split(' ').join('-');
        return (
            <div key={id} id={id}>
                <div
                    className={'p-[0.44rem] cursor-pointer mb-[0.94rem] min-h-[14.76rem] content-center place-items-center'}>
                    <SVG
                        text={'https://arch.tern.ac/media/' + arCode.id}
                        options={{
                            width: AR_CODE_WIDTH,
                            margin: 1,
                            color: {
                                dark: arCode.backgroundColor,
                                light: arCode.moduleColor,
                            }
                        }}
                    />
                </div>
                <div
                    className={'relative flex bg-control-gray h-[2.3125rem] items-center justify-center rounded-smallest'}>
              <span
                  className={'px-[1rem] text-header overflow-ellipsis text-nowrap overflow-x-hidden'}>
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

    return (
        <div
            className={'grid grid-cols-[repeat(auto-fill,minmax(15.625rem,1fr))] gap-y-[4.5rem] gap-x-[5.94rem] after:flex-auto'}>
            {SavedCodes}
            {menuData.isOpened ? <CodeMenu menuData={menuData}/> : null}
        </div>
    );
}

export default SavedCodesPage;