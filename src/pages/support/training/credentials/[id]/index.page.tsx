'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { Credential } from '@/app/types/credential';
import { COUNTRY, Fallback, Route } from '@/app/static';

import { getId } from '@/app/utils';

import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { Collapsible, SideNav } from '@/app/ui/organisms';
import { Select } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

import MAIN_BACKGROUND from '@/assets/images/abstract-data-stream.jpg';
import BADGE_FALLBACK from '@/assets/images/certificate-badge.png';

// TODO remove templates
const CONTENT_TEMPLATE: string[] = [
    'Describe the Tern Business Automation Workflow architecture and components',
    'Understand the containerized architecture as it relates to application development',
    'Design applications using appropriate Tern Business Automation Workflow components',
    'Demonstrate an understanding of the impact of design decisions on application performance',
    'Understand the security model for workflow solutions',
];
const CREDENTIAL_TEMPLATE: Credential = {
    overview: `
      <p>The Tern Professional Certified Program G25 Engineer - Associate is a certification tailored for professionals aiming to demonstrate their expertise in G25 programming within the Tidal software environment. As an associate-level credential, it reflects a level of proficiency that surpasses entry-level skills, positioning certified individuals as competent practitioners in Tern's technology ecosystem. This certification not only validates foundational knowledge but also serves as a stepping stone for pursuing more advanced certifications offered by Tern, enhancing career progression in specialized technical fields.</p>
      <br/>
      <p>Certified Associate G25 Engineers are equipped with a robust skill set essential for advanced G25 programming tasks. They excel in distinguishing between various G25 programs, coding efficiently, troubleshooting issues, and designing sophisticated solutions, all within the Tidal software environment. This platform provides critical tools for developing, testing, and deploying G25 programs, enabling these professionals to deliver high-quality outcomes. Their expertise makes them invaluable in roles requiring deep technical knowledge, underscoring the certification's significance in the professional landscape.</p>
      <br/>
      <p style="font-weight: bold">This exam contains both multiple choice and performance based questions in a lab environment and is only offered at Pearson Vue Testing Centers.</p>`,
    skills: ['G25', 'Program Design', 'HTML', 'CSS', 'REST', 'XML', 'JSON', 'BPMN'],
    requirements: 'Exam C1000-116: Tern Business Automation Workflow V20.0.0.2 using Workflow Center Development',
    objectives: {
        questions: {
            amount: 63,
            threshold: 45,
        },
        timeMs: 300_000,
        status: 'Live',
        sections: [
            { title: 'Architecture', completion: 14, content: CONTENT_TEMPLATE },
            {
                title: 'Workflow Development',
                completion: 25,
                content: CONTENT_TEMPLATE,
            },
            {
                title: 'User Interface Development',
                completion: 22,
                content: CONTENT_TEMPLATE,
            },
            {
                title: 'Service Development',
                completion: 14,
                content: CONTENT_TEMPLATE,
            },
            {
                title: 'Document Management',
                completion: 8,
                content: CONTENT_TEMPLATE,
            },
            {
                title: 'Error Handling, Debugging, and Troubleshooting',
                completion: 10,
                content: CONTENT_TEMPLATE,
            },
            {
                title: 'Deployment and Governance',
                completion: 7,
                content: CONTENT_TEMPLATE,
            },
        ],
    },
    resources: {
        description:
            'All IBM certification tests presume a certain amount of "on-the-job" experience which is not present in any classroom or Web presentation. The recommended courses and links will help you gain the skill and product knowledge represented in the test objectives. They do not teach the answers to the test questions and are not intended to do so. This information may not cover all subject areas in the certification test or may contain more recent information than is present in the certification test. Taking these or any classes will not guarantee that you will achieve certification.',
        paths: CONTENT_TEMPLATE,
    },
    info: {
        // TODO hrefs
        href: 'a',
        title: 'Tern Professional Certified Program G25 Engineer - Associate',
        badge: BADGE_FALLBACK.src,
        general: {
            group: 'Data, Analytics, and AI',
            certificationStatus: 'Live',
            code: 'C0010500',
            replacesCode: 'C0010500',
            replacedByCode: 'C0010500',
        },
        languages: ['English'],
        priceUSD: 200,
    },
};

type AdditionalLink = {
    description: ReactElement;
    title: string;
    href: string;
};

const SECTIONS: string[][] = [
    'Overview',
    'Recommended Skills',
    'Requirements',
    'Exam Objectives',
    'Exam Resources',
    'Need help?',
].map((key) => [getId(key), key]);
const SECTION: Record<string, string> = Object.fromEntries(SECTIONS);

// TODO hrefs
const ADDITIONAL_LINKS: AdditionalLink[] = [
    {
        description: (
            <>
                An <span className={'font-bold'}>Assessment Exam</span> is an online test that results in a score report
                to help you gauge your preparedness. They can be booked through Pearson VUE.
            </>
        ),
        title: 'Assessment Exam',
        href: '',
    },
    {
        description: (
            <>
                The <span className={'font-bold'}>Sample Test</span> is designed to give you an idea of the type of
                questions you can expect to see on the exam.
            </>
        ),
        title: 'Sample Test',
        href: '',
    },
    {
        description: (
            <>
                The <span className={'font-bold'}>Study Guide</span> provides additional details and references for the
                exam objectives.
            </>
        ),
        title: 'Study Guide PDF',
        href: '',
    },
];

const SECTION_TEXT = 'sm:!text-12 !text-14';
const SECTION_CONTENT_CN = cn('mt-n leading-l', SECTION_TEXT);
const INFO_LIST_CN = 'flex flex-col gap-y-3xs';

const renderListLi = (list: string[]): ReactElement[] | undefined =>
    list.map((path, idx) => <li key={path.slice(10) + idx}>{path}</li>);

const Hr: FC = () => <hr className={'my-xs'} />;

// TODO Link
const renderRegisterLink = (href: string | undefined) =>
    href ? (
        <PageLink
            href={href}
            icon={'arrow-right-long'}
            className={'flex-row-reverse p-4xs-1 w-fit bg-blue  mt-xs md:mt-n'}
            iconClassName={'ml-xxs [&_*]:size-5xs'}
        >
            Register for exam
        </PageLink>
    ) : null;

function CredentialPage() {
    const [credential, setCredential] = useState<Credential | null>();
    const { timeMs } = credential?.objectives ?? {};

    useEffect(() => {
        // const credential = sessionStorage.getItem(CacheEnum.credential);
        // TODO parse real credential
        setCredential(CREDENTIAL_TEMPLATE);
        // if (credential) setCredential(JSON.parse(credential) as Credential);
    }, []);

    const ObjectivesSectionsLi: ReactElement[] | undefined = credential?.objectives.sections.map((section, idx) => (
        <li
            key={section.title.slice(10) + idx}
            className={'contents'}
        >
            <Collapsible
                chevron
                expandedInit={[false]}
                title={
                    <>
                        <span className={'inline-block max-w-full overflow-x-hidden text-ellipsis text-nowrap'}>
                            Section {idx + 1}: {section.title}
                        </span>
                        <span>{section.completion}%</span>
                    </>
                }
                wrapper={'!p-xxs max-w-full border-b-s border-b-gray-l0'}
                classNameTitle={cn(
                    SECTION_TEXT,
                    '!mb-0 [&_h2]:grid-cols-[1fr,min-content] [&_h2]:x-[grid,w-full,font-normal]',
                )}
                className={'!flex mt-xs leading-l'}
            >
                <ul className={'list-decimal list-inside'}>{renderListLi(section.content)}</ul>
            </Collapsible>
        </li>
    ));

    const GeneralInfoLi: ReactElement[] = [
        { title: 'Group', value: credential?.info.general.group },
        {
            title: 'Certification status',
            value: credential?.info.general.certificationStatus,
        },
        { title: 'Credential code', value: credential?.info.general.code },
        {
            title: 'Replaces credential code',
            value: credential?.info.general.replacesCode,
        },
        {
            title: 'Being replaced by',
            value: credential?.info.general.replacedByCode,
        },
        { title: 'Required exam', value: credential?.requirements },
        { title: 'Exam status', value: credential?.objectives.status },
    ].map((entry, idx) => (
        <li key={entry.title + idx}>
            <span>{entry.title}:&nbsp;</span>
            <span className={'font-bold'}>{entry.value}</span>
        </li>
    ));

    const AdditionalLinksLi: ReactElement[] = ADDITIONAL_LINKS.map((link, idx) => (
        <li key={idx}>
            <span className={'block'}>{link.description}</span>
            <PageLink
                href={link.href}
                icon={'arrow-right-long'}
                className={'flex-row-reverse mt-4xs text-blue'}
                iconClassName={'ml-4xs [&_*]:size-4xs-1 [&_path]:fill-blue'}
            >
                {link.title}
            </PageLink>
        </li>
    ));

    return (
        <>
            <Section
                background={{ image: MAIN_BACKGROUND, gradient: 'left' }}
                className={{
                    section: 'h-[21.625rem]',
                    background: 'max-h-full',
                    content: 'flex flex-col justify-between py-xxl',
                }}
            >
                <H1>Tern Professional Certified Program G25 Engineer Associate</H1>
                <H2>Certification overview, objectives, exam preparation and registration</H2>
            </Section>
            <Content className={'grid  lg:gap-x-xxl  grid-cols-1 lg:grid-cols-[min-content,2fr,1fr]'}>
                <aside>
                    <SideNav section={SECTION} />
                </aside>

                <div className={'flex flex-col  sm:mt-xl md:mt-xxl  sm:gap-y-[2.5rem] gap-y-[3.125rem]'}>
                    <section>
                        <H3 id={SECTIONS[0][0]}>Certification Overview</H3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: credential?.overview ?? Fallback,
                            }}
                            className={SECTION_CONTENT_CN}
                        />
                    </section>
                    <section>
                        <H3 id={SECTIONS[1][0]}>Recommended Skills</H3>
                        <p className={SECTION_CONTENT_CN}>Working knowledge of:</p>
                        <p className={SECTION_CONTENT_CN}>{credential?.skills.join(', ') ?? Fallback}</p>
                    </section>
                    <section>
                        <H3 id={SECTIONS[2][0]}>Requirements</H3>
                        <p className={SECTION_CONTENT_CN}>{credential?.requirements ?? Fallback}</p>
                    </section>
                    <section>
                        <H3 id={SECTIONS[3][0]}>Exam Objectives</H3>
                        <div className={cn(SECTION_CONTENT_CN, 'font-bold')}>
                            <p>
                                Number of questions:&nbsp;
                                <span className={'font-normal'}>
                                    {credential?.objectives.questions.amount ?? Fallback}
                                </span>
                            </p>
                            <p>
                                Number of questions to pass:&nbsp;
                                <span className={'font-normal'}>
                                    {credential?.objectives.questions.threshold ?? Fallback}
                                </span>
                            </p>
                            <br />
                            <p>
                                Allocated time:&nbsp;
                                <span className={'font-normal'}>
                                    {timeMs ? timeMs / 60_000 + ' Minutes' : Fallback}
                                </span>
                            </p>
                            <p>
                                Status:&nbsp;
                                <span className={'font-normal capitalize'}>
                                    {credential?.objectives.status ?? Fallback}
                                </span>
                            </p>
                        </div>
                        <ul className={'mt-n'}>{ObjectivesSectionsLi}</ul>
                    </section>
                    <section>
                        <H3 id={SECTIONS[4][0]}>Exam Resources</H3>
                        <p className={SECTION_CONTENT_CN}>{credential?.resources.description}</p>
                        <Collapsible
                            chevron
                            expandedInit={[false]}
                            title={'Learnings Paths'}
                            wrapper={'!p-xxs mt-n max-w-full border-b-s border-b-gray-l0'}
                            classNameTitle={cn(SECTION_TEXT, '[&_h2]:font-normal !mb-0')}
                            className={'!flex mt-xs leading-l'}
                        >
                            {credential?.resources.paths ? (
                                <ul className={'list-decimal list-inside'}>
                                    {renderListLi(credential?.resources.paths)}
                                </ul>
                            ) : (
                                Fallback
                            )}
                        </Collapsible>
                    </section>
                    <section>
                        <div className={'grid text-14  sm:grid-rows-2 grid-rows-1  sm:grid-cols-1 grid-cols-2'}>
                            <div className={'p-n bg-white-d2'}>
                                <h3
                                    id={SECTIONS[5][0]}
                                    className={'text-black text-32'}
                                >
                                    Need help?
                                </h3>
                                <p className={'mt-s mb-n font-bold text-black leading-xl'}>
                                    Find answers to your questions to help you earn credentials.
                                </p>
                                {/*TODO Link*/}
                                <PageLink
                                    href={''}
                                    icon={'arrow-right-long'}
                                    className={'flex-row-reverse px-xxs py-3xs bg-blue'}
                                    iconClassName={'ml-xxs [&_*]:size-5xs'}
                                >
                                    Find answers
                                </PageLink>
                            </div>
                            <div className={'flex flex-col justify-between p-n bg-blue-d0'}>
                                <p className={'text-27'}>Get a subscription today and build your training plan</p>
                                {/*TODO Link*/}
                                <PageLink
                                    href={''}
                                    icon={'arrow-right-long'}
                                    className={'flex-row-reverse py-3xs w-fit'}
                                    iconClassName={'ml-xxs [&_*]:size-5xs'}
                                >
                                    Find answers
                                </PageLink>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className={'sm:mt-xl md:mt-xxl'}>
                    <div>
                        <div className={'h-[0.375rem] w-full bg-gradient-to-r from-black to-blue'} />
                        <div className={'bg-gray text-12 leading-n  sm:p-xs p-n'}>
                            <div className={'contents'}>
                                <Image
                                    src={credential?.info.badge ?? BADGE_FALLBACK}
                                    alt={'badge'}
                                    width={200}
                                    height={200}
                                    className={'size-10xl md:size-[8.0625rem]'}
                                />
                                <p className={SECTION_CONTENT_CN}>{credential?.info.title ?? Fallback}</p>
                                {renderRegisterLink(credential?.info.href)}
                                <Hr />
                                <ul className={INFO_LIST_CN}>{GeneralInfoLi}</ul>
                                <Hr />
                                <ul className={INFO_LIST_CN}>{AdditionalLinksLi}</ul>
                                <Hr />
                                <div>
                                    <p className={'mb-4xs font-bold'}>Testing Policy</p>
                                    <p>
                                        <span>
                                            For information on testing policies, practices, and preparation, visit&nbsp;
                                        </span>
                                        <PageLink
                                            href={Route.Terms}
                                            className={'text-blue'}
                                        >
                                            Tern Training Terms and Conditions.
                                        </PageLink>
                                    </p>
                                </div>
                                <Hr />
                                <div>
                                    <p>
                                        <span>This exam is available in the following languages:&nbsp;</span>
                                        <span className={'font-bold'}>{credential?.info.languages.join(', ')}</span>
                                    </p>
                                    <p className={'mt-xxs'}>
                                        <span>Price per exam:&nbsp;</span>
                                        {credential?.info.priceUSD ? (
                                            <span className={'font-bold'}>${credential.info.priceUSD} USD</span>
                                        ) : (
                                            Fallback
                                        )}
                                    </p>
                                    <Select
                                        altIcon
                                        options={COUNTRY}
                                        value={COUNTRY.US}
                                        onChange={() => {
                                            //TODO
                                        }}
                                        className={{
                                            select: '!p-4xs-1 !bg-inherit',
                                            wrapper: 'mt-xs',
                                            chevron: '!w-4xs',
                                            selected: 'w-full justify-between',
                                            option: '!p-4xs-1 !bg-gray',
                                            ul: '!min-w-0',
                                        }}
                                    />
                                    {renderRegisterLink(credential?.info.href)}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </Content>
        </>
    );
}

export default CredentialPage;
