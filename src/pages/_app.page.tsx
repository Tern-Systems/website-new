import {ReactElement, Suspense} from "react";
import {AppProps} from "next/app";

import {useBreakpointCheck} from "@/app/hooks";
import {FlowProvider, LayoutProvider, ModalProvider, UserProvider} from "@/app/context";

import {Layout} from "@/app/ui/layout";


export default function MyApp({Component, pageProps}: AppProps) {
    const isSmScreen = useBreakpointCheck();

    // @ts-expect-error no errors
    const getLayout = isSmScreen ? Component.getMobileLayout : Component.getLayout;


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
        <LayoutProvider>
            <FlowProvider>
                <UserProvider>
                    <ModalProvider>
                        {FinalElement}
                    </ModalProvider>
                </UserProvider>
            </FlowProvider>
        </LayoutProvider>
    );
}