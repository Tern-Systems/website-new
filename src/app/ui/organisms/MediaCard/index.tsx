'use client';

import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import cn from 'classnames';

import { MediaCardType } from '@/app/types/blog';
import { Fallback } from '@/app/static';

import { checkNumber, formatDate } from '@/app/utils';

import FALLBACK from '@/assets/images/courses-fallback.png';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const LABEL_CN = 'inline px-4xs py-5xs text-12';

interface Props extends MediaCardType<string> {}

const MediaCard: FC<Props> = (props: Props) => {
    const { title, thumbnail, label, durationMs, date } = props;

    let secondsStr = '';
    let minutesStr = '';
    let hoursStr = '';

    const hasDuration = checkNumber(durationMs);

    if (hasDuration) {
        const seconds = durationMs / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;

        secondsStr = checkNumber(seconds) ? (seconds % 60).toFixed(0).padStart(2, '0') : Fallback;
        minutesStr = checkNumber(minutes) ? minutes.toFixed(0).padStart(2, '0') + ':' : Fallback;
        hoursStr = checkNumber(hours) && hours > 0 ? hours.toFixed(0).padStart(2, '0') + ':' : '';
    }

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
                <div
                    className={cn(
                        'absolute inset-0 grid items-center justify-items-center  border-s border-gray-l0',
                        'grid-cols-[min-content,1fr,min-content] grid-rows-[min-content,1fr,min-content]',
                    )}
                >
                    <p className={cn(LABEL_CN, 'bg-gray-l2 text-black')}>{label}</p>
                    <FontAwesomeIcon
                        icon={faPlayCircle}
                        className={'row-start-2 col-span-full  size-[1.566rem] md:size-[1.143rem] lg:size-[1.258rem]'}
                    />
                    <p
                        className={cn(LABEL_CN, 'col-start-3 row-start-3  text-white bg-gray-l1', {
                            ['collapse']: !hasDuration,
                        })}
                    >
                        {hasDuration ? `${hoursStr}${minutesStr}${secondsStr}` : '.'}
                    </p>
                </div>
            </div>
            <div className={'text-white  [&_*]:mt-3xs md:[&_*]:mt-4xs-1 lg:[&_*]:mt-4xs'}>
                <p className={'text-12'}>{title}</p>
                <p className={'text-10'}>{formatDate(date, 'short')}</p>
            </div>
        </div>
    );
};

MediaCard.displayName = MediaCard.name;

export { MediaCard };
