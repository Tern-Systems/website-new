import {ReactNode, Suspense} from "react";

import {ModalProvider} from "@/app/context/Modal.context";
import {UserProvider} from "@/app/context/User.context";

import "./globals.css";

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
        <body>
        <UserProvider>
            <ModalProvider>
                <Suspense>
                    {children}
                </Suspense>
            </ModalProvider>
        </UserProvider>
        </body>
        </html>
    );
}
