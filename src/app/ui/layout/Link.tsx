import {AnchorHTMLAttributes, FC, ReactElement, useEffect} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";
import {useModal} from "@/app/context";

import SVG_BACK from "@/assets/images/icons/back.svg";
import SVG_INSIGNIA from "@/assets/images/insignia.svg";


type Icon = 'back' | 'insignia';

const ICON: Record<Icon, string> = {
    back: SVG_BACK,
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

    const handleLinkClick = () => {
        modalCtx.closeModal();
        navigate(href as Route ?? Route.Start);
    }

    useEffect(() => {
    }, [route])

    const Icon: ReactElement | null = icon
        ? (
            <Image
                src={ICON[icon]}
                alt={icon}
                className={`inline size-[1rem]`}/>
        )
        : null;

    return (
        <Link {...linkProps} href={route ?? '/'} onClick={() => handleLinkClick()}>
            {Icon}
            {children ?? <span>{props.href?.split('/').pop()}</span>}
        </Link>
    );
}
export {PageLink};