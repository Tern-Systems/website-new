'use client';

import { FC } from 'react';
import Image from 'next/image';

import { MediaCardType } from '@/app/types/blog';
import { Fallback } from '@/app/static';

import { formatDate } from '@/app/utils';

import { VideoOverlay, VideoOverlayProps } from '@/app/ui/organisms/VideoOverlay';

import FALLBACK from '@/assets/images/courses-fallback.png';

interface Props extends MediaCardType, Omit<VideoOverlayProps, 'label'> {}

const MediaCard: FC<Props> = (props: Props) => {
    const { title, thumbnail, label, durationMs, date } = props;

    return (
        <div className={'grid grid-rows-[3fr,1fr]'}>
            <div className={'relative'}>
                <div className={'contents'}>
                    <Image
                        src={thumbnail || FALLBACK}
                        alt={'Video Thumbnail'}
                        width={500}
                        height={500}
                        className={'w-full object-cover  h-[11.792rem] md:h-[8.603rem] lg:h-[9.469rem]'}
                    />
                </div>
                <VideoOverlay
                    label={label}
                    durationMs={durationMs}
                />
            </div>
            <div className={'text-white  [&_*]:mt-3xs md:[&_*]:mt-4xs-1 lg:[&_*]:mt-4xs'}>
                <p className={'text-12'}>{title}</p>
                <p className={'text-10'}>{date ? formatDate(date, 'short') : 'Date is ' + Fallback}</p>
            </div>
        </div>
    );
};

MediaCard.displayName = MediaCard.name;

export { MediaCard };
