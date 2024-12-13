'use client'

import React, {FC} from "react";

import styles from "@/app/common.module.css";


const HomePage: FC = () => (
    <div className={`${styles.highlight} w-[58.625rem] gap-[1.5rem]`}>
        <h1 className={'text-blue text-[6.25rem]'}>All Ways</h1>
        <span className={'text-[2.25rem] text-primary font-bold'}>
            We develop, manufacture, preserve, and enhance fundamental computer software and hardware.
        </span>
    </div>
);

export default HomePage;