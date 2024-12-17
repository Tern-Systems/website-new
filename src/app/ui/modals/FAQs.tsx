import {FC, useState} from "react";

import {BaseModal} from "@/app/ui/modals";
import {Collapsible} from "@/app/ui/misc";

const FAQs: { question: string, answer: string }[] = [
    {
        question: "What is TernKey?",
        answer: "TernKey is a sandbox application built for software developers to experiment and learn how to code using programming languages that allow users to exploit ternary logic principles."
    },
    {
        question: "How much does it cost to use TernKey?",
        answer: "TernKey is free for the Basic plan and includes the TernKey Emulator. The TernKey Pro plan allows users to access history, profile settings, and the ability to save and explore Keys."
    },
    {
        question: "What is a Key?",
        answer: "A Key is a program written by a TernKey user. Pro users can save their Keys and share them with the world as an ExploreKey or decide to keep them private as one of your MyKeys."
    },
    {
        question: "Can I see history of my programs? How can I save a Key I've created?",
        answer: "Yes, the sidebar contains a history section dedicated to keeping your past programs and drafts contained in an easy-to-navigate container separated by the current session, the entire day, the day prior, and the week prior. A Key can be saved by clicking the SaveKey button located in the bottom right-hand corner of the TernKey Emulator screen. Once clicked, a popup will occupy the screen with two input fields and one toggle button for the user, the name of the Key, a short description, and a button allowing the user to create the Key privately or to publish the Key to the ExploreKey Store."
    },
    {
        question: "Why I don't have a sidebar?",
        answer: "If you do not see a sidebar on your TernKey application, you may need to create an account and login. If you are logged into your TernKey account and still do not see a sidebar, you must purchase the Pro Plan to access this feature."
    },
    {
        question: "Do I need to login to use TernKey?",
        answer: "No, you do not lead to login or even have an account to use TernKey. Although, without an account you will not have access to any of the features in the sidebar including the ability to save Keys or view history."
    },
    {
        question: "What does BTMC mean?",
        answer: "BTMC is an acronym that stands for Balanced Ternary Machine Code. Balanced ternary differs from conventional ternary in that the character representations of the decimal values `-1`, `0`, and `+1` are `-`, `0`, and `+`, respectively, instead of other, less -efficient, alternatives.",
    }
];

const FAQsModal: FC = () => {
    const [openedItemIdx, setOpenedItemIdx] = useState(-1);

    const FAQsList = FAQs.map((faq, idx) => (
        <li key={faq.question + idx}>
            <Collapsible
                title={faq.question}
                isChevron
                expandedState={[openedItemIdx === idx, () => setOpenedItemIdx(prevState => prevState === idx ? -1 : idx)]}
            >
                <span className={'col-span-3'}>{faq.answer}</span>
            </Collapsible>
        </li>
    ));

    return (
        <BaseModal title={'Help & FAQs'} classNameContent={'h-[26rem] overflow-y-scroll font-oxygen text-[1.125rem]'}>
            <ul>{FAQsList}</ul>
        </BaseModal>
    )
}

export {FAQsModal}