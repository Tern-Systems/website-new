import {FC} from "react";
import Image from "next/image";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";

import styles from "@/app/common.module.css";


const TernKeyPage: FC = () => (
    <div className={`${styles.highlight} w-[min(90dvw,33rem)] place-items-center [&&]:mx-auto [&&]:text-center`}>
        <span className={'text-[min(9.6dvw,3.75rem)] font-oxygen font-bold'}>TernKey</span>
        <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
            <Image
                src={SVG_INSIGNIA}
                alt={'insignia'}
                className={'h-[55dvw] max-h-[16rem] my-[min(5.3dvw,3.15rem)]'}
            />
        </a>
        <span className={'text-[min(5.6dvw,2.25rem)]'}>Unlocking the potential of ternary programming.</span>
    </div>
);


export default TernKeyPage;
