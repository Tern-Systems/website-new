'use client'

import React, {FC, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import cn from "classnames";

import {useLoginCheck} from "@/app/hooks";
import {useFlow, useModal} from "@/app/context";

import {ResetPasswordModal} from "@/app/ui/modals";
import {Highlighted} from "@/app/ui/misc";

import styles from "@/app/common.module.css";


const PARAGRAPHS: string[] = [
    "We abide by the following doctrine, which outlines our core ideology's six core values and exclusive purpose. We look for consistency, earnestness, acumen, flexibility, obsession, and ingenuity in each constituent we interact with. These six values, defined as follows, outline our organization's expectations and illustrate the characteristics we respect and adhere to.",
    "Consistency is conveyed through established dependability and predictability of character, stemming from unwavering commitment to their purpose Earnestness inspires sincere and intense conviction, sustained by a strongly formed belief in one’s principles Acumen produces sound judgments and quick decisions, bolstered by an unwavering confidence in one’s expertise and abilities. Flexibility increases the propensity to bend easily without breaking and is derived from frequently maintaining an open mind Obsession provokes fanatical attention to detail past the point of rationality but stems from a place of deep, unapologetic love. Ingenuity encapsulates cleverness, originality, and inventiveness, originating from resolute passion.",
    "While our values may serve as a general guide for the characteristics sought by groups and individuals, our purpose encapsulates an exacting and eternal meaning for our company's existence.. The overarching perpetual driving purpose of Tern is to develop, manufacture, preserve, and enhance fundamental computer software and hardware, emphasizing universal efficiency across all processes. This ideology serves as our organization’s moral compass. We aim to pursue these values and purpose everlastingly.",
];


const HomePage: FC = () => {
    const params = useSearchParams();
    const modalCtx = useModal();
    const flowCtx = useFlow();
    useLoginCheck();

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token && !modalCtx.isOpened)
            return modalCtx.openModal(<ResetPasswordModal token={token}/>);
        flowCtx.next()?.();
        //eslint-disable-next-line
    }, [params?.size])

    const Paragraphs = PARAGRAPHS.map((p, idx) => <p key={p.slice(5) + idx}>{p}</p>)

    return (
        <div className={'grid grid-rows-[100dvh,100dvh] gap-y-[--p-content] max-h-fit'}>
            <div className={cn(styles.highlight,
                `max-w-[62.5rem]`,
                `sm:landscape:w-[41dvw]`,
            )}
            >
                <h1 className={cn(
                    `text-blue`,
                    `mb-[--p-content] text-[6.25rem]`,
                    `sm:x-[mb-[0.94rem]]`,
                    `sm:portrait:text-[3.125rem]`,
                    `sm:landscape:text-[6.2dvw]`
                )}
                >
                    All Ways
                </h1>
                <span
                    className={cn(
                        `font-bold leading-[120%]`,
                        `lg:x-[text-[2.25rem],tracking-[0.04rem]]`,
                        `sm:text-[1.125rem]`
                    )}
                >
                    We develop, manufacture, preserve, and enhance fundamental computer software and hardware.
                </span>
            </div>
            <Highlighted
                heading={'Our Credo'}
                classNameWrapper={'lg:x-[ml-auto,max-h-fit,max-w-full] sm:landscape:max-h-[21.4rem]'}
                classNameContentWrapper={'overflow-y-visible'}
                className={`sm:text-section-sm
                        sm:landscape:x-[gap-y-[0.5rem],tracking-[0.05rem]]`}
            >
                {Paragraphs}
            </Highlighted>
        </div>

    );
}

export default HomePage;