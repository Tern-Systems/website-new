import React, {FC} from "react";

import {Highlighted} from "@/app/ui/misc";


const AboutPage: FC = () => (
    <Highlighted
        heading={'We are Tern.'}
        classNameWrapper={'sm:max-h-[21.4rem]'}
        classNameContentWrapper={`mb-[2.56rem]
                                      lg:[&]:overflow-hidden
                                      sm:mb-[--p-content-xs]`}
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


export default AboutPage;
