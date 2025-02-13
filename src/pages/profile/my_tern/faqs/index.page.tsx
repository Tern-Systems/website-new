import React, {FC, useEffect, useState} from "react";
import cn from "classnames";

import {Route} from "@/app/static";
import {Breakpoint} from "@/app/hooks/useBreakpointCheck";

import {useBreakpointCheck, useNavigate} from "@/app/hooks";
import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Collapsible} from "@/app/ui/misc";

import styles from "@/app/common.module.css";


const FAQs: { question: string, answer: string }[] = [
    {
        question: "What is TernKey?",
        answer: "TernKey is a sandbox application built for software developers to experiment and learn how to code using programming languages that allow users to exploit ternary logic computing principles."
    },
    {
        question: "How much does it cost to use TernKey?",
        answer: "TernKey is free for the Basic plan and includes the TernKey Emulator. The TernKey Pro plan costs $20 per month and allows users to access history, profile settings, and the ability to save and explore Keys."
    },
    {
        question: "What does ternary mean?",
        answer: "Ternary is defined as using the number three as a base in mathematics. Binary uses base two and is represented using the characters `0` and `1`, representing the decimal values `0` and `+1`, respectively. Ternary, on the other hand, uses three representative characters. Specifically, our technology uses balanced ternary, `-`, `0`, and `+`, representing the decimal values `-1`, `0`, and `+1`, respectively."
    },
    {
        question: "Why is it called TernKey?",
        answer: "TernKey is a play on words. By using the prefix of the word ternary—' Tern`—and attaching `Key` at the end, we both illustrate the technology's differentiation and ease of use. TernKey is a turn-key technology that is ready to immediately implement and showcases how ternary logic programming will shift the paradigm of the computer industry."
    },
    {
        question: "What is a Key?",
        answer: "A Key is a program written by a TernKey user. Pro users can save their Keys and share them with the world as an ExploreKey or decide to keep them private as one of your MyKeys."
    },
    {
        question: "Can I see the history of my programs?",
        answer: "Yes, the sidebar contains a history section dedicated to keeping your past programs and drafts contained in an easy-to-navigate container separated by the current session, the entire day, the day prior, and the week prior."
    },
    {
        question: "How can I save a Key I've created?",
        answer: "A Key can be saved by clicking the SaveKey button located in the bottom right-hand corner of the TernKey Emulator screen. Once clicked, a popup will occupy the screen with two input fields and one toggle button for the user, the name of the Key, a short description, and a button allowing the user to create the Key privately or to publish the Key to the ExploreKey Store.",
    },
    {
        question: "How can I save a Key I've created?",
        answer: "A Key can be saved by clicking the SaveKey button located in the bottom right-hand corner of the TernKey Emulator screen. Once clicked, a popup will occupy the screen with two input fields and one toggle button for the user, the name of the Key, a short description, and a button allowing the user to create the Key privately or to publish the Key to the ExploreKey Store."
    },
    {
        question: "How do I resolve a billing issue?",
        answer: "You can resolve billing issues by contacting our resolution center at billing@tern.ac or +1 (914) 306-5528."
    },
    {
        question: "Why don't I have a sidebar?",
        answer: "If you do not see a sidebar on your TernKey application, you may need to create an account and login. If you are logged into your TernKey account and still do not see a sidebar, you must purchase the Pro Plan to access this feature."
    },
    {
        question: "Do I need to login to use TernKey?",
        answer: "No."
    },
    {
        question: "What does BTMC mean?",
        answer: "BTMC is an acronym that stands for Balanced Ternary Machine Code. Balanced ternary differs from conventional ternary in that the character representations of the decimal values `-1`, `0`, and `+1` are `-`, `0`, and `+`, respectively, instead of other, less -efficient, alternatives."
    },
    {
        question: "What does TERN mean?",
        answer: "TERN is an acronym that stands for Ternary Executable Ratiocinative Nexus. In essence, this name communicates the central point of the exact thinking process of our balanced ternary programming languages: TERN, the assembly programming language for G, the high-level programming language atop the stack of TernKey languages."
    }
];


interface Props {
    hideTitle?: boolean;
}

const FAQsPage: FC<Props> = (props: Props) => {
    const isSm = useBreakpointCheck() <= Breakpoint.sm;
    const [navigate] = useNavigate();

    const [expandedItemIdx, setExpandedItemIdx] = useState(-1);

    useEffect(() => {
        if (!isSm)
            navigate(Route.MyTern);
    }, [isSm, navigate])

    const FAQsList = FAQs.map((faq, idx) => (
        <li key={faq.question + idx}>
            <Collapsible
                title={faq.question}
                isChevron
                expandedState={[expandedItemIdx === idx, () => setExpandedItemIdx(prevState => prevState === idx ? -1 : idx)]}
                classNameWrapper={cn(
                    `[&]:p-0 rounded-none`,
                    `sm:[&]:portrait:px-xs`,
                    `sm:landscape:flex sm:landscape:hover:brightness-125`,
                )}
                classNameTitle={cn(styles.clickable,
                    `[&]:mb-0 text-section-s whitespace-pre-wrap text-left`,
                    `py-n`,
                    `md:py-[calc(0.5*var(--p-s))] md:text-section-xs`,
                    `sm:py-[calc(0.5*var(--p-s))] sm:text-section-xs`,
                    `sm:landscape:p-4xs`,
                    {['pb-[0.5rem]    sm:[&]:pb-[0.35rem]']: expandedItemIdx === idx}
                )}
                classNameIcon={'w-[0.9rem]  sm:w-[0.8rem]   sm:landscape:hidden'}
                className={'sm:landscape:hidden'}
            >
                <span className={'col-span-3 leading-n text-basic   sm:text-section-xxs'}>{faq.answer}</span>
            </Collapsible>
        </li>
    ));

    return (
        <div className={cn(
            `h-full`,
            `sm:x-[px-s,pb-xl]`,
            `sm:landscape:pb-s`,
        )}
        >
            <h1 className={cn(
                `block h-[5rem] font-bold text-left content-end`,
                `text-heading`,
                `sm:x-[pb-s,text-heading-s]`,
                `sm:landscape:x-[h-[3.19rem],pb-xs]`,
                {['hidden']: props.hideTitle}
            )}
            >
                Help & FAQs
            </h1>
            <div
                className={cn(
                    `sm:h-[calc(100%-5rem)] sm:overflow-y-scroll`,
                    `sm:landscape:h-[calc(100%-3.19rem)] sm:landscape:x-[flex,gap-x-[0.12rem]]`
                )}
            >
                <ul className={cn(
                    `bg-gray rounded-s overflow-y-scroll`,
                    `lg:[&_li:first-of-type_div]:pt-3xs`,
                    `lg:[&_li:last-of-type_div]:pb-3xs`,
                    `md:[&_li:last-of-type_div]:pb-0`,
                    `sm:portrait:py-[0.2rem]`,
                    `sm:landscape:x-[p-xs,w-1/2]`,
                    `sm:landscape:[&_li:first-of-type_div]:pt-0`,
                    `sm:landscape:[&_li:last-of-type_div]:pb-0`,
                )}
                >
                    {FAQsList}
                </ul>
                <div
                    className={cn(
                        `hidden p-xs w-1/2 bg-gray rounded-s`,
                        `text-left text-section-xs leading-n`,
                        {['sm:landscape:[&]:block ']: expandedItemIdx !== -1}
                    )}
                >
                    <span className={'block mb-xxs h-[--section-xs] font-bold '}>
                        {expandedItemIdx !== -1 ? FAQs[expandedItemIdx]?.question : null}
                    </span>
                    <span
                        className={'block overflow-y-scroll h-[calc(100%-var(--fz-section-xs)-var(--p-xxs))]'}>
                        {expandedItemIdx !== -1 ? FAQs[expandedItemIdx]?.answer : null}
                    </span>
                </div>
            </div>
        </div>
    );
}

const FAQsModal: FC = () => {
    const isSm = useBreakpointCheck() <= Breakpoint.sm;
    const modalCtx = useModal();

    useEffect(() => {
        if (isSm)
            modalCtx.closeModal();
        //eslint-disable-next-line
    }, [isSm]);

    return (
        <BaseModal title={'Help & FAQs'}
                   className={'md:p-s'}
                   classNameTitle={'leading-none'}
                   classNameHr={'md:mb-[calc(0.5*var(--p-s))]'}
                   classNameContent={cn(
                       `overflow-y-scroll font-oxygen`,
                       'lg:x-[w-[56rem],max-h-[23rem]]',
                       'md:x-[w-[33rem],h-[32rem]]',
                   )}
        >
            <FAQsPage hideTitle/>
        </BaseModal>
    );
}

export {FAQsModal};
export default FAQsPage;
