'use client';

import { Breakpoint } from '@/app/static';

import { getId } from '@/app/utils';
import { useBreakpointCheck, useModal, useUser } from '@/app/hooks';

import { Collapsible } from '@/app/ui/organisms';
import { Button } from '@/app/ui/form';
import { DeleteAccountModal } from '@/pages/profile/DeleteAccountModal';

import styles from '@/pages/profile/Profile.module.css';

import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';

const OFFBOARDING = 'Offboarding';

function OffboardingSection() {
    const { userData } = useUser();
    const modalCtx = useModal();

    const sm = [Breakpoint.sm, Breakpoint.xs, Breakpoint.xxs, Breakpoint.x3s].includes(useBreakpointCheck());
    const md = useBreakpointCheck() === Breakpoint.md;

    const title_CN = `[&&]:text-14  [&&]:md:text-21  [&&]:lg:text-21`;
    const label_CN = `align-bottom [&&]:text-12  [&&]:md:text-16  [&&]:lg:text-16`;

    const handleOpenModal = () => modalCtx.openModal(<DeleteAccountModal userData={userData} />, { darkenBg: true });

    return (
        <Collapsible
            title={OFFBOARDING}
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            classNameWrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-18  md:text-27  lg:text-27`}
            classNameTitleIcon={`[&]:max-w-5xs  [&]:md:max-w-n  [&]:lg:max-w-n`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                <span className={sm || md ? 'hidden' : ''}>Account</span> Offboarding
            </span>
            <span className={`${styles.midCol} ${styles.ellipsis} ${label_CN}`}>Delete your account and data</span>
            <Button
                icon={faSquareXmark}
                className={'flex-row-reverse [&]:place-content-end'}
                onClick={handleOpenModal}
            >
                <span className={`${sm || md ? 'hidden' : ''} text-14`}>Delete</span>
            </Button>
        </Collapsible>
    );
}

OffboardingSection.ID = getId(OFFBOARDING);

export { OffboardingSection };
