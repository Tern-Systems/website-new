'use client';

import { FC } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

// TODO rework to be section + gradients
interface Props {
  url: StaticImageData | string;
  className?: string;
  position?: string; // optional override like "top", "center", "center 20%"
}

const MainBackground: FC<Props> = ({ url, className, position = 'center' }) => {
  const imageUrl = typeof url === 'string' ? url : url.src;

  return (
    <div
      style={{
        backgroundImage: `url("${imageUrl}")`,
        backgroundPosition: position,
      }}
      className={cn(
        'absolute max-w-dvw min-h-full h-screen max-h-[100rem] w-dvw',
        'bg-fixed bg-cover bottom-0 right-0 top-0',
        className,
      )}
    />
  );
};

MainBackground.displayName = MainBackground.name;

export { MainBackground };

