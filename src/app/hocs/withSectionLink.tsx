import {AnchorHTMLAttributes, FC, PropsWithChildren, ReactElement} from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useNavigate} from "@/app/hooks/useNavigate";

interface SectionLinkProps<T extends string> extends AnchorHTMLAttributes<HTMLAnchorElement>, PropsWithChildren {
    section: T;
}

const withSectionLink = function <T extends string, P extends string>(router: AppRouterInstance): FC<SectionLinkProps<T>> {
    return function Component(props: SectionLinkProps<T>): ReactElement {
        const {children, section, className, ...propsRest} = props;
        const [navigate] = useNavigate();

        return <a
            {...propsRest}
            href={'#'}
            className={`capitalize flex items-center ${className}`}
            onClick={() => navigate<T, P>(section)}
        >
            {children ?? section}
        </a>;
    }
}

export {withSectionLink};