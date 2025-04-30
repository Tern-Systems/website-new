'use client';

import { FC, ReactElement } from 'react';
import cn from 'classnames';

import { NavLink, Route } from '@/app/static';

import { getIdName } from '@/app/utils';
import { useLayout } from '@/app/hooks';

import { MAPPED_SUB_NAV_ROUTES } from '@/app/static';
import { PageLink } from '@/app/ui/layout';

interface Props {
    leave?: string;
    length?: number;
    className?: string;
}

const BreadcrumbRoute: FC<Props> = (props: Props) => {
    const { length = 2, leave, className } = props;

    const layoutCtx = useLayout();

    const routes: string[] | null = layoutCtx.navLinks[NavLink.Breadcrumbs];
    if (routes && leave) routes.push(leave);

    const BreadcrumbsLi: ReactElement[] | undefined = routes?.slice(-length).map((path: string, idx, array) => {
        let pathName: string | undefined;
        if (MAPPED_SUB_NAV_ROUTES[path]) pathName = MAPPED_SUB_NAV_ROUTES[path];
        else {
            const parts = path.split('/');
            const lastPart = parts[parts.length - 1];
            pathName = getIdName(lastPart);
        }

        return (
            <li
                key={path + idx}
                className={'contents'}
            >
                <PageLink
                    href={path}
                    prevent={path === leave}
                >
                    {pathName}
                </PageLink>
                {idx < array.length - 1 ? <span>&nbsp;/&nbsp;</span> : null}
            </li>
        );
    });

    return BreadcrumbsLi ? (
        <ul className={cn('mt-n overflow-hidden overflow-ellipsis text-nowrap text-12 leading-relaxed', className)}>
            {BreadcrumbsLi}
        </ul>
    ) : null;
};

BreadcrumbRoute.displayName = BreadcrumbRoute.name;

export { BreadcrumbRoute };
