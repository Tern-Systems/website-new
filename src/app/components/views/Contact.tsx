import React, {FC} from "react";
import Image from "next/image";

import SVG_DISCORD from "@/assets/images/icons/discord.svg";
import SVG_STACKOVERFLOW from "@/assets/images/icons/stack-overflow.svg";
import SVG_GITHUB from "@/assets/images/icons/github.svg";
import SVG_X from "@/assets/images/icons/x-twitter.svg";
import SVG_REDDIT from "@/assets/images/icons/reddit.svg";
import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_FACEBOOK from "@/assets/images/icons/facebook.svg";

const LINKS: { svg: string, href: string }[] = [ // TODO
    {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
    {svg: SVG_STACKOVERFLOW, href: 'https://stackoverflow.com/users/24470835/tern'},
    {svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems'},
    {svg: SVG_X, href: 'https://x.com/Tern_Systems'},
    {svg: SVG_REDDIT, href: 'https://www.reddit.com/user/Tern_Systems'},
    {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys'},
    {svg: SVG_FACEBOOK, href: 'https://www.facebook.com/ternsystemsinc'},
]

const Contact: FC = () => {
    const Links = LINKS.map((link) => (
        <a key={link.href} href={link.href} target={'_blank'} className={'size-[2rem]'}>
            <Image src={link.svg} alt={link.href}/>
        </a>
    ));

    return (
        <div
            className={'flex flex-col w-[58.625rem] text-left ml-[5.94rem] gap-[3.12rem] text-[2.25rem] font-bold my-auto'}>
            <p className={'font-oxygen text-[2.8125rem]'}>Tern</p>
            <p>New York, New York</p>
            <p className={'font-normal'}><a href="mailto:info@tern.ac" target={'_blank'}>info@tern.ac</a></p>
            <span className={'flex gap-[0.84rem]'}>{Links}</span>
        </div>
    )
}

export {Contact}