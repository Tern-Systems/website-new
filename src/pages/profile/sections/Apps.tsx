import React, {FC, ReactElement} from "react";
import cn from "classnames";

import {ButtonIcon} from "@/app/ui/form/Button";

import {useUser} from "@/app/context";

import {Collapsible} from "@/app/ui/misc";
import {Button} from "@/app/ui/form";

import styles from "@/pages/profile/Profile.module.css";


const APPS = 'Third-Party Applications';

const DATA_STORAGE: string[] = ["Google Drive", "Dropbox", "SharePoint"];
const SOCIAL_MEDIA: string[] = [
    "Discord",
    "WhatsApp",
    "Instagram",
    "Stack Overflow",
    "GitHub",
    "X",
    "Reddit",
    "LinkedIn",
    "Facebook",
];


const AppsSection: FC = () => {
    const {userData} = useUser();

    if (!userData)
        return null;

    const renderConnectedApps = (
        apps: string[],
        userApps: { name: string; link: string }[]
    ): ReactElement[] => {
        return apps.map((app, idx) => {
            const userApp = userApps.find((userApp) => userApp.name === app);
            const isFound = userApp !== undefined;
            const text = `Connect` + (isFound ? `ed` : ``);
            const icon: ButtonIcon = isFound ? "mark-square" : "plus-square";

            return (
                <span key={app + idx} className={"contents"}>
                    {isFound
                        ? (
                            <a
                                href={userApp?.link}
                                className={`capitalize col-start-2 ${styles.midCol} ${styles.ellipsis}`}
                                target={"_blank"}
                            >
                                {app}
                            </a>
                        )
                        : <span className={`capitalize col-start-2 ${styles.midCol} ${styles.ellipsis}`}>{app}</span>
                    }
                    <Button
                        icon={icon}
                        hovered={{
                            icon: isFound ? "close-square" : icon,
                            text: isFound ? "" : "Disconnect",
                            className: isFound ? 'bg-red' : 'bg-blue',
                        }}
                        className={cn(`col-start-3 flex-row-reverse place-self-end text-section-xs font-bold`, styles.ellipsis)}
                        onClick={() => {
                            // TODO
                        }}
                    >
                       <span className={'sm:hidden'}>{text}</span>
                    </Button>
                </span>
            )
        });
    };


    return (
        <Collapsible title={APPS} icon={"blocks"}>
            <span className={styles.leftCol + " " + styles.ellipsis}>Domain</span>
            {userData.personalDomain
                ? (
                    <>
                        <a href={userData.personalDomain.link} target={"_blank"}>
                            {userData.personalDomain.link}
                        </a>
                    </>
                )
                : <span>--</span>
            }

            <Button
                disabled={userData.personalDomain?.isVerified}
                icon={
                    userData.personalDomain?.isVerified
                        ? "mark-flower"
                        : "plus-flower"
                }
                className={"col-start-3 flex-row-reverse place-self-end"}
            >
                <span className={'sm:hidden'}>Verif{userData.personalDomain?.isVerified ? "ied" : "y"}</span>
            </Button>

            <span className={`mt-[--p-content] ${styles.leftCol} ${styles.ellipsis}`}>
                        Data Storage
                    </span>
            <span className={`col-start-2 text-section-xs self-end ${styles.ellipsis}`}>
                        Applications
                    </span>
            {renderConnectedApps(DATA_STORAGE, userData.connectedApps.data)}

            <span className={`mt-[--p-content] ${styles.leftCol} ${styles.ellipsis}`}>
                        Social Media
                    </span>
            <span className={"col-start-2 text-section-xs self-end"}>
                        Applications
                    </span>
            {renderConnectedApps(SOCIAL_MEDIA, userData.connectedApps.social)}
        </Collapsible>
    );
}


export {AppsSection, APPS} ;
