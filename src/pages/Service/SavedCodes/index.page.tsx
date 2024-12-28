import React, {FC, ReactElement, useEffect, useState} from "react";
import {useQRCode} from "next-qrcode";
import axios from "axios";

import {UserSubscription} from "@/app/context/User.context";
import {ARCode} from "@/app/types/arcode";
import {LAYOUT, Route} from "@/app/static";

import {ARCHService} from "@/app/services";

import {MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {useLoginCheck, useNavigate} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {CodeMenu, CodeMenuData} from "./CodeMenu";


const MAX_AR_CODE_WIDTH = 200;


const SavedCodesPage: FC = () => {
    const [codeId, setCodeId] = useState<string | null>(null);
    const [qrSize, setQrSize] = useState(MAX_AR_CODE_WIDTH);
    const [updateList, setUpdateList] = useState(false);
    const [qrList, setQRList] = useState<ARCode[]>([]);
    const [menuData, setMenuData] = useState<CodeMenuData>({
        arCode: null,
        x: 0,
        y: 0,
        isOpened: false,
        updateList: setUpdateList
    });

    const [navigate] = useNavigate();
    const userCtx = useUser();
    const modalCtx = useModal();
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
            if (!codeId)
                return;
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

        const handleResize = () => setQrSize(Math.min(MAX_AR_CODE_WIDTH, MAX_AR_CODE_WIDTH * window.innerWidth / 500));
        handleResize();

        window.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
        }
    }, [codeId, menuData])


    useEffect(() => {
        const fetchListQR = async () => {
            if (!userCtx.userData)
                return;
            try {
                const {payload: qrList} = await ARCHService.getListQRs(userCtx.userData.email);
                setQRList(qrList);
                setUpdateList(false);
            } catch (error: unknown) {
                let message: string = 'Unknown error';
                if (axios.isAxiosError(error))
                    message = error.cause?.message ?? message;
                else if (typeof error === 'string')
                    message = error;
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }
        }
        fetchListQR();
        // eslint-disable-next-line
    }, [userCtx.userData, updateList]);

    if (!isLoggedIn)
        return null;

    const SavedCodes: ReactElement[] = qrList.map((arCode, idx) => {
        return (
            <div key={arCode.name + idx} id={'qr-' + arCode.mediaId + idx} className={'place-items-center'}>
                <div
                    className={'flex cursor-pointer mb-[--1dr] justify-center'}>
                    <SVG
                        text={'https://arch.tern.ac/' + arCode?.mediaId}
                        options={{
                            width: qrSize,
                            margin: 1,
                            color: {
                                dark: arCode.backgroundColor,
                                light: arCode.moduleColor,
                            }
                        }}
                    />
                </div>
                <div
                    className={`relative flex bg-control-gray h-[min(8dvw,2.3rem)] items-center justify-center rounded-smallest
                                w-[10rem] max-w-[40dvw]`}>
                    <span
                        className={'px-[min(1.1dvw,1rem)] text-header overflow-ellipsis text-nowrap overflow-x-hidden'}>
                        {arCode.name}
                    </span>
                    <Button
                        icon={'dots'}
                        className={`absolute inline right-[min(2.6dvw,0.63rem)] w-[0.3rem] h-[min(4dvw,1.15rem)] cursor-pointer place-self-center`}
                        onClick={() => {
                            setMenuData(prevState => ({
                                ...prevState,
                                x: 0,
                                arCode,
                                isOpened: codeId === arCode.mediaId + idx ? !prevState.isOpened : true
                            }));
                            setCodeId('qr-' + arCode.mediaId + idx);
                        }}
                    />
                </div>
            </div>
        )
    });

    return (
        <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-y-[min(5.3dvw,4.5rem)] gap-x-[4.9dvw]
                        after:flex-auto     sm:gap-x-[1.3dvw]`}>
            {SavedCodes}
            {menuData.isOpened ? <CodeMenu menuData={menuData}/> : null}
        </div>
    );
}

export default SavedCodesPage;