import { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';

const AboutPrivacy: FC = () => {
    return (
        <section
            className={cn(`mt-6xl-1 mb-6xl-1 w-full max-w-[62rem] text-nowrap place-self-center`, `md:px-0`, `lg:px-l`)}
        >
            <div
                className={cn(
                    `grid gap-[min(4dvw,0.56rem)] text-left items-start text-16 whitespace-pre-wrap`,
                    `grid-cols-1 md:grid-cols-[minmax(0,4fr),minmax(0,6fr)] lg:grid-cols-[minmax(0,4fr),minmax(0,6fr)]`,
                )}
            >
                <span className={'mb-l'}>
                    <span>About your privacy</span>
                </span>
                <div>
                    <p className={'leading-tight'}>
                        Tern collects Basic Personal Data enabling you to create and use your Tern account. You provide
                        this personal data at registration, when updating your profile, or through an Identity Provider.
                        Tern uses secured storage and communications, and justified use within Tern to protect your
                        data. Your Basic Personal Data will be stored as long as you have an active Tern account.
                        <br />
                        <br />
                        <br />
                        The&nbsp;
                        <Link
                            className={'text-blue'}
                            href={'#'}
                        >
                            Tern Privacy Policy
                        </Link>
                        &nbsp; provided detailed information about your privacy rights.
                    </p>
                </div>
            </div>
        </section>
    );
};
export { AboutPrivacy };
