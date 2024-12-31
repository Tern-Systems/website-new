import {useEffect, useState} from "react";

const useBackground = (): string => {
    const [bgSrc, setBgSrc] = useState('');

    useEffect(() => {
        const image = new Image();
        const src = '/images/bg-content.gif';
        image.addEventListener('load', () => setBgSrc(src));
        image.src = src;
    }, []);

    return bgSrc;
}


export {useBackground}
