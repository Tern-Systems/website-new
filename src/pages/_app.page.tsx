import { ReactElement, Suspense, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';

import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { useBreakpointCheck } from '@/app/hooks';
import { FlowProvider, LayoutProvider, ModalProvider, UserProvider } from '@/app/context';

import { Layout } from '@/app/ui/layout';

export default function MyApp({ Component, pageProps }: AppProps) {
    const gtagId = process.env.NEXT_PUBLIC_GTAG_ID;

    const isSm = useBreakpointCheck() <= Breakpoint.sm;
    const [isPiPModeChild, setPiPModeChildState] = useState(false);

    // Click checking
    useEffect(() => {
        setPiPModeChildState(sessionStorage.getItem('pip-mode-child') !== null);
    }, []);

    // @ts-expect-error no errors
    const getLayout = isSm && !isPiPModeChild ? Component.getMobileLayout : Component.getLayout;

    const FinalElement: ReactElement = getLayout ? (
        getLayout(<Component {...pageProps} />)
    ) : (
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
            <Script
                async
                src='https://www.googletagmanager.com/gtag/js?id=G-5JNM7GCKYP'
            />
            <Script
                id={'gtag-config'}
                strategy={'afterInteractive'}
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gtagId}');
                `,
                }}
            />
            <UserProvider>
                <LayoutProvider>
                    <FlowProvider>
                        <ModalProvider>{FinalElement}</ModalProvider>
                    </FlowProvider>
                </LayoutProvider>
            </UserProvider>
        </>
    );
}
