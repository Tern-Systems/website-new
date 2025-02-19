import React, { FC } from 'react';

import { NavLink } from '@/app/static';

import { getIdName } from '@/app/utils';
import { useLayout } from '@/app/context';

interface Props {
    length?: number;
}

const BreadcrumbRoute: FC<Props> = (props: Props) => {
    const { length = 2 } = props;

    const layoutCtx = useLayout();

    const breadcrumbs = layoutCtx.navLinks[NavLink.Breadcrumbs]?.[1]
        ?.split('/')
        .slice(-length)
        .map((parts) => getIdName(parts))
        .join(' / ');

    return (
        <p className={'mt-n overflow-hidden overflow-ellipsis text-nowrap text-section-xxs leading-s'}>{breadcrumbs}</p>
    );
};

export { BreadcrumbRoute };
