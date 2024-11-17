import {AnchorHTMLAttributes, FC, PropsWithChildren, ReactElement} from "react";

/// withSectionLink /////
interface SectionLinkProps<T extends string> extends AnchorHTMLAttributes<HTMLAnchorElement>, PropsWithChildren {
    section: T;
}

const withSectionLink = function <T extends string>(handler: (section: T) => void): FC<SectionLinkProps<T>> {
    return function Component(props: SectionLinkProps<T>): ReactElement {
        const {children, section, className, ...propsRest} = props;
        return <a
            {...propsRest}
            href={'#'}
            className={`capitalize ${className}`}
            onClick={() => handler(section)}
        >
            {children ?? section}
        </a>;
    }
}

export {withSectionLink};