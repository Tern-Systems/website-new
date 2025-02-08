import React, {FC, ReactElement} from "react";
import Image from "next/image";

import {CONTACT_LINKS} from "@/app/static";

import styles from '@/app/common.module.css';


const ContactsPage: FC = () => {
    const Links: ReactElement[] = Object.entries(CONTACT_LINKS).map(([title, link]) => (
        <li key={title} className={`size-[2.5rem] sm:size-n ${styles.clickable}`}>
            <a href={link.href} target={'_blank'}>
                <Image src={link.svg} alt={link.href} className={'h-full w-auto'}/>
            </a>
        </li>
    ));

    return (
        <div
            className={`${styles.highlight} gap-y-[3.12rem] w-full max-w-[26.5rem]
                        sm:x-[gap-y-n,max-w-[19.2rem],w-fit,text-section]
                        sm:portrait:x-[mx-auto,p-xs]
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
            <ul className={'flex gap-3xs'}>{Links}</ul>
        </div>
    )
}


export default ContactsPage;
