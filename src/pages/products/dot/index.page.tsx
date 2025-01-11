import React, {FC} from "react";
import Image from "next/image";

import {Button} from "@/app/ui/form";

import SVG_DOT from "@/assets/images/dot.svg";

import styles from "@/app/common.module.css";


const DotPage: FC = () => {
    const handleDownload = () => {
        // TODO
    }

    return (
        <div className={`m-auto`}>
            <div className={`${styles.highlight} ml-0 w-[min(90dvw,33rem)] place-items-center [&&]:text-center`}>
                <span className={'text-[min(9.6dvw,3.75rem)] font-oxygen font-bold'}>Dot</span>
                <Image
                    src={SVG_DOT}
                    alt={'insignia'}
                    className={'w-auto h-[55dvw] max-h-[16rem] my-[min(5.3dvw,3.15rem)]'}
                />
                <span className={'text-section-header'}>Your digital brain.</span>
            </div>
            <Button
                onClick={() => handleDownload()}
                className={'mt-[1rem] px-[min(4dvw,2rem)] py-[--p-content-5xs] bg-control-white text-black rounded-full font-bold place-self-center text-content'}
            >
                Download
            </Button>
        </div>
    );
}


export default DotPage;
