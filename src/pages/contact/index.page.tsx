import React, {FC} from "react";
import Image from "next/image";

import styles from '@/app/common.module.css';

import SVG_DISCORD from "/public/images/icons/discord.svg";
import SVG_STACKOVERFLOW from "/public/images/icons/stack-overflow.svg";
import SVG_GITHUB from "/public/images/icons/github.svg";
import SVG_X from "/public/images/icons/x-twitter.svg";
import SVG_REDDIT from "/public/images/icons/reddit.svg";
import SVG_LINKEDIN from "/public/images/icons/linkedin.svg";
import SVG_FACEBOOK from "/public/images/icons/facebook.svg";


const LINKS: { svg: string, href: string }[] = [
    {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
    {svg: SVG_STACKOVERFLOW, href: 'https://stackoverflow.com/users/24470835/tern'},
    {svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems'},
    {svg: SVG_X, href: 'https://x.com/Tern_Systems'},
    {svg: SVG_REDDIT, href: 'https://www.reddit.com/user/Tern_Systems'},
    {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys'},
    {svg: SVG_FACEBOOK, href: 'https://www.facebook.com/ternsystemsinc'},
]


const ContactsPage: FC = () => {
    const Links = LINKS.map((link) => (
        <li key={link.href} className={`size-[2.5rem] sm:size-[--p-content] ${styles.clickable}`}>
            <a href={link.href} target={'_blank'}>
                <Image src={link.svg} alt={link.href} className={'h-full w-auto'}/>
            </a>
        </li>
    ));

    return (
        <div
            className={`${styles.highlight} gap-y-[3.12rem] w-full max-w-[26.5rem]
                        sm:x-[gap-y-[--p-content],max-w-[19.2rem],w-fit,text-section]
                        sm:portrait:x-[mx-auto,p-[--p-content-xs]]
                        sm:landscape:gap-y-[1rem]`}
        >
            <h1 className={`font-oxygen
                            sm:text-heading`}
            >
                Tern
            </h1>
            <p>New York, New York</p>
            <p className={'font-normal text-[]'}>
                <a href={'mailto:info@tern.ac'} target={'_blank'} className={styles.clickable}>info@tern.ac</a>
            </p>
            <ul className={'flex gap-[--s-small]'}>{Links}</ul>
        </div>
    )
}

export default ContactsPage