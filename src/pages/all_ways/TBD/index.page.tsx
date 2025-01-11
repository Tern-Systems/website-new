import {FC} from "react";

import styles from "@/app/common.module.css";


const TBDPage: FC = () => (
    <div className={`${styles.highlight} w-[min(90dvw,33rem)] place-items-center [&&]:mx-auto [&&]:text-center`}>
        <span className={'text-[min(9.6dvw,3.75rem)] font-oxygen font-bold'}>All Ways</span>
    </div>
);


export default TBDPage;
