'use client';

import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

import { Fallback } from '@/app/static';

import { checkNumber } from '@/app/utils';

import { faPlayCircle as faPlayCircleReg } from '@fortawesome/free-regular-svg-icons';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const LABEL_CN = 'inline px-4xs py-5xs text-12';

interface Props {
    playIcon?: 'circle' | 'default';
    durationMs?: number;
    label?: string;
    hidden?: boolean;
    className?: {
        label?: string;
        duration?: string;
    };
}

const VideoOverlay: FC<Props> = (props: Props) => {
    const { hidden, playIcon = 'default' as Props['playIcon'], durationMs, label, className } = props;

    let secondsStr = '';
    let minutesStr = '';
    let hoursStr = '';

    const hasDuration = checkNumber(durationMs);
    const hideInfo = !hasDuration || hidden;

    if (hasDuration) {
        const seconds = durationMs / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;

        secondsStr = checkNumber(seconds) ? (seconds % 60).toFixed(0).padStart(2, '0') : Fallback;
        minutesStr = checkNumber(minutes) ? minutes.toFixed(0).padStart(2, '0') + ':' : Fallback;
        hoursStr = checkNumber(hours) && hours > 0 ? hours.toFixed(0).padStart(2, '0') + ':' : '';
    }

    return (
        <div
            className={cn(
                'absolute inset-0 grid items-center justify-items-center  border-s border-gray-l0',
                'grid-cols-[min-content,1fr,min-content] grid-rows-[min-content,1fr,min-content]',
            )}
        >
            <p className={cn(LABEL_CN, 'bg-gray-l2 text-black', { ['collapse']: hideInfo }, className?.label)}>
                {label}
            </p>
            <FontAwesomeIcon
                icon={playIcon === 'circle' ? faPlayCircleReg : faPlayCircle}
                className={cn(
                    'absolute z-50 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2',
                    'size-[1.566rem] md:size-[3.62rem] lg:size-[3.241rem]',
                    { ['hidden']: hidden },
                )}
            />
            <p
                className={cn(
                    LABEL_CN,
                    'col-start-3 row-start-3  text-white bg-gray-l1',
                    { ['collapse']: hideInfo },
                    className?.duration,
                )}
            >
                {hasDuration ? `${hoursStr}${minutesStr}${secondsStr}` : '.'}
            </p>
        </div>
    );
};

export type { Props as VideoOverlayProps };
export { VideoOverlay };
