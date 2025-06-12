'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';
import PNG_TERN_IMAGE from '@/assets/images/pexels-sean-whang-25006-804269 1.png';

interface Props {
  alt?: boolean;
}

const TernAcademy: FC<Props> = ({ alt }) => {
  return (
    <div
      className={cn('relative flex flex-col w-full items-center overflow-hidden', {
        'h-[88.625rem]': alt, // Matches image height
      })}
    >
      
      <Image
        src={PNG_TERN_IMAGE}
        alt="Tern Academy"
        fill
        className="object-cover w-full h-auto"
        priority
      />

      
      <span
        className="absolute z-10 text-white text-[4rem] md:text-[10rem] font-semibold leading-none"
        style={{ top: '5%', right: '16%' }}
      >
        tern
      </span>

      
      <div
        className="absolute z-10 text-black max-w-[24rem] left-[3rem] top-[25%] md:top-[45%] text-left space-y-6"
      >
        <h2 className="text-2xl md:text-4xl font-semibold">Tern Academy</h2>
        <p className="text-base md:text-lg leading-relaxed">
          Tern Academy is your premier destination for diving into the world of ternary computing,
          offering a comprehensive lineup of expertly designed courses that cover all things tern.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          Whether you're exploring foundational languages like G25 and BFMC, mastering the innovative
          Tial software stack, or diving into advanced topics like K72.1, our curriculum spans a wide
          array of subjects to equip you with cutting-edge skills.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          With courses tailored for both beginners and seasoned developers, Tern Academy ensures you
          have the tools and knowledge to excel in this groundbreaking field, no matter your starting
          point.
        </p>
      </div>

      <PageLink
        href={' '}
        icon={'arrow-right-long'}
        className={cn(
          'absolute flex-row-reverse justify-between px-xl py-s bg-blue text-white rounded-sm',
          'text-14 md:text-18',
          'bottom-[6rem] left-[3rem]'
        )}
        iconClassName={cn('sm:size-6xs sm:[&_*]size-6xs size-3xs ml-s')}
      >
        Explore All Courses
      </PageLink>
    </div>
  );
};

TernAcademy.displayName = TernAcademy.name;
export { TernAcademy };