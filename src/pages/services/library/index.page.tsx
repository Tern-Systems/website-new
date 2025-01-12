import React, {FC, ReactElement, useEffect, useState} from "react";
import {useQRCode} from "next-qrcode";
import cn from "classnames";

import {SubscriptionBase} from "@/app/types/subscription";
import {ARCode} from "@/app/types/arcode";
import {LAYOUT, Route} from "@/app/static";

import {ARCHService} from "@/app/services";

import {MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {useLoginCheck, useNavigate} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {CodeMenu, CodeMenuData} from "./CodeMenu";


const SavedCodesPage: FC = () => {
    const [codeId, setCodeId] = useState<string | null>(null);
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
        const subscription: SubscriptionBase | undefined = userCtx.userData?.subscriptions.find((entry: SubscriptionBase) => entry.subscription === 'ARCH');
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


        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
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
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchListQR();
        // eslint-disable-next-line
    }, [userCtx.userData, updateList]);

    if (!isLoggedIn)
        return null;

    const SavedCodes: ReactElement[] = qrList.map((arCode, idx) => {
        return (
            <div key={arCode.name + idx} id={'qr-' + arCode.mediaId + idx} className={'w-full place-items-center'}>
                <div
                    className={'flex cursor-pointer mb-[--p-content-xxs] w-full justify-center [&_*]:x-[w-full,h-auto]'}
                >
                    <SVG
                        text={'https://arch.tern.ac/' + arCode?.mediaId}
                        options={{
                            margin: 1,
                            color: {
                                dark: arCode.backgroundColor,
                                light: arCode.moduleColor,
                            }
                        }}
                    />
                </div>
                <div
                    className={cn(
                        `relative flex w-full h-[2.3rem] items-center justify-center rounded-smallest bg-control-gray`,
                        `sm:x-[border-small,border-control-white,bg-control-gray-l0]`,
                    )}
                >
                    <span className={cn(
                        'px-[--p-content-l] overflow-x-hidden overflow-ellipsis text-nowrap text-heading leading-[1.2]',
                        'sm:text-basic',
                    )}
                    >
                        {arCode.name}
                    </span>
                    <Button
                        icon={'dots'}
                        className={`absolute right-[--p-content-4xs] place-self-center [&&_*]:w-[0.3rem]`}
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
        <div className={'w-full h-full sm:py-[3.36rem]'}>
            <div
                className={cn(
                    `grid`,
                    `gap-x-[min(5dvw,5.94rem)] gap-y-[min(3.75dvw,4.5rem)]`,
                    `lg:x-[px-[9rem],py-[5.94rem]]`,
                    `lg:grid-cols-[repeat(auto-fill,minmax(0,15.6rem))]`,
                    `after:flex-auto`,
                    `sm:grid-cols-[repeat(auto-fill,minmax(0,10.3rem))]`,
                    `sm:x-[gap-x-[1.3dvw],gap-y-[--p-content-xs],px-[--p-content-xs],overflow-y-scroll] sm:portrait:h-full`
                )}
            >
                {menuData.isOpened ? <CodeMenu menuData={menuData}/> : null}
                {SavedCodes}
            </div>
        </div>
    );
}

export default SavedCodesPage;