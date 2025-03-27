import { ReactNode } from 'react';

import { Provider } from '@/app/providers';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang={'en'}>
            <body>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
