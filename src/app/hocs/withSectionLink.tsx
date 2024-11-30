import {AnchorHTMLAttributes, FC, PropsWithChildren, ReactElement} from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {useNavigate} from "@/app/hooks/useNavigate";
import {useFlow} from "@/app/context";

interface SectionLinkProps<T extends string> extends AnchorHTMLAttributes<HTMLAnchorElement>, PropsWithChildren {
    section: T;
}

const withSectionLink = function <T extends string, P extends string>(router: AppRouterInstance): FC<SectionLinkProps<T>> {
    return function Component(props: SectionLinkProps<T>): ReactElement {
        const {children, section, className, ...propsRest} = props;
        const [navigate] = useNavigate();
        const flowCtx = useFlow();

        const handleClick = () => {
            navigate<T, P>(section);
            flowCtx.clear();
        }

        return <span
            {...propsRest}
            className={`capitalize flex items-center ${className}`}
            onClick={() => handleClick()}
        >
            {children ?? section}
        </span>;
    }
}

export {withSectionLink};