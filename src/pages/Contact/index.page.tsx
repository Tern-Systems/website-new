import React, {FC} from "react";
import Image from "next/image";

import styles from '@/app/common.module.css';

import SVG_DISCORD from "@/assets/images/icons/discord.svg";
import SVG_STACKOVERFLOW from "@/assets/images/icons/stack-overflow.svg";
import SVG_GITHUB from "@/assets/images/icons/github.svg";
import SVG_X from "@/assets/images/icons/x-twitter.svg";
import SVG_REDDIT from "@/assets/images/icons/reddit.svg";
import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_FACEBOOK from "@/assets/images/icons/facebook.svg";


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
        <li key={link.href} className={`size-[min(8dvw,2rem)] ${styles.clickable}`}>
            <a href={link.href} target={'_blank'}>
                <Image src={link.svg} alt={link.href} className={'h-full w-auto'}/>
            </a>
        </li>
    ));

    return (
        <div
            className={`${styles.highlight} w-full max-w-[min(26.5rem)] gap-[min(8dvw,3.12rem)] text-[min(5.3dvw,2rem)]
                        sm:w-fit sm:mx-auto`}>
            <p className={'font-oxygen text-header-l'}>Tern</p>
            <p >New York, New York</p>
            <p className={'font-normal text-[]'}>
                <a href={'mailto:info@tern.ac'} target={'_blank'} className={styles.clickable}>info@tern.ac</a>
            </p>
            <ul className={'flex gap-[--s-small]'}>{Links}</ul>
        </div>
    )
}

export default ContactsPage