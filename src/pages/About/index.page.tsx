import React, {FC} from "react";

import {Route} from "@/app/static";

import {Highlighted} from "@/app/ui/misc";
import {PageLink} from "@/app/ui/layout";

import styles from "@/app/common.module.css";


const AboutPage: FC = () => {
    const BtnCredo = (
        <PageLink
            href={Route.Credo}
            className={`${styles.clickable} w-fit rounded-full border-small border-control-gray-l0 text-small
                        px-[0.91rem] py-[0.38rem]
                        sm:x-[px-[0.6rem],py-[0.25rem]]`}
        />
    );

    return (
        <Highlighted
            heading={'We are Tern.'}
            btn={BtnCredo}
            classNameWrapper={'sm:max-h-[21.4rem]'}
            classNameContentWrapper={`mb-[2.56rem]
                                      lg:[&]:overflow-hidden
                                      sm:mb-[--p-content-s]`}
            className={`sm:text-section-sm
                        sm:landscape:tracking-[0.04rem]`}
        >
            <p>A technology company based out of the United States.</p>
            <p>
                Ushering in the era of efficient computing, equipping all legacy devices with advanced
                microprocessors.
            </p>
            <p>
                On a mission to revolutionize computing by harnessing the power of ternary
                microprocessors.
            </p>
        </Highlighted>
    );
}


export default AboutPage;
