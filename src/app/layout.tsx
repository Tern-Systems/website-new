import {ReactNode, Suspense} from "react";

import {FlowProvider, ModalProvider, UserProvider} from "@/app/context";

import "./globals.css";


export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
        <body>
        <FlowProvider>
            <UserProvider>
                <ModalProvider>
                    <Suspense>
                        {children}
                    </Suspense>
                </ModalProvider>
            </UserProvider>
        </FlowProvider>
        </body>
        </html>
    );
}
