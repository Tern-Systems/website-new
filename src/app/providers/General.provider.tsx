import { FC, PropsWithChildren } from 'react';

import { FlowProvider, LayoutProvider, ModalProvider, UserProvider } from '@/app/providers';

const Provider: FC<PropsWithChildren> = (props: PropsWithChildren) => (
    <UserProvider>
        <LayoutProvider>
            <FlowProvider>
                <ModalProvider>{props.children}</ModalProvider>
            </FlowProvider>
        </LayoutProvider>
    </UserProvider>
);

export { Provider };
