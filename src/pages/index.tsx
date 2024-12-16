'use client'

import React, {FC, ReactElement, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {Route} from "@/app/static";


const StartPage: FC = () => {
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token)
            router.replace(Route.Home + '?resetToken=' + token);
    }, [params, router]);

    return <></>;
};


StartPage.getLayout = (page: ReactElement) => page;


export default StartPage;