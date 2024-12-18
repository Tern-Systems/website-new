import {AnchorHTMLAttributes, FC, MouseEvent, ReactElement} from "react";
import {ReactSVG} from "react-svg";
import {usePathname} from "next/navigation";
import Link from "next/link";

import {Route} from "@/app/static";

import {getRouteName} from "@/app/utils";
import {useNavigate} from "@/app/hooks";
import {useModal} from "@/app/context";

import SVG_ARROW from "@/assets/images/icons/arrow.svg";
import SVG_INSIGNIA from "@/assets/images/insignia.svg";

import styles from '@/app/common.module.css'


type Icon = 'back' | 'forward' | 'insignia';

const ICON: Record<Icon, { src: string }> = {
    back: SVG_ARROW,
    forward: SVG_ARROW,
    insignia: SVG_INSIGNIA,
}


interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: Icon;
}

const PageLink: FC<Props> = (props: Props) => {
    const {icon, children, href, ...linkProps} = props;

    const modalCtx = useModal();
    const route = usePathname();
    const [navigate] = useNavigate();

    const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        linkProps.onClick?.(event);
        modalCtx.closeModal();
        navigate(href as Route ?? Route.Home);
    }

    const Icon: ReactElement | null = icon
        ? <ReactSVG src={ICON[icon].src}
                    className={`inline size-[1rem] mr-[0.5rem] ${icon === 'forward' ? 'rotate-180' : ''}`}/>
        : null;

    const splitHref = children
        ? <span>{children}</span>
        : <span>{getRouteName(props.href)}</span>;

    return (
        <Link
            {...linkProps}
            className={`items-center inline-flex ${styles.clickable} ${linkProps.className}`}
            href={route ?? '/'}
            onClick={handleLinkClick}
        >
            {Icon} {splitHref}
        </Link>
    );
}
export {PageLink};