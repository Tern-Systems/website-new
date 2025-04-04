// setup API function to retrieve
const FAQs: { heading: string; faqs: { question: string; answer: string }[] }[] = [
    {
        heading: 'General',
        faqs: [
            {
                question: 'What does Tern do?',
                answer: 'Tern is a technology company that designs cutting-edge semiconductors and operates as a leading fabless semiconductor manufacturer. The company is pioneering the commercialization of ternary microprocessors, introducing a transformative computing paradigm that redefines digital system operations.',
            },
            {
                question: 'Why is Tern developing a ternary microprocessor now?',
                answer: 'Tern is developing a ternary microprocessor now because traditional binary computing has reached critical limitations in power efficiency, performance scaling, and memory access due to the end of Moore’s Law and Dennard Scaling. Modern applications like AI and big data demand higher computational efficiency, yet existing architectures suffer from inefficiencies such as the memory and power walls.\nTernary logic offers a fundamental shift, reducing energy consumption, increasing computational throughput, and enabling more scalable architectures. Advances in semiconductor technology now allow the commercialization of ternary computing at an affordable scale. Tern is seizing this opportunity to revolutionize computing with the first general-purpose ternary processor.',
            },
            {
                question: 'What does ternary mean?',
                answer: 'Ternary is defined as using the number three as a base in mathematics. Binary uses base two and is represented using the characters 0 and 1, representing the decimal values 0 and +1, respectively. Ternary, on the other hand, uses three representative characters. Specifically, our technology uses balanced ternary, -, 0, and +, representing the decimal values -1, 0, and +1, respectively.',
            },
            {
                question: 'Does Tern have a physical office address?',
                answer: 'Yes, we are located at 1120 Avenue of the Americas New York, New York. You can find out more from the Contact page on our website.',
            },
            {
                question: 'What does BTMC mean?',
                answer: 'BTMC is an acronym that stands for Balanced Ternary Machine Code. Balanced ternary differs from conventional ternary in that the character representations of the decimal values -1, 0, and +1 are -, 0, and +, respectively, instead of other, less efficient, alternatives.',
            },
            {
                question: 'How does G work?',
                answer: 'The G programming language is a high-level language designed to exploit the advantages of ternary logic machine code. Specifically, G targets the T27I assembly language, which in turn assembles to a balanced ternary machine code specification known as BTMC.\nStructurally similar to C, G uses Backus–Naur form notation and follows familiar syntax and semantic rules, making it easier for developers to transition from conventional binary-based paradigms. By leveraging ternary logic, the system supports three-way branching in control flow mechanisms—such as if statements—introducing a neutral branch beyond the standard true and false conditions.',
            },

            {
                question: 'What is Tern?',
                answer: 'Tern is a fabless semiconductor company pioneering the development of ternary microprocessors—a revolutionary alternative to traditional binary computing. The company is at the forefront of the next wave of computing technology, focusing on efficiency, scalability, and sustainability.',
            },
            {
                question: "Why not just use today's programming languages instead?",
                answer: "We looked into that, and we can create translation tools to compile legacy code down to BTMC. However, this process would invite ambiguities in the source code due to the lack of advanced reasoning abilities from the high-level. In other words, today's programming languages cannot take advantage of a ternary computer fully, so we tweaked a version of C (C89) to further align with our specifications for T27I.",
            },
            {
                question: 'What does TERN mean?',
                answer: 'TERN is an acronym that stands for Ternary Executable Ratiocinative Nexus. In essence, this name communicates the central point of the exact thinking process of our balanced ternary programming languages: TERN, the assembly programming language for G, the high-level programming language atop the stack of TIDE languages.',
            },
            {
                question: 'How is G different from other programming languages?',
                answer: "The G language differs from other programming languages by leveraging ternary logic instead of binary logic, enabling a more efficient computational model. Unlike conventional languages that rely on true/false Boolean logic, G introduces terlean logic, which includes negative, neutral, and positive states. G also features a quaternary conditional operator, surpassing traditional ternary operations by evaluating conditions in three dimensions. The language is designed to interact with BTMC, making it structurally different from mainstream binary-based languages.\nG follows structured programming principles similar to C but integrates unique ternary control flow mechanisms, allowing three-way branching instead of just two. It introduces new data types like 'terl', explicitly designed for ternary logic operations. Additionally, G provides ternary arithmetic and state operators, allowing for more nuanced decision-making and computations. Memory allocation and variable assignments in G support ternary representations, improving efficiency for large-scale computations. Overall, G is built to optimize ternary computing and is not just an adaptation of binary languages but a fundamentally different paradigm.",
            },
            {
                question: 'Why is it called G?',
                answer: 'The name G was inspired by the Greek letter gamma, which has multiple meanings, including representing the number three.',
            },
            {
                question: 'What’s an IDE?',
                answer: 'An Integrated Development Environment, or IDE, is a software application that provides a comprehensive suite of tools for software development within a single interface. It includes a code editor with syntax highlighting, auto-completion, and formatting to facilitate efficient coding. A built-in compiler or interpreter translates source code into machine-readable instructions, while an integrated debugger helps identify and resolve errors by allowing developers to inspect code execution step-by-step. Many IDEs also feature build automation tools that streamline the process of compiling, linking, and packaging software applications.',
            },
        ],
    },
    {
        heading: 'Profile',
        faqs: [
            {
                question: 'Where do I go to edit my profile information?',
                answer: 'To edit your profile information, click on the profile icon located in the top right corner of the website and select Profile from the dropdown menu. This will open an expanded view of your account details, where you can update specific sections using the designated edit buttons.',
            },
            {
                question: 'What is My Tern?',
                answer: 'The My Tern Dashboard functions as a comprehensive hub for managing your Tern profile, providing seamless access to key features and resources. This centralized interface presents intuitive quick-action buttons that efficiently direct you to various sections of the website and the products associated with your memberships. Within the My Product section, you can review the full suite of Tern technologies currently available in your portfolio. Additionally, the dashboard highlights a curated list of ongoing and upcoming community events, ensuring you remain informed and engaged with the broader Tern ecosystem.',
            },
            {
                question: 'What is two-factor authentication used for?',
                answer: "Two-factor authentication (2FA) on the Tern website is used to enhance account security by requiring users to verify their identity through an additional authentication step beyond just a password. This extra layer of protection helps prevent unauthorized access by ensuring that even if a user's password is compromised, their account remains secure.\nOn the Tern platform, 2FA may be used for logging into accounts, managing sensitive information, and accessing restricted areas related to product memberships or proprietary tools. By implementing 2FA, Tern strengthens cybersecurity measures, safeguarding user data and maintaining the integrity of its ecosystem.",
            },
            {
                question: 'Where do I go to edit my profile information?',
                answer: 'To edit your profile information, click on the profile icon located in the top right corner of the website and select Profile from the dropdown menu. This will open an expanded view of your account details, where you can update specific sections using the designated edit buttons.',
            },
        ],
    },
    {
        heading: 'Subscription',
        faqs: [
            {
                question: 'How do I manage a subscription?',
                answer: 'You can manage all of your subscriptions from the Manage Subscriptions resource link located below the Order Information table under the Billing section within your profile.',
            },
        ],
    },
    {
        heading: 'Support',
        faqs: [
            {
                question: 'What is the purpose of the Support Hub?',
                answer: 'The Support Hub is a centralized resource for managing all technical inquiries and account-related information associated with your Tern account. It provides comprehensive analytics on your products, tracks the status of open and resolved cases, and offers additional support features to enhance your user experience.',
            },
            {
                question: 'How do I speak with a human about a technical problem?',
                answer: 'You can contact our support line at (973) 590-8753 for help with all technical issues you are having with the website, your account, or one of our products.',
            },
        ],
    },
];

export { FAQs };
