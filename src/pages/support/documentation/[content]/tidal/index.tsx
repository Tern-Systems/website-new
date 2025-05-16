import React from 'react';

import { ContentAnchors } from '@/app/types/documentation';

const TidalManualAnchors: ContentAnchors = [
    'Overview',
    'Introduction',
    { Languages: ['BTMC', 'TERN', 'G'] },
    {
        'Emulator and Features': [
            {
                'Primary Display Controls': ['Sidebar', 'Clear', 'Profile', 'Save', 'Information'],
            },
            { Keys: ['My Keys', 'Explore Keys'] },
        ],
    },
    { 'Code Windows': ['Input Code Windows', 'Output Code Windows'] },
    {
        'Profile Management': [
            {
                'My Plan': ['Limits Apply', 'Billing Resolution Center', 'Manage Subscription'],
            },
            {
                'Account Options': ['General Preferences', 'Developer Profile Management', 'Advanced'],
            },
        ],
    },
];

const TidalManualContent = () => {
    return (
        <>
            <p id={'Overview'}>Overview</p>
            <p>
                Tidal, developed by Tern Systems, is a pioneering Software-as-a-Service (SaaS) platform aimed at
                propelling the shift from binary to ternary computing. By leveraging the enhanced data density and
                efficiency of ternary logic, Tidal empowers developers to explore ternary-based programming in a
                dedicated sandbox environment, complete with languages uniquely designed for ternary logic: BTMC, TERN,
                and G.
            </p>
            <br />
            <p>
                BTMC serves as the machine code layer, providing direct control over the ternary hardware with compact,
                optimized commands. TERN, a ternary assembly language, acts as a bridge between high-level code and
                BTMC, supporting efficient data handling and memory management. At the highest level, G offers a
                user-friendly syntax inspired by C, enabling developers to delve into ternary computing with familiar
                constructs.
            </p>
            <br />
            <p>
                Tidal’s emulator includes input and output interfaces, enabling seamless transitions between code
                writing, execution, and debugging. Integrated tools such as a Sidebar for project management, save
                features, and documentation facilitate a streamlined workflow. Additionally, the platform’s
                community-focused Explore Keys feature fosters collaborative learning by allowing users to share and
                explore public Keys, making Tidal a comprehensive platform for advancing ternary programming and
                innovation.
            </p>
            <br />
            <p id={'Introduction'}>Introduction</p>
            <p>
                Tern Systems is the developer behind Tidal, created to advance its mission of transforming computing
                through the power of ternary computer processors. With a vision to lead the paradigm shift from
                traditional binary computing to the more efficient ternary computing, Tern Systems recognized the need
                to engage and educate the global developer community on this transition.
            </p>
            <br />
            <p>
                In response, Tidal was developed as a groundbreaking web application designed to inspire and captivate
                software developers. It serves as a flagship product, embodying Tern Systems’ philosophy and aligning it
                with the aspirations of programmers worldwide. The platform simplifies the exploration of ternary logic,
                enabling users to independently learn and experiment with this next-generation computing technology.
            </p>
            <br />
            <p>
                Tidal demonstrates the practical application of ternary logic, highlighting its advantages in terms of
                higher data density, lower power consumption, and increased operational efficiency. The SaaS platform
                provides a sandbox environment, through its emulator, where developers can experiment with programming
                languages tailored to ternary logic principles.
            </p>
            <br />
            <p>
                While conventional computers rely on binary logic, which limits them to the two states 0 and 1, ternary
                systems introduce three states: negative -, neutral 0, and positive +. By allowing users to explore the
                potential of ternary computing, Tidal paves the way for a new era of software and hardware innovation.
            </p>
            <br />
            <p id={'Languages'}>Languages</p>
            <p>
                Tidal’s full potential is realized through the integration of three core technologies: the programming
                languages BTMC, TERN, and G. Each language forms a critical layer in a comprehensive technology stack,
                building progressively from the foundation of balanced ternary logic. The development of software within
                Tidal is intrinsically tied to a vision of optimal hardware design—specifically, the world&apos;s first
                ternary computer microprocessor, driven by three-state logic transistors. This synergy between hardware
                and software underpins the advanced capabilities of the platform.
            </p>
            <br />
            <p id={'BTMC'}>BTMC</p>
            <p>
                Balanced Ternary Machine Code (BTMC) forms the foundational layer of our software architecture,
                facilitating direct communication between the software and the hardware, which operate in three distinct
                states: negative, neutral, and positive. To effectively interface with the hardware and leverage these
                states, the machine code must inherently reflect this ternary representation. BTMC accomplishes this
                through a character set comprised of -, 0, and +, corresponding to negative, neutral, and positive
                states, respectively.
            </p>
            <br />
            <p>
                BTMC encodes sequences of these characters in a way that directly impacts the structural integrity and
                execution of the program. Tidal, our development platform, utilizes a dual methodology—both bottom-up
                and top-down—to ensure that the high-level programming language (G) code is seamlessly compiled into
                TERN assembly language and subsequently assembled into BTMC. This process ensures the accurate
                conversion of high-level code into the machine-level instructions required by the ternary transistors.
                Additionally, the system can generate a BTMC output that mirrors high-level program logic and graphical
                outputs where applicable. The translation from TERN assembly language to BTMC is governed by the
                Instruction Set Architecture (ISA) specific to Tidal, referred to as the 27-Tert TERN Integer (T27I)
                base instruction set. As the name suggests, this ISA is designed for a 27-register processor and defines
                all instructions and directives used within the TERN assembly language. It allows the assembler to
                translate high-level operations into machine-level opcodes, which are subsequently transformed into the
                appropriate BTMC format. This process ensures a precise and efficient interaction between the software
                layer and the ternary hardware.
            </p>
            <br />
            <p>
                Each instruction of the T27I ISA is always encoded in a 27-tert size machine code, where the instruction
                opcode occupies 6-tert size, and each register occupies only a 3-tert size, ensuring compact and
                efficient instruction representation. Immediate operations support numbers with up to 12 terts,
                providing a wide range of immediate data handling capabilities. Register allocation is highly efficient,
                requiring only 3 terts per register, optimizing hardware resource usage. The architecture supports a
                13-tert branch offset, enabling a broad memory range for branching operations. Additionally,
                unconditional jumps utilize a 19-tert address field, allowing for extensive control flow management.
            </p>
            <br />
            <p>
                Of the 27 registers available in the T27I architecture, two are hardwired: one for signed zero and the
                other for unsigned zero. These dedicated registers improve the efficiency of operations involving zero,
                reducing computational overhead and enhancing overall processing speed. This carefully designed
                instruction set, combined with the capabilities of BTMC, ensures optimal performance in ternary
                computing environments.
            </p>
        </>
    );
};

export { TidalManualContent, TidalManualAnchors };
