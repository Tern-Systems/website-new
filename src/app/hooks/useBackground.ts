'use client';

import { useEffect, useState } from 'react';

import BACKGROUND_GIF from '@/assets/images/bg-content.gif';

const useBackground = (): string => {
    const [bgSrc, setBgSrc] = useState('');

    useEffect(() => {
        const image = new Image();
        const src = BACKGROUND_GIF.src;
        image.addEventListener('load', () => setBgSrc(src));
        image.src = src;
    }, []);

    return bgSrc;
};

export { useBackground };
