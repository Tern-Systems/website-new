import {Suspense} from "react";
import {AppProps} from "next/app";

import {FlowProvider, ModalProvider, UserProvider} from "@/app/context";

import {Layout} from "@/app/ui/layout";


export default function MyApp({Component, pageProps}: AppProps) {
    return (
        <FlowProvider>
            <UserProvider>
                <ModalProvider>
                    <Layout>
                        <Suspense>
                            <Component {...pageProps} />
                        </Suspense>
                    </Layout>
                </ModalProvider>
            </UserProvider>
        </FlowProvider>
    );
}