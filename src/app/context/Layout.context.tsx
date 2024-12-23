'use client';

import React, {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';


interface ILayoutContext {
    toggleFullscreen: () => void;
    isNoLayout: boolean;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
}

const LayoutContext = createContext<ILayoutContext | null>(null);

const LayoutProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isNoLayout, setNoLayoutState] = useState(false);
    const [isFade, setFadeState] = useState(false);

    const fullscreenRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem('pip-mode-child') !== null)
            return handleNoLayoutState();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape')
                setNoLayoutState(false);
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const handleNoLayoutState = () => setNoLayoutState(document.fullscreenElement === null);

    const toggleFullscreen = () => {
        handleNoLayoutState();
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            fullscreenRef.current?.requestFullscreen();
    }

    return (
        <LayoutContext.Provider
            value={{
                toggleFullscreen,
                isNoLayout,
                setFadeState,
                isFade,
            }}>
            <span ref={fullscreenRef}>
                {props.children}
            </span>
        </LayoutContext.Provider>
    );
};

const useLayout = (): ILayoutContext => {
    const context = useContext(LayoutContext);
    if (!context)
        throw new Error('useLayout must be used within a ModalProvider!');
    return context;
};

export {LayoutProvider, useLayout}
