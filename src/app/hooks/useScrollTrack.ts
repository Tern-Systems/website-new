'use client';

import { useEffect, useRef, useState } from 'react';

import { ScrollState } from '@/app/contexts/layout.context';

const SCROLL_CHECK_INTERVAL_MS = 0;

const useScrollTrack = () => {
    const [scrollValue, setScrollState] = useState<ScrollState>({
        scrollTop: 0,
        scrollHeight: 0,
        autoScroll: false,
    });
    const elem = document.getElementById('top');

    const scrollIntervalRef = useRef<null | NodeJS.Timeout>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollState((prevState) => ({
                ...prevState,
                scrollHeight: elem?.scrollHeight ?? 0,
                scrollTop: elem?.getBoundingClientRect().top ?? 0,
            }));
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button === 1 && !scrollIntervalRef.current) {
                scrollIntervalRef.current = setInterval(() => {
                    handleScroll();
                }, SCROLL_CHECK_INTERVAL_MS);
            } else if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                handleScroll();
                scrollIntervalRef.current = null;
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (['ArrowDown', 'Escape', 'ArrowUp'].includes(event.key)) handleScroll();
        };

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('mouseup', handleMouseDown);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('mouseup', handleMouseDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [elem, scrollIntervalRef.current]);

    return scrollValue;
};

export { useScrollTrack };
