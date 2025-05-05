'use client';

import { ForwardedRef, forwardRef, useState } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';

import { VideoOverlay, VideoOverlayProps } from '@/app/ui/organisms/VideoOverlay';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props extends Omit<VideoOverlayProps, 'className'> {
    url?: string;
    className?: string;
}

const Video = (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const { url, label, durationMs, className } = props;

    const [videoStarted, setVideoStarted] = useState(false);

    const togglePlay = () => setVideoStarted((prevState) => !prevState);

    return url ? (
        <div
            ref={ref}
            onClick={togglePlay}
            className={cn(
                'relative mx-auto aspect-video cursor-pointer bg-black',
                'before:x-[absolute,size-[100.1%],bg-black]',
                { ['before:hidden']: videoStarted },
                className,
            )}
        >
            <VideoOverlay
                hidden={videoStarted}
                label={label}
                durationMs={durationMs}
                className={{ label: 'text-20', duration: 'text-20' }}
            />
            <div className={'contents [&_*]:!size-full'}>
                <ReactPlayer
                    url={url}
                    playing={videoStarted}
                />
            </div>
        </div>
    ) : (
        <p>The video is not found...</p>
    );
};

const VideoElement = forwardRef(Video);

VideoElement.displayName = Video.name;

export { VideoElement as Video };
