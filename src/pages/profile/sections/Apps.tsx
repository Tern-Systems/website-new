'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { ButtonIcon } from '@/app/ui/form/Button';
import { Breakpoint } from '@/app/static';

import { getId } from '@/app/utils';
import { useBreakpointCheck, useUser } from '@/app/hooks';

import { Collapsible } from '@/app/ui/organisms';
import { Button } from '@/app/ui/form';

import styles from '@/pages/profile/Profile.module.css';

import { faCircleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus, faSquareXmark } from '@fortawesome/free-solid-svg-icons';

const APPS = 'Third-Party Applications';

const DATA_STORAGE: string[] = ['Google Drive', 'Dropbox', 'SharePoint'];
const SOCIAL_MEDIA: string[] = [
    'Discord',
    'WhatsApp',
    'Instagram',
    'Stack Overflow',
    'GitHub',
    'X',
    'Reddit',
    'LinkedIn',
    'Facebook',
];

function AppsSection() {
    const { userData } = useUser();
    const breakpoint = useBreakpointCheck();

    if (!userData) return null;

    const sm = breakpoint <= Breakpoint.sm;
    const md = breakpoint === Breakpoint.md;

    const title_CN = `[&&]:text-14  [&&]:md:text-21  [&&]:lg:text-21`;
    const label_CN = `align-bottom [&&]:text-12  [&&]:md:text-14  [&&]:lg:text-14`;

    const renderConnectedApps = (apps: string[], userApps: { name: string; link: string }[]): ReactElement[] => {
        return apps.map((app, idx) => {
            const userApp = userApps.find((userApp) => userApp.name === app);
            const isFound = true;
            const text = isFound ? 'Connected' : 'Connect';
            const icon: ButtonIcon = isFound ? faSquarePlus : 'plus-square';

            return (
                <span
                    key={app + idx}
                    className={'contents'}
                >
                    {isFound ? (
                        <a
                            href={userApp?.link}
                            className={`col-start-2 capitalize ${styles.midCol} ${styles.ellipsis} ${label_CN}`}
                            target={'_blank'}
                        >
                            {app}
                        </a>
                    ) : (
                        <span className={`col-start-2 capitalize ${styles.midCol} ${styles.ellipsis} ${label_CN}`}>
                            {app}
                        </span>
                    )}
                    <Button
                        icon={icon}
                        hover={{
                            icon: isFound ? faSquareXmark : icon,
                            text: sm || md ? '' : isFound ? 'Disconnect' : 'Connect',
                            className: isFound ? 'bg-red' : 'bg-blue',
                        }}
                        className={cn(`col-start-3 flex-row-reverse place-self-end text-14 font-bold`, styles.ellipsis)}
                        onClick={() => {
                            // TODO
                        }}
                    >
                        {sm || md ? null : <span>{text}</span>}
                    </Button>
                </span>
            );
        });
    };

    return (
        <Collapsible
            title={APPS}
            icon={'blocks'}
            className={`${styles.collapsible} [&&]:gap-y-5xs [&&]:md:gap-y-4xs [&&]:lg:gap-y-4xs`}
            classNameWrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-18  md:text-27  lg:text-27`}
            classNameTitleIcon={`[&]:max-w-5xs  [&]:md:max-w-n  [&]:lg:max-w-n`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Domain</span>
            {userData.personalDomain ? (
                <>
                    <a
                        href={userData.personalDomain.link}
                        target={'_blank'}
                    >
                        {userData.personalDomain.link}
                    </a>
                </>
            ) : (
                <span>--</span>
            )}

            <Button
                disabled={userData.personalDomain?.isVerified}
                icon={userData.personalDomain?.isVerified ? faCircleXmark : faCirclePlus}
                className={'col-start-3 flex-row-reverse place-self-end'}
            >
                <span className={`${sm || md ? 'hidden' : ''} ${label_CN}`}>
                    Verif{userData.personalDomain?.isVerified ? 'ied' : 'y'}
                </span>
            </Button>

            <span className={`mt-xxs md:mt-xs lg:mt-xs ${styles.leftCol} ${styles.ellipsis} ${title_CN} `}>
                Data Storage
            </span>
            <span className={`col-start-2 self-end text-14 ${styles.ellipsis} ${label_CN}`}>Applications</span>
            {renderConnectedApps(DATA_STORAGE, userData.connectedApps.data)}

            <span className={`mt-xxs md:mt-xs lg:mt-xs ${styles.leftCol} ${styles.ellipsis} ${title_CN} `}>
                Social Media
            </span>
            <span className={`col-start-2 self-end text-14 ${label_CN}`}>Applications</span>
            {renderConnectedApps(SOCIAL_MEDIA, userData.connectedApps.social)}
        </Collapsible>
    );
}

AppsSection.ID = getId(APPS);

export { AppsSection };
