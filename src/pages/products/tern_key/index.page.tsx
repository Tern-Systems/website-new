import {FC} from "react";
import Image from "next/image";

import SVG_INSIGNIA from "/public/images/insignia.svg";

import styles from "@/app/common.module.css";


const TernKeyPage: FC = () => (
    <div className={`${styles.highlight} place-items-center mx-auto w-[min(90dvw,33rem)] text-center
                    sm:landscape:x-[grid,grid-rows-2,grid-cols-2]`}
    >
        <span className={'text-[min(9.6dvw,3.75rem)] font-oxygen font-bold'}>TernKey</span>
        <a href={"https://www.tern.ac/ternkey/"}
           target={'_blank'}
           className={'my-[min(5.3dvw,3.15rem)] sm:landscape:x-[row-span-2,my-0]'}
        >
            <Image
                src={SVG_INSIGNIA}
                alt={'insignia'}
                className={'w-auto h-[55dvw] max-h-[min(20dvw,16rem)] my-[min(5.3dvw,3.15rem)]'}
            />
        </a>
        <span className={'text-section-header sm:landscape:text-content-small'}>
            Unlocking the potential of ternary programming.
        </span>
    </div>
);


export default TernKeyPage;
