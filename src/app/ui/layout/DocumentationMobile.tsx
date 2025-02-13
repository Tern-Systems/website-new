import React, { FC, PropsWithChildren } from 'react';

import { Route } from '@/app/static';

import { useBackground, useMenu } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { usePathname } from 'next/navigation';
import { checkSubRoute } from '@/app/utils';

const DocumentationMobileLayout: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const { children } = props;

    const route = usePathname();
    const [setMenuOpened] = useMenu(checkSubRoute(route, Route.MyDocumentation));
    const bgSrc = useBackground();

    return (
        <div
            style={{ backgroundImage: `url("${bgSrc}")` }}
            className={
                'bg-content h-dvh max-h-dvh select-none bg-cover bg-fixed bg-bottom bg-no-repeat p-xs text-primary'
            }
        >
            <div className={`flex h-[3.05rem] items-center justify-end`}>
                <Button
                    onClick={() => setMenuOpened(true)}
                    icon={'burger'}
                    className={`absolute z-40 border-l-s border-gray-l0 pl-[0.9rem] before:h-[2.25rem] [&&_*]:size-[1.8rem]`}
                />
            </div>
            <div className={`h-[calc(100%-3.05rem)] flex-grow flex-col`}>{children}</div>
        </div>
    );
};

export { DocumentationMobileLayout };
