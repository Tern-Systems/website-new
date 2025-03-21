import React, { FC } from 'react';
import cn from 'classnames';

import { NavLink } from '@/app/static';

import { getIdName } from '@/app/utils';
import { useLayout } from '@/app/context';

interface Props {
    length?: number;
    className?: string;
}

const BreadcrumbRoute: FC<Props> = (props: Props) => {
    const { length = 2, className } = props;

    const layoutCtx = useLayout();

    const breadcrumbs = layoutCtx.navLinks[NavLink.Breadcrumbs]
        ?.slice(-length)
        .map((path: string) => {
            const parts = path.split('/');
            const lastPart = parts[parts.length - 1];
            const idName = getIdName(lastPart);
            return idName;
        })
        .join(' / ');
    return (
        <p className={cn('mt-n overflow-hidden overflow-ellipsis text-nowrap text-section-xxs leading-s', className)}>
            {breadcrumbs}
        </p>
    );
};

export { BreadcrumbRoute };
