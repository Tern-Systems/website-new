'use client';

import { FC, HTMLAttributes, ReactElement } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';
import { CONTACT_LINKS, Route } from '@/app/static';

import { ResourceCard } from '@/app/ui/organisms';
import { Section } from '@/app/ui/atoms';

import PNG_CARD_DEFAULT_1 from '@/assets/images/resource-card-default-1.png';
import PNG_CARD_DEFAULT_2 from '@/assets/images/resource-card-default-2.png';
import PNG_CARD_DEFAULT_3 from '@/assets/images/resource-card-default-3.png';
import PNG_CARD_DEFAULT_4 from '@/assets/images/resource-card-default-4.png';
import PNG_CARD_DEFAULT_5 from '@/assets/images/resource-card-default-5.png';

import PNG_CARD_ALT_1 from '@/assets/images/resource-card-alt-1.png';
import PNG_CARD_ALT_2 from '@/assets/images/resource-card-alt-2.png';
import PNG_CARD_ALT_3 from '@/assets/images/resource-card-alt-3.png';
import PNG_CARD_ALT_4 from '@/assets/images/resource-card-alt-4.png';

import PNG_CARD_REGULAR_1 from '@/assets/images/resource-card-regular-1.png';
import PNG_CARD_REGULAR_2 from '@/assets/images/resource-card-regular-2.png';
import PNG_CARD_REGULAR_3 from '@/assets/images/resource-card-regular-3.png';

import PNG_CARD_REGULAR_ALT_5 from '@/assets/images/resource-card-common.png';

type CardType = 'regular' | 'alt' | 'default';

const renderHighlightedCard = (image: StaticImageData): CardLink => ({
    title: 'Stay ahead with the latest tech news',
    description:
        'Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.',
    icon: image,
    action: {
        title: 'Subscribe today',
        href: Route.AllWays,
    },
    alt: true,
});

const CARDS: Record<CardType, CardLink[]> = {
    regular: [
        {
            title: 'Invest in Your Skills',
            description:
                'Looking to buy two or more fee-based courses? Save money by purchasing a subscription and have access to all the digital courses we have to offer. Features of your subscription include:',
            icon: PNG_CARD_REGULAR_1,
            action: {
                title: 'Subscribe Today',
                href: Route.Downloads,
            },
            bullets: [
                'Self-paced courses',
                'Hands-on labs',
                'Preparations for Tern certifications',
                'New content added frequently',
            ],
        },
        {
            title: 'Commit to Learning',
            description:
                'If you require access to a single course, you may purchase it individually, granting you unlimited access to the learning materials for a minimum of three months.',
            icon: PNG_CARD_REGULAR_2,
            action: {
                title: 'Learn more',
                href: Route.Tips,
            },
        },
        {
            title: 'Professional Certifications',
            description:
                'Verify your knowledge by earning the credentials you qualify for. We present an easy to navigate resource, making it easier for you to find the credentials and related learning material that matter most.',
            icon: PNG_CARD_REGULAR_3,
            action: {
                title: 'Explore Tern Credentials',
                href: Route.SupportHub,
            },
            bullets: ['Get certified', 'Earn a badge', 'View your earned credentials'],
        },
        {
            title: 'Engage with the Tern Community',
            description: 'Together, we can connect via forums, blogs, files and face-to-face networking.',
            icon: PNG_CARD_REGULAR_ALT_5,
            action: {
                title: 'Find your community',
                href: Route.Community,
            },
        },
    ],
    alt: [
        {
            title: 'Downloads',
            description: 'Explore and download the latest software from Tern',
            icon: PNG_CARD_ALT_1,
            action: {
                title: 'Explore downloads',
                href: Route.Downloads,
            },
        },
        {
            title: 'Get Expert Tips',
            description: 'Our experts share how to best manage and operate your Tern products, services and accounts.',
            icon: PNG_CARD_ALT_2,
            action: {
                title: 'Learn more',
                href: Route.Tips,
            },
        },
        renderHighlightedCard(PNG_CARD_ALT_3),
        {
            title: 'Enter the Support Hub',
            description:
                'Take control and manage all aspects of your account support with the support hub where you have access to FAQs, handling cases, insights and more!',
            icon: PNG_CARD_ALT_4,
            action: {
                title: 'Enter support hub',
                href: Route.SupportHub,
            },
        },
        {
            title: 'Engage with the Tern Community',
            description: 'Together, we can connect via forums, blogs, files and face-to-face networking.',
            icon: PNG_CARD_REGULAR_ALT_5,
            action: {
                title: 'Find your community',
                href: Route.Community,
            },
        },
    ],
    default: [
        {
            title: 'Facebook',
            description: 'Be part of the conversation - connect, share and grow with our community.',
            icon: PNG_CARD_DEFAULT_1,
            action: {
                title: 'Follow Us',
                href: CONTACT_LINKS.Facebook.href,
            },
        },
        {
            title: 'Reddit',
            description: 'Explore ideas, ask questions, and engage with like-minded innovators.',
            icon: PNG_CARD_DEFAULT_2,
            action: {
                title: 'Join the Discussion',
                href: CONTACT_LINKS.Reddit.href,
            },
        },
        renderHighlightedCard(PNG_CARD_DEFAULT_3),
        {
            title: 'Discord',
            description: 'Chat, collaborate, and build lasting connections with fellow enthusiasts.',
            icon: PNG_CARD_DEFAULT_4,
            action: {
                title: 'Join Now',
                href: CONTACT_LINKS.Discord.href,
            },
        },
        {
            title: 'GitHub',
            description:
                'Collaborate with developers, contribute to groundbreaking projects, and help drive innovation forward.',
            icon: PNG_CARD_DEFAULT_5,
            action: {
                title: 'Collaborate',
                href: CONTACT_LINKS.GitHub.href,
            },
        },
    ],
};

interface Props extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
    type: CardType;
    idx?: number;
}

const CardCheckersSection: FC<Props> = (props: Props) => {
    const { className, type, idx } = props;

    const cards = CARDS[type];
    const CardsLi: ReactElement[] = (idx ? [cards[idx]] : cards).map((card, idx) => (
        <li
            key={card.title + idx}
            className={'contents'}
        >
            <ResourceCard
                type={card.alt ? 'highlighted' : 'default'}
                icon={card.icon}
                title={card.title}
                action={card.action}
                bullets={card.bullets}
                className={{
                    image: cn({ ['lg:col-start-2']: idx % 2 }),
                    content: cn({ ['lg:x-[row-start-1,col-start-1]']: idx % 2 }),
                }}
            >
                {card.description}
            </ResourceCard>
        </li>
    ));

    return (
        <Section className={{ content: className }}>
            <ul className={'flex flex-col  gap-y-7xl md:gap-y-5xl sm:gap-y-3xl'}>{CardsLi}</ul>
        </Section>
    );
};

CardCheckersSection.displayName = CardCheckersSection.name;

export { CardCheckersSection };
