import React, {Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState,} from "react";
import cn from "classnames";

import {Res} from "@/app/types/service";
import {UpdateUserData} from "@/app/services/user.service";
import {EditableProps} from "@/app/ui/form/Editable";
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import {UserService} from "@/app/services";

import {useBreakpointCheck, useLoginCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {MessageModal} from "@/app/ui/modals";

import {OFFBOARDING, OffboardingSection} from "./sections/Offboarding";
import {APPS, AppsSection} from "./sections/Apps";
import {ADDRESSES, AddressesSection} from "./sections/Addresses";
import {COMPANY, CompanySection} from "./sections/Company";
import {CONTACT, ContactSection} from "./sections/Contact";
import {ACCOUNT, AccountSection} from "./sections/Account";

import styles from "./Profile.module.css";


interface SectionProps {
    update: (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => Promise<void>;
    setEditId: Dispatch<SetStateAction<string | null>>,
    editId: string | null
}


const SECTIONS: string[] = [
    ACCOUNT,
    CONTACT,
    COMPANY,
    ADDRESSES,
    APPS,
    OFFBOARDING,
];


const getSimpleToggleProps = (
    setEditId?: Dispatch<SetStateAction<string | null>>,
    isEditState?: string | null
): Pick<
    EditableProps,
    | "classNameWrapper"
    | "classNameToggle"
    | "setParentEditId"
    | "parentEditId"
> => ({
    classNameWrapper: "w-[min(100%,21.625rem)]",
    classNameToggle: "col-start-3",
    setParentEditId: setEditId,
    parentEditId: isEditState,
});


const ProfilePage: FC = () => {
    const modalCtx = useModal();
    const {userData, token, fetchUserData} = useUser();
    const isLoggedIn = useLoginCheck();
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

    const sectionsRef = useRef<HTMLDivElement>(null);
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [editId, setEditId] = useState<string | null>('');


    useEffect(() => {
        const handleScroll = () => {
            SECTIONS.forEach((section, index) => {
                const elem = document.getElementById(
                    section.toLowerCase().split(" ").join("")
                );
                if (
                    elem &&
                    elem.getBoundingClientRect().top < 0.5 * window.innerHeight
                )
                    setActiveSectionIdx(index);
            });
        };
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, [isSmScreen]);


    if (!userData || !isLoggedIn || !token)
        return null;


    const handleUpdate = async (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => {
        try {
            let responseMsg: string;
            if (typeof valueOrHandle === 'function') {
                const {message} = await valueOrHandle();
                responseMsg = message;
            } else {
                const newUserData = {...userData, photo: null, ...valueOrHandle};
                const {message} = await UserService.postUpdateUser(userData.email, newUserData);
                responseMsg = message;
            }
            modalCtx.openModal(<MessageModal>{responseMsg}</MessageModal>);
            await fetchUserData(false);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    const SectionsNav: ReactElement[] = SECTIONS.map((link, idx) => (
        <li
            key={link + idx}
            className={cn(
                `pl-l leading-[200%] cursor-pointer
                sm:landscape:pl-xxs`,
                {[`before:bg-blue ${styles.line}`]: idx === activeSectionIdx}
            )}
        >
            <span
                onClick={() => {
                    setActiveSectionIdx(idx);
                    const id = "#" + link.toLowerCase().split(" ").join("");
                    document
                        .querySelector(id)
                        ?.scrollIntoView({behavior: "smooth", inline: "center"});
                }}
            >
                {link}
            </span>
        </li>
    ));

    return (
        <div className={cn(
            "flex",
            'lg:mt-[3.88rem]',
            `md:portrait:h-[calc(100%-2*var(--p-xs))] md:x-[mt-xs,px-xs,overflow-y-scroll]`,
            `sm:mt-0`,
            `sm:portrait:h-[calc(100%-2*var(--p-xxl))] sm:portrait:x-[mt-xxl,px-xs,overflow-y-scroll]`,
            `sm:landscape:h-[calc(100%-2*var(--p-xs))] sm:landscape:x-[mt-xs,px-xs,overflow-y-scroll]`,
        )}
        >
            <aside
                className={cn(
                    `sticky self-start text-left text-nowrap`,
                    `hidden top-[min(25.3dvw,3.88rem)] ml-[min(5.3dvw,15rem)]`,
                    `lg:block`,
                )}
            >
                <div
                    className={cn(
                        `font-bold`,
                        `mb-s text-heading`,
                        `sm:landscape:text-heading-s`,
                    )}
                >
                    <span>Sections</span>
                </div>
                <ul
                    className={cn(styles.line,
                        `flex flex-col before:bg-white`,
                        `text-section`,
                        `sm:landscape:text-section-xs`,
                    )}
                >
                    {SectionsNav}
                </ul>
            </aside>
            <div
                ref={sectionsRef}
                className={cn(
                    `flex-grow flex flex-col gap-y-4xs`,
                    `lg:ml-[10rem]`,
                    `sm:landscape:x-[grid,auto-rows-min,grid-cols-2,gap-5xs] sm:landscape:[&>div]:place-self-start`,
                )}
            >
                <AccountSection setEditId={setEditId} editId={editId} update={handleUpdate}/>
                <ContactSection setEditId={setEditId} editId={editId} update={handleUpdate}/>
                <CompanySection setEditId={setEditId} editId={editId} update={handleUpdate}/>
                <AddressesSection setEditId={setEditId} editId={editId} update={handleUpdate}/>
                <AppsSection/>
                <OffboardingSection/>

                <ScrollEnd/>
            </div>
        </div>
    );
};


export type {SectionProps};
export {getSimpleToggleProps};
export default ProfilePage;
