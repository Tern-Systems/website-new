'use client'

import React, {FC, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import cn from "classnames";

import {useLoginCheck} from "@/app/hooks";
import {useFlow, useModal} from "@/app/context";

import {ResetPasswordModal} from "@/app/ui/modals";

import styles from "@/app/common.module.css";


const HomePage: FC = () => {
    const params = useSearchParams();
    const modalCtx = useModal();
    const flowCtx = useFlow();
    useLoginCheck();

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token && !modalCtx.isOpened)
            return modalCtx.openModal(<ResetPasswordModal token={token}/>);
        flowCtx.next()?.();
        //eslint-disable-next-line
    }, [params?.size])


    return (
        <div className={cn(styles.highlight,
            `max-w-[57rem]`,
            `sm:landscape:w-[41dvw]`,
        )}
        >
            <h1 className={cn(
                `text-blue`,
                `mb-[--p-content] text-[6.25rem]`,
                `sm:x-[mb-[0.94rem]]`,
                `sm:portrait:text-[3.125rem]`,
                `sm:landscape:text-[6.2dvw]`
            )}
            >
                All Ways
            </h1>
            <span className={cn(
                `font-bold leading-[120%]`,
                `lg:x-[text-[2.25rem],tracking-[0.04rem]]`,
                `sm:text-[1.125rem]`
            )}
            >
                We develop, manufacture, preserve, and enhance fundamental computer software and hardware.
            </span>
        </div>
    );
}

export default HomePage;