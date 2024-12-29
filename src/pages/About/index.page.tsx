import React, {FC} from "react";

import {Route} from "@/app/static";

import styles from "@/app/common.module.css";
import {PageLink} from "@/app/ui/layout";


const AboutPage: FC = () => (
    <div
        className={`${styles.highlight} max-w-[62.5625rem]`}>
        <div className={'leading-normal text-[min(4.8dvw,2.25rem)] font-bold'}>
            <h1 className={'text-[min(7.2dvw,3.75rem)] mb-[min(5.3dvw,3.1rem)]'}>We are Tern.</h1>
            <p className={"mb-4"}>A technology company based out of the United States.</p>
            <p className={"mb-4"}>
                Ushering in the era of efficient computing, equipping all legacy devices with advanced
                microprocessors.
            </p>
            <p>
                On a mission to revolutionize computing by harnessing the power of ternary
                microprocessors.
            </p>
        </div>
        <PageLink
            href={Route.Credo}
            className={`rounded-full border-small border-control-gray-l0 px-[--1dr] h-[--h-control] w-fit
                        mt-[min(4dvw,2.56rem)] text-small`}
        />
    </div>
);

export default AboutPage;