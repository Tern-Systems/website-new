'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';

import JPG_CARD_BACK from '@/assets/images/tern-academy-card.jpg';
import SVG_LOGO from '@/assets/images/tern-logo.svg';
import { ReactSVG } from 'react-svg';

const TernAcademyCard: FC = () => {
    return (
        <div className={cn('relative flex flex-col min-h-full max-h-full sm:x-[mx-auto]')}>
            <span className='absolute w-[50%] z-10 left-0 sm:bottom-7xl md:bottom-[120px] lg:bottom-[300px] text-black sm:p-xs p-xl lg:py-xl'>
                <h3 className='sm:text-27 md:text-36 lg:text-40 pb-xl w-[100%]'>Tern Academy</h3>
                <div className='text-21 w-[373px] space-y-s sm:space-y-n md:space-y-l sm:hidden'>
                    <p>
                        Tern Academy is your premier destination for diving into the world of ternary computing,
                        offering a comprehensive lineup of expertly designed courses that cover all things Tern.
                    </p>
                    <p>
                        Whether you&apos;re exploring foundational languages like G25 and BTMC, mastering the innovative
                        Tidal software stack, or delving into advanced topics like T27I, our curriculum spans a wide
                        array of subjects to equip you with cutting-edge skills.
                    </p>
                    <p>
                        With courses tailored for both beginners and seasoned developers, Tern Academy ensures you have
                        the tools and knowledge to excel in this groundbreaking field, no matter your starting point.
                    </p>
                </div>
                <PageLink
                    href={''} // TODO
                    icon={'arrow-right-long'}
                    className={cn(
                        'flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue mt-4xl',
                        'text-14 lg:text-16 text-white',
                        'right-n bottom-n h-fit !w-fit',
                        'sm:hidden',
                    )}
                    iconClassName='sm:size-6xs sm:[&_*]size-6xs size-3xs ml-xl'
                >
                    Explore all courses
                </PageLink>
            </span>
            <ReactSVG
                src={SVG_LOGO.src}
                onClick={() => {}}
                className={cn(
                    'right-[10rem] sm:right-[3rem] top-[3rem] absolute object-cover object-center z-50 sm:w-[120px] md:w-[240px] lg:w-[300px]',
                )}
            />
            <Image
                src={JPG_CARD_BACK}
                alt='cubes'
                className='w-full min-h-full scale-y-[-1] object-cover flex-grow object-center translate-y-0'
            />
        </div>
    );
};

TernAcademyCard.displayName = TernAcademyCard.name;
export { TernAcademyCard as TernAcademyCard };
