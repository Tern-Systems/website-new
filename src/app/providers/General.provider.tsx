import { FC, PropsWithChildren } from 'react';

import { FlowProvider, LayoutProvider, ModalProvider, UserProvider } from '@/app/providers';
import { TwoFactorRestorer } from '@/app/components/TwoFactorRestorer';

const Provider: FC<PropsWithChildren> = (props: PropsWithChildren) => (
    <UserProvider>
        <LayoutProvider>
            <FlowProvider>
                <ModalProvider>
                    <TwoFactorRestorer />
                    {props.children}
                </ModalProvider>
            </FlowProvider>
        </LayoutProvider>
    </UserProvider>
);

export { Provider };
