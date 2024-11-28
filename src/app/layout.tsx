import {ReactNode, Suspense} from "react";

import {DeferredCallProvider} from "@/app/context/Flow.context";
import {UserProvider} from "@/app/context/User.context";
import {ModalProvider} from "@/app/context/Modal.context";

import "./globals.css";

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
        <body>
            <DeferredCallProvider>
                <UserProvider>
                    <ModalProvider>
                        <Suspense>
                            {children}
                        </Suspense>
                    </ModalProvider>
                </UserProvider>
            </DeferredCallProvider>
        </body>
        </html>
    );
}
