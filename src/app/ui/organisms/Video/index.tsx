'use client';

import { ForwardedRef, forwardRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import cn from 'classnames';

import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle as faPlayCircleReg } from '@fortawesome/free-regular-svg-icons';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
    url: string;
    playIcon?: 'circle' | 'default';
    className?: string;
}

const Video = (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const { url, playIcon, className } = props;

    const [videoStarted, setVideoStarted] = useState(false);

    const handleStartVideo = () => {
        if (!videoStarted) setVideoStarted(true);
    };

    return (
        <div
            ref={ref}
            onClick={handleStartVideo}
            className={cn(
                'relative mx-auto h-[52dvw] aspect-video cursor-pointer',
                'before:x-[absolute,size-[100.1%],bg-black]',
                { ['before:hidden']: videoStarted },
                className,
            )}
        >
            <FontAwesomeIcon
                icon={playIcon === 'circle' ? faPlayCircleReg : faPlayCircle}
                className={cn(
                    'absolute z-50 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2',
                    'size-[1.566rem] md:size-[3.62rem] lg:size-[3.241rem]',
                    { ['hidden']: videoStarted },
                )}
            />
            <div className={'contents [&_*]:!size-full'}>
                <ReactPlayer
                    url={url}
                    playing={videoStarted}
                />
            </div>
        </div>
    );
};

const VideoElement = forwardRef(Video);

VideoElement.displayName = Video.name;

export { VideoElement as Video };
