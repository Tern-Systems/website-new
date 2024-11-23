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
                        <div
                            id={"modal-portal"}
                            className={'absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] text-primary font-neo'}
                        />
                        <Suspense>
                            {children}
                        </Suspense>
                    </ModalProvider>
                </UserProvider>
            </body>
        </html>
    );
}
