import React, {FC} from "react";
import Image from "next/image";

import {CONTACT_LINKS} from "@/app/static";

import styles from '@/app/common.module.css';


const ContactsPage: FC = () => {
    const Links = CONTACT_LINKS.map((link) => (
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