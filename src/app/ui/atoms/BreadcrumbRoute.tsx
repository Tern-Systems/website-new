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

    const breadcrumbs = layoutCtx.navLinks[NavLink.SubNav]?.[1]
        ?.split('/')
        .slice(-length)
        .map((parts) => getIdName(parts))
        .join(' / ');

    return <p className={'mt-n text-section-xxs'}>{breadcrumbs}</p>;
};

export { BreadcrumbRoute };
