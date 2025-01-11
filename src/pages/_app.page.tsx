import {ReactElement, Suspense, useEffect, useState} from "react";
import {AppProps} from "next/app";

import {useBreakpointCheck} from "@/app/hooks";
import {FlowProvider, LayoutProvider, ModalProvider, UserProvider} from "@/app/context";

import {Layout} from "@/app/ui/layout";
import Head from "next/head";


export default function MyApp({Component, pageProps}: AppProps) {
    const isSmScreen = useBreakpointCheck();
    const [isPiPModeChild, setPiPModeChildState] = useState(false);

    // Click checking
    useEffect(() => {
        setPiPModeChildState(sessionStorage.getItem('pip-mode-child') !== null)
    }, [])


    // @ts-expect-error no errors
    const getLayout = isSmScreen && !isPiPModeChild ? Component.getMobileLayout : Component.getLayout;


    const FinalElement: ReactElement = getLayout
        ? getLayout(<Component {...pageProps} />)
        : (
            <Layout>
                <Suspense>
                    <Component {...pageProps} />
                </Suspense>
            </Layout>
        );

    return (
        <>
            <Head>
                <title>Tern</title>
            </Head>
            <UserProvider>
                <LayoutProvider>
                    <FlowProvider>
                        <ModalProvider>
                            {FinalElement}
                        </ModalProvider>
                    </FlowProvider>
                </LayoutProvider>
            </UserProvider>
        </>
    );
}