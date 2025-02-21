import React, { FC, ReactElement } from 'react';
import cn from 'classnames';

import { ButtonIcon } from '@/app/ui/form/Button';

import { useUser } from '@/app/context';
import { Breakpoint, useBreakpointCheck } from '@/app/hooks/useBreakpointCheck';

import { Collapsible } from '@/app/ui/misc';
import { Button } from '@/app/ui/form';

import styles from '@/pages/profile/Profile.module.css';

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

const AppsSection: FC = () => {
    const { userData } = useUser();

    if (!userData) return null;

    const isSm = [Breakpoint.sm, Breakpoint.xs, Breakpoint.xxs, Breakpoint.x3s].includes(useBreakpointCheck());
    const isMd = useBreakpointCheck() === Breakpoint.md;

    const title_CN = `[&&]:text-section-xs  [&&]:md:text-heading-s  [&&]:lg:text-heading-s`;
    const label_CN = `align-bottom [&&]:text-section-xxs  [&&]:md:text-section-xs  [&&]:lg:text-section-xs`;

    const renderConnectedApps = (apps: string[], userApps: { name: string; link: string }[]): ReactElement[] => {
        return apps.map((app, idx) => {
            const userApp = userApps.find((userApp) => userApp.name === app);
            const isFound = true;
            const text = isFound ? 'Connected' : 'Connect';
            const icon: ButtonIcon = isFound ? 'mark-square' : 'plus-square';

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
                        hovered={{
                            icon: isFound ? 'close-square' : icon,
                            text: isSm || isMd ? '' : isFound ? 'Disconnect' : 'Connect',
                            className: isFound ? 'bg-red' : 'bg-blue',
                        }}
                        className={cn(
                            `col-start-3 flex-row-reverse gap-[5px] place-self-end text-section-xs font-bold`,
                            styles.ellipsis,
                        )}
                        onClick={() => {
                            // TODO
                        }}
                    >
                        {isSm || isMd ? null : <span>{text}</span>}
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
            classNameTitle={`text-section-s  md:text-heading  lg:text-heading`}
            classNameTitleIcon={`[&]:max-w-[1rem]  [&]:md:max-w-[1.8125rem]  [&]:lg:max-w-[1.8125rem]`}
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
                icon={userData.personalDomain?.isVerified ? 'mark-flower' : 'plus-flower'}
                className={'col-start-3 flex-row-reverse place-self-end'}
            >
                <span className={`${isSm || isMd ? 'hidden' : ''} ${label_CN}`}>
                    Verif{userData.personalDomain?.isVerified ? 'ied' : 'y'}
                </span>
            </Button>

            <span className={`mt-xxs md:mt-xs lg:mt-xs ${styles.leftCol} ${styles.ellipsis} ${title_CN} `}>
                Data Storage
            </span>
            <span className={`col-start-2 self-end text-section-xs ${styles.ellipsis} ${label_CN}`}>Applications</span>
            {renderConnectedApps(DATA_STORAGE, userData.connectedApps.data)}

            <span className={`mt-xxs md:mt-xs lg:mt-xs ${styles.leftCol} ${styles.ellipsis} ${title_CN} `}>
                Social Media
            </span>
            <span className={`col-start-2 self-end text-section-xs ${label_CN}`}>Applications</span>
            {renderConnectedApps(SOCIAL_MEDIA, userData.connectedApps.social)}
        </Collapsible>
    );
};

export { AppsSection, APPS };
