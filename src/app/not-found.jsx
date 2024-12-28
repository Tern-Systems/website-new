import {Route} from "@/app/static";

import "@/app/globals.css";
import styles from '@/app/common.module.css'


const NotFound = () => (
    <div className={`flex flex-col justify-center items-center h-screen text-primary bg-content bg-cover bg-no-repeat`}>
        <div>
            <p className={`text-header font-english ${styles.typewriter}`}>Page not found</p>
        </div>
        <div className={'flex flex-col gap-y-[min(2.6dvw,1rem)] italic text-center mt-[min(4dvw,2rem)]'}>
            <p>A fork in the road, three ways to go</p>
            <p>The rapturous traveler seeks to forge his own</p>
            <p>This path you tread, is but a mirage</p>
            <p>An empty husk; A hollow facade...</p>
        </div>
        <div className={'absolute underline bottom-[--2dr] text-note'}>
            <a href={Route.Home}>Return to Home page</a>
        </div>
    </div>
);


export default NotFound;
