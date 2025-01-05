'use client'

import React, {FC, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {Route} from "@/app/static";

import {useModal} from "@/app/context";

import {ResetPasswordModal} from "@/app/ui/modals";

import styles from "@/app/common.module.css";


const HomePage: FC = () => {
    const params = useSearchParams();
    const modalCtx = useModal();
    const router = useRouter();

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token) {
            modalCtx.openModal(<ResetPasswordModal token={token}/>);
            router.push(Route.Home);
        }
        //eslint-disable-next-line
    }, [params]);

    return (
        <div className={`${styles.highlight} max-w-[57rem]
                            sm:landscape:w-[41dvw]`}
        >
            <h1 className={`text-blue
                            mb-[1.87rem] text-[6.25rem]
                            sm:x-[mb-[0.94rem]]
                            sm:portrait:text-[3.125rem]
                            sm:landscape:text-[6.2dvw]`}>
                All Ways
            </h1>
            <span className={`font-bold leading-[120%]
                            lg:x-[text-[2.25rem],tracking-[0.04rem]] 
                            sm:text-[1.125rem]`}
            >
                We develop, manufacture, preserve, and enhance fundamental computer software and hardware.
            </span>
        </div>
    );
}

export default HomePage;