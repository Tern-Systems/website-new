'use client';

import { FC, ReactNode, useState, Children } from 'react';
import cn from 'classnames';

interface VideoDescriptionProps {
    date: string | number | undefined;
    description: ReactNode;
    contentClassName?: string;
    className?: string;
}

const textContent = (children: ReactNode): string => {
    return Children.toArray(children).reduce((acc: string, child: any) => {
        if (typeof child === 'string') {
            return acc + child;
        }
        if (child.props && child.props.children) {
            return acc + textContent(child.props.children);
        }
        return acc;
    }, '');
};

const VideoDescription: FC<VideoDescriptionProps> = ({ date, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const fullText = textContent(description);
    const canBeTruncated = fullText.length > 50;

    const content = isExpanded ? description : fullText.substring(0, 50);

    return (
        <div
            onClick={() => canBeTruncated && setIsExpanded((e) => !e)}
            className={cn('p-4 bg-gray', { 'cursor-pointer': canBeTruncated })}
        >
            <p className='mb-s text-gray-light'>{date}</p>
            <div>
                {content}
                {canBeTruncated && !isExpanded && (
                    <span className='font-bold'>...See More</span>
                )}
            </div>
            {canBeTruncated && isExpanded && (
                <span className={cn('font-bold')}>See Less</span>
            )}
        </div>
    );
};

export { VideoDescription }; 