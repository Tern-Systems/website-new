import {AnchorHTMLAttributes, FC, PropsWithChildren, ReactElement} from "react";

import {useNavigate} from "@/app/hooks";
import {useFlow} from "@/app/context";


// TODO use React Router
interface Props<T extends string> extends AnchorHTMLAttributes<HTMLAnchorElement>, PropsWithChildren {
    section: T;
}

const withSectionLink = function <T extends string, P extends string>(): FC<Props<T>> {
    return function Component(props: Props<T>): ReactElement {
        const {children, section, className, ...propsRest} = props;
        const [navigate] = useNavigate();
        const flowCtx = useFlow();

        const handleClick = () => {
            navigate<T, P>(section);
            flowCtx.clear();
        }

        return (
            <span
                {...propsRest}
                className={`flex items-center cursor-pointer ${className}`}
                onClick={() => handleClick()}
            >
                {children ?? section}
            </span>
        );
    }
}

export {withSectionLink};