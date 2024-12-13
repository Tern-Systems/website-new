import {ReactElement, Suspense} from "react";
import {AppProps} from "next/app";

import {FlowProvider, ModalProvider, UserProvider} from "@/app/context";

import {Layout} from "@/app/ui/layout";


export default function MyApp({Component, pageProps}: AppProps) {
    // @ts-expect-error no errors
    const getLayout = Component.getLayout;

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
        <FlowProvider>
            <UserProvider>
                <ModalProvider>
                    {FinalElement}
                </ModalProvider>
            </UserProvider>
        </FlowProvider>
    );
}