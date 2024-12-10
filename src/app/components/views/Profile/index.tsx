import React, {FC, ReactElement, useState} from "react";

import {useModal, useUser} from "@/app/context";

import {Collapsible} from "@/app/components/Collapsible";

import {Button} from "@/app/components/form";

import {DeleteAccountModal} from "./DeleteAccountModal";

import styles from './Profile.module.css';


const SECTIONS: string[] = [
    'Account Credentials',
    'Contact Information',
    'Company or Organization',
    'Third-Party Applications',
    'Addresses',
    'Offboarding',
]

const ProfileView: FC = () => {
    const modalCtx = useModal();
    const userCtx = useUser();

    const [activeSectionIdx, setActiveSectionIdx] = useState(0);

    // Elemetns
    const SectionsNav: ReactElement[] = SECTIONS.map((link, index) => {
        const anchor = '#' + link.split(' ').join('');
        return (
            <li
                key={anchor + index}
                className={`pl-[1.88rem] leading-[200%] ${index === activeSectionIdx ? `before:bg-control3 ${styles.line}` : ''}`}
            >
                <a
                    href={anchor}
                    onClick={() => {
                        setActiveSectionIdx(index);
                        document.querySelector(anchor)?.scrollIntoView({behavior: 'smooth'});
                    }}
                >
                    {link}
                </a>
            </li>
        );
    });

    return (
        <div className={'flex mt-[3.88rem]'}>
            <aside className={'text-left ml-[14.89rem] text-nowrap fixed'}>
                <div className={'text-[1.69rem] font-bold mb-[1.56rem]'}>
                    <span>Sections</span>
                </div>
                <ul className={`flex flex-col text-[1.125rem] ${styles.line} before:bg-control4`}>
                    {SectionsNav}
                </ul>
            </aside>
            <div className={'flex-grow flex flex-col gap-y-[0.62rem] ml-[42.81rem]'}>
                <Collapsible title={SECTIONS[0]} icon={'key'}>
                    TODO
                </Collapsible>
                <Collapsible title={SECTIONS[1]} icon={'book'}>
                    TODO
                </Collapsible>
                <Collapsible title={SECTIONS[2]} icon={'building'}>
                    TODO
                </Collapsible>
                <Collapsible title={SECTIONS[3]} icon={'geo'}>
                    TODO
                </Collapsible>
                <Collapsible title={SECTIONS[4]} icon={'blocks'}>
                    TODO
                </Collapsible>
                <Collapsible title={SECTIONS[5]}>
                    <span className={'text-[1.31rem]'}>Account Offboarding</span>
                    <span>{userCtx.userData ? 'Delete your account and data' : '--'}</span>
                    {userCtx.userData === null
                        ? <span>--</span>
                        : (<Button
                            icon={'delete-square'}
                            className={'flex-row-reverse'}
                            onClick={() => modalCtx.openModal(<DeleteAccountModal userData={userCtx.userData}/>)}
                        >
                            Delete
                        </Button>)
                    }
                </Collapsible>
            </div>
        </div>
    )
}

export {ProfileView}