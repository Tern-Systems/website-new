'use client';

import React, { ReactElement } from 'react';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

import { Route } from '@/app/static';

import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { ResourceCard } from '@/app/ui/organisms';
import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';

import PNG_WATER_DROP from '@/assets/images/product-water-droplet.png';
import PNG_ART from '@/assets/images/tidal-art.png';
import MICROPROCESSOR from '@/assets/images/allways-microprocessor.png';
import PNG_TIDAL_BACKGROUND from '@/assets/images/tidal-bg-main.png';
import PNG_TIDAL_LOGO from '@/assets/images/tidal-logo.svg';
import PNG_TERNACT_DATABASE from '@/assets/images/ternact-database.png';
import PNG_CYRUS_PROCESSOR from '@/assets/images/cyrus-processor.png';

type Product = {
    title: string;
    subtitle: string;
    image: StaticImageData;
    logo?: StaticImageData;
    href: Route;
    content: { title: string; description: string }[];
};

const PRODUCTS: Product[] = [
    {
        title: 'Tidal',
        subtitle: 'Do more with more',
        image: PNG_TIDAL_BACKGROUND,
        logo: PNG_TIDAL_LOGO,
        href: Route.Products,
        content: [
            {
                title: "World's First Ternary Software Stack",
                description:
                    'Tidal serves as an integrated development environment (IDE) specifically designed for ternary programming. It aims to ' +
                    'democratize access to ternary computing by providing an intuitive and accessible tool for software engineers to learn, ' +
                    "experiment, and innovate with this emerging technology. Tern's mission is to revolutionize computing through ternary-based " +
                    'CPUs, which utilize three-state logic rather than traditional binary two-state logic, offering advantages in efficiency and ' +
                    'performance. By addressing the historical lack of reliable resources and the fragmented knowledge landscape surrounding ' +
                    'ternary logic, Tidal plays a pivotal role in making this advanced computing paradigm approachable to a broader audience, ' +
                    'and ultimately, defining the standards necessary for commercialization.',
            },
            {
                title: 'Educational Tool',
                description:
                    'First and foremost, Tidal functions as an educational emulator that enables developers to write, test, and refine ternary ' +
                    'code within a simulated environment. It supports a variety of programming languages, including G, TERN, and BTMC, each ' +
                    'designed to build the software stack tailored for ternary logic - addressing different levels of abstraction for user ' +
                    'analysis. This hands-on learning experience is crucial for bridging the gap between conventional binary computing and the ' +
                    'emerging ternary paradigm. By offering a user-friendly interface and lowering the barriers to entry, Tidal empowers ' +
                    'software engineers to explore the unique potential of ternary computing. It provides a practical solution to the challenge ' +
                    'of workforce education, fostering a deeper understanding of how ternary logic can enhance computational efficiency and ' +
                    'address modern technological demands.',
            },
            {
                title: 'Cultivating Community',
                description:
                    'Beyond being a mere software tool, Tidal acts as a catalyst for a broader computing revolution. It cultivates a ' +
                    'collaborative community of developers who are actively shaping the future of ternary technology. Tern has outlined a ' +
                    'strategic release plan for Tidal, beginning with a beta version in March 2025, followed by a full release and subsequent ' +
                    'updates that will introduce features like hardware simulation and advanced IDE capabilities by 2026. As Tidal evolves, it ' +
                    'is poised to facilitate the transition from traditional binary systems to next-generation ternary computing architectures. ' +
                    'By encouraging more engineers to adopt ternary logic, Tidal is expected to drive demand for ternary hardware, such as ' +
                    "Tern's Cyrus CPU, ultimately contributing to the widespread adoption of this transformative technology and redefining the " +
                    'computing landscape.',
            },
        ],
    },
    {
        title: 'Ternact',
        subtitle: 'Play with the future',
        image: PNG_TERNACT_DATABASE,
        href: '' as Route,
        content: [
            {
                title: "World's First Ternary Computer",
                description:
                    'Ternact is a pioneering hardware platform developed by Tern, a company dedicated to advancing ternary computing ' +
                    "technology. As the world's first general-purpose ternary computer system, Ternact marks a significant leap forward in the " +
                    'evolution of computational systems. Unlike conventional binary computers that rely on two states (0 and 1), Ternact ' +
                    'operates using ternary logic, which incorporates three states (-1, 0, and 1). This unique approach allows for more ' +
                    'efficient data processing, reduced energy consumption, and enhanced computational capabilities. Powered by the Cyrus 1 ' +
                    "Processor, Ternact stands as a concrete realization of Tern's mission to transform the computing industry by introducing " +
                    'a new paradigm that addresses the limitations of traditional binary systems.',
            },
            {
                title: 'A Platform for Proof and Research',
                description:
                    'The primary purpose of Ternact is to serve as a proof-of-concept for ternary computing, showcasing its practical ' +
                    'advantages and real-world feasibility. It provides a physical platform where developers can execute ternary code, ' +
                    'effectively bridging the gap between theoretical research and practical application. This enables software engineers to ' +
                    'test and optimize their programs on actual ternary hardware, offering valuable insights into the performance and ' +
                    'efficiency of ternary logic. Beyond demonstration, Ternact also functions as a research and development platform, ' +
                    'allowing Tern to refine its Cyrus 1 Processor designs and explore innovative possibilities in ternary computing. This ' +
                    'dual role underscores its importance in validating the technology and fostering confidence among developers and ' +
                    'potential adopters.',
            },
            {
                title: 'Bridging the Gap',
                description:
                    "Ternact is integral to Tern's broader market penetration strategy, acting as a catalyst for the widespread adoption of " +
                    'ternary computing. By presenting a fully functional ternary computer system, it overcomes a key obstacle to market entry: ' +
                    "the absence of tangible evidence of ternary technology's superiority. It highlights how ternary computing can surpass " +
                    'binary systems in speed, energy efficiency, and data storage, making a compelling case for its adoption. Additionally, ' +
                    "Ternact integrates seamlessly with Tidal, Tern's software platform, enabling developers to write and run ternary code " +
                    'remotely. This synergy between hardware and software creates a robust ecosystem that promotes innovation and ' +
                    'collaboration, paving the way for the commercialization of ternary CPUs and positioning Tern as a leader in the next ' +
                    'generation of computing.',
            },
        ],
    },
    {
        title: 'Cyrus 1 Processor',
        subtitle: 'The great',
        image: PNG_CYRUS_PROCESSOR,
        href: Route.Cyrus,
        content: [
            {
                title: "World's First Ternary CPU",
                description:
                    'The Cyrus 1 Processor is a groundbreaking ternary CPU developed by Tern, a leading fabless semiconductor manufacturer. ' +
                    'Unlike traditional binary CPUs that operate on two states (0 and 1), Cyrus leverages ternary logic, which uses three ' +
                    'states (-1, 0, and 1). This innovative approach allows Cyrus to perform computations more efficiently, offering ' +
                    'significant improvements in processing speed, energy consumption, and data storage capacity. Designed with a focus on ' +
                    'manufacturing compatibility through a design for manufacturing and assembly methodology, Cyrus integrates seamlessly with ' +
                    "existing fabrication processes, reducing production barriers and costs. Tern's introduction of Cyrus marks a significant " +
                    'departure from conventional computing paradigms, positioning it as a pioneering solution in the evolution of CPU technology.',
            },
            {
                title: 'Proven yet Progressive',
                description:
                    'The design of Cyrus is rooted in decades of research on ternary computing, which has shown potential to overcome the ' +
                    'limitations of binary systems, such as the memory wall and power wall. By utilizing three-state logic, Cyrus can process ' +
                    'more information per clock cycle, reducing the need for frequent data fetching from memory. This not only accelerates ' +
                    'computation but also minimizes energy consumption, making it an ideal candidate for applications in artificial ' +
                    'intelligence, data centers, and battery-powered devices. These technical advantages address modern computing challenges, ' +
                    'including the inefficiencies of sequential data fetching in Von Neumann architectures and the scalability issues ' +
                    "highlighted by the end of Dennard Scaling and Moore's Law, paving the way for more robust and efficient systems.",
            },
            {
                title: 'Leap for Civilization',
                description:
                    "Cyrus represents a pivotal step in Tern's mission to revolutionize computing. As the world's first commercially viable " +
                    'ternary CPU, it is poised to disrupt the semiconductor industry, challenging established players who have relied on ' +
                    'incremental improvements to binary technology. With its ability to enhance performance while reducing energy usage, Cyrus ' +
                    'is set to become a cornerstone in the next generation of computing, enabling more advanced and sustainable technological ' +
                    'solutions. Tern supports this vision with initiatives like Tidal, a ternary software stack, and Ternact, a hardware ' +
                    'platform, fostering a developer ecosystem that ensures widespread adoption across industries such as cybersecurity, cloud ' +
                    'computing, and hyperscalers, ultimately redefining the future of digital systems.',
            },
        ],
    },
];

const SECTION_SPACING_CN = 'mt-5xl md:mt-6xl-1 lg:mt-7xl';

const ProductSectionsLi: ReactElement[] = PRODUCTS.map((product: Product, idx) => {
    const SubtitlesLi: ReactElement[] = product.content.map((section, subIdx) => (
        <li
            key={idx.toString() + subIdx}
            className={'font-light'}
        >
            <H3>{section.title}</H3>
            <p className={'mt-xs leading-n  text-16 lg:text-18'}>{section.description}</p>
        </li>
    ));

    return (
        <Section
            key={product.title + idx}
            className={{ section: SECTION_SPACING_CN }}
        >
            <div className={'relative'}>
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title}
                        className={'sm:h-[27.125rem] h-[39.875rem]'}
                    />
                ) : null}
                <div className={'absolute inset-0  flex flex-col justify-between  sm:p-xs p-xxl'}>
                    <h3 className={'font-bold  text-48 md:text-80 lg:text-96'}>{product.title}</h3>
                    {product.logo ? (
                        <div className={'contents'}>
                            <Image
                                src={product.logo}
                                alt={'Tidal Logo'}
                                className={'sm:h-6xl-1 h-[11.9375rem] w-fit'}
                            />
                        </div>
                    ) : null}
                    <p className={'font-light  text-24 lg:text-40'}>{product.subtitle}</p>
                </div>
            </div>
            <ul className={'flex flex-col  mt-xl lg:mt-xxl  gap-y-n lg:gap-y-xxl'}>{SubtitlesLi}</ul>
            <div className={'content'}>
                <PageLink
                    icon={'arrow-right-long'}
                    href={product.href}
                    className={'flex-row-reverse bg-blue p-xxs  mt-xl lg:mt-xxl'}
                    iconClassName={'ml-xs size-5xs'}
                >
                    Learn more
                </PageLink>
            </div>
        </Section>
    );
});

function ProductsPage() {
    return (
        <>
            <Section
                type={'full-screen'}
                background={{ image: PNG_WATER_DROP, gradient: 'left' }}
                className={{
                    content: 'flex flex-col justify-between  pt-6xl-1  pb-[5.625rem] lg:pb-6xl-1',
                    background: 'sm:bg-[60%_0]',
                }}
            >
                <H1 className={'!text-64 lg:!text-96 font-light'}>Products</H1>
                <H2>Tools of tomorrow</H2>
            </Section>
            <Content heading={'Improving. All Ways.'}>
                <Section
                    className={{
                        content: cn(
                            'grid items-center justify-items-center',
                            'grid-cols-1 md:grid-cols-[2fr,1fr] lg:grid-cols-2',
                            'gap-x-n lg:gap-x-xxl',
                            'mt-6xl-1 md:mt-7xl-1 lg:mt-7xl',
                        ),
                    }}
                >
                    <div className={'sm:contents'}>
                        <h3 className={cn('font-light  sm:text-24 text-40')}>From Software to Hardware</h3>
                        <div className={cn('leading-n font-light  mt-n lg:mt-xxl  sm:text-14 text-16')}>
                            <p>
                                Tern is revolutionizing computing by developing ternary logic-based systems that offer
                                superior efficiency and performance compared to traditional binary systems. Their
                                strategy begins with Tidal, an educational emulator that enables software engineers to
                                learn and innovate within the ternary paradigm, fostering a strong developer community.
                                This community engagement is crucial for driving the adoption of ternary computing
                                across various industries.
                            </p>
                            <br />
                            <p>
                                Building on this foundation, Tern is advancing hardware development with Ternact, a
                                proof-of-concept system that demonstrates the practical advantages of ternary computing.
                                Ternact serves as a stepping stone to the Cyrus 1 Processor, a commercially viable
                                ternary computer processing unit (CPU) designed for integration into a wide range of
                                applications, from AI and data centers to cybersecurity. These hardware efforts showcase
                                the feasibility and potential of ternary logic in real-world scenarios.
                            </p>
                            <br />
                            <p>
                                Through this multi-faceted approach, Tern is not only addressing the technical
                                challenges of modern computing but also ensuring that the ecosystem is prepared for the
                                widespread adoption of ternary technology. By combining innovative software, hardware,
                                and community engagement, Tern is positioning itself as a leader in the next wave of
                                computing innovation, aiming to redefine the future of digital systems.
                            </p>
                        </div>
                    </div>
                    <div
                        className={cn(
                            styles.contentHighlight,
                            'sm:row-start-2  sm:mt-n  after:bg-transparent lg:after:x-[bg-blue,blur-[--p-xl]]',
                        )}
                    >
                        <Image
                            src={PNG_ART}
                            alt={'Ternary Art'}
                            className={'sm:size-card h-[42.75rem]'}
                        />
                    </div>
                </Section>
                <Section>
                    {/*TODO link*/}
                    <ResourceCard
                        type={'highlighted'}
                        icon={MICROPROCESSOR}
                        title={'The Latest News and Insights in Deep Tech'}
                        action={{ title: 'Subscribe today', href: '' }}
                        className={{ wrapper: SECTION_SPACING_CN }}
                    >
                        Discover expertly curated insights and news on AI, cloud and more in the weekly All Ways
                        Newsletter.
                    </ResourceCard>
                </Section>
                {ProductSectionsLi}
                <Section className={{ section: 'sm:hidden  md:mt-6xl-1 lg:mt-7xl' }}>
                    <AllWaysCard alt={true} />
                </Section>
                <InsideTernSection data={'alt1'} />
            </Content>
        </>
    );
}

ProductsPage.displayName = ProductsPage.name;

export default ProductsPage;
