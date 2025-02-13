'use client';

import { Route } from '@/app/static';

import { useBackground } from './hooks';

import '@/app/globals.css';
import styles from './common.module.css';

const NotFound = () => {
    const bgSrc = useBackground();
    return (
        <div
            style={{ backgroundImage: `url("${bgSrc}")` }}
            className={`flex h-screen flex-col items-center justify-center bg-cover bg-no-repeat text-primary`}
        >
            <div>
                <p className={`font-english text-heading ${styles.typewriter}`}>Page not found</p>
            </div>
            <div className={'mt-[min(4dvw,2rem)] flex flex-col gap-y-[min(2.6dvw,1rem)] text-center italic'}>
                <p>A fork in the road, three ways to go</p>
                <p>The rapturous traveler seeks to forge his own</p>
                <p>This path you tread, is but a mirage</p>
                <p>An empty husk; A hollow facade...</p>
            </div>
            <div className={'absolute bottom-l text-basic underline'}>
                <a href={Route.Home}>Return to Home page</a>
            </div>
        </div>
    );
};

export default NotFound;
