import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { MISC_LINKS } from '@/app/static';

import styles from '@/app/common.module.css';

import { useUser } from '@/app/context';

import { Highlighted } from '@/app/ui/misc';
import { Button } from '@/app/ui/form';

import SVG_TERNKEY from '/public/images/ternkey.png';

const TernKeyPage: FC = () => {
    const userCtx = useUser();
    const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV ?? 'development';
    const website: string | undefined = env === 'development' ? 'http://localhost:3001' : MISC_LINKS.TernKey;
    return (
        <>
            <span className={cn(styles.highlight, 'flex-row gap-x-l')}>
                <span className={'flex flex-col justify-between'}>
                    <span className={'mr-auto text-[min(9.6dvw,3.75rem)] font-bold'}>TernKey</span>
                    <span>
                        <span className={'text-basic'}>Unlocking the Potential of Ternary Programming</span>
                        <Button className={'rounded-full bg-white px-xl py-5xs text-basic text-black'}>
                            Try it free
                        </Button>
                    </span>
                </span>
                <a
                    href={
                        userCtx.token ? `${website}/?website_login=${encodeURIComponent(userCtx.token || '')}` : website
                    }
                    target={'_blank'}
                    className={'rounded-s bg-[#EEE] p-n sm:landscape:x-[row-span-2,my-0]'}
                >
                    <Image
                        src={SVG_TERNKEY}
                        alt={'insignia'}
                        className={'h-[20dvw] max-h-[min(25dvw,40rem)] w-auto'}
                    />
                </a>
            </span>
            <Highlighted
                heading={'Placeholder title'}
                classNameWrapper={'lg:x-[mt-xl,ml-auto,max-h-fit,max-w-full] sm:landscape:max-h-[21.4rem]'}
                classNameContentWrapper={'overflow-y-visible'}
                className={`sm:text-section-sm sm:landscape:x-[gap-y-[0.5rem],tracking-[0.05rem]]`}
            >
                TernKey, developed by Tern Systems, is a pioneering Software-as-a-Service (SaaS) platform aimed at
                propelling the shift from binary to ternary computing. By leveraging the enhanced data density and
                efficiency of ternary logic, TernKey empowers Developers to explore ternary-based programming in a
                dedicated sandbox environment, complete with Languages uniquely designed for ternary logic: BTMC, TERN,
                and G. BTMC serves as the Machine Code layer, providing direct control over the ternary hardware with
                compact, optimized commands. TERN, a ternary Assembly Language, acts as a bridge between High-Level Code
                and BTMC, supporting efficient data handling and memory management. At the highest level, G offers a
                user-friendly syntax inspired by C, enabling Developers to delve into ternary computing with familiar
                constructs. TernKey’s Emulator includes Input and Output Code Windows, enabling seamless transitions
                between Code writing, execution, and debugging. Integrated tools such as a Sidebar for project
                management, Save features, and Documentation facilitate a streamlined workflow. Additionally, the
                platform’s community-focused Explore Keys Store feature fosters collaborative learning by allowing users
                to Share and explore Public Keys, making TernKey a comprehensive platform for advancing ternary
                programming and innovation.
            </Highlighted>
        </>
    );
};

export default TernKeyPage;
