import React, {FC} from "react";

import {useModal, useUser} from "@/app/context";

import {Collapsible} from "@/app/ui/misc";
import {Button} from "@/app/ui/form";
import {DeleteAccountModal} from "@/pages/profile/DeleteAccountModal";

import styles from "@/pages/profile/Profile.module.css";


const OFFBOARDING = 'Offboarding';


const OffboardingSection: FC = () => {
    const {userData} = useUser();
    const modalCtx = useModal();

    return (
        <Collapsible title={OFFBOARDING}>
            <span className={styles.leftCol + " " + styles.ellipsis}>
                 <span className={'sm:hidden'}>Account</span> Offboarding
            </span>
            <span className={styles.midCol + " " + styles.ellipsis}>
                Delete your account and data
            </span>
            <Button
                icon={"delete-square"}
                className={"flex-row-reverse [&]:place-content-end"}
                onClick={() => modalCtx.openModal(<DeleteAccountModal userData={userData}/>, {darkenBg: true})}
            >
                <span className={'sm:hidden'}>Delete</span>
            </Button>
        </Collapsible>
    );
}


export {OffboardingSection, OFFBOARDING};
