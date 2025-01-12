import React from 'react'

import {ContentAnchors} from "@/app/types/documentation";


const GHandbookAnchors: ContentAnchors = [
    'Terms and Abbreviations',
    'Introduction',
    {'Overview': ['Comments', 'Literals', 'Data Types', 'Keywords', 'Variables', 'Inference']},
    {'Operators': ['Arithmetic', 'Relational', 'State', 'Allocation', 'Conditional', 'Precedence and Associativity']},
    {'Statements': ['Control Flow']},
    {'Arrays': ['One-Dimensional Arrays', 'Two-Dimensional Arrays', 'Multidimensional Arrays', 'Memory Layout']},
    {'Strings': ['Declarations', 'String Length', 'String Concatenations', 'Modifications', 'Functions', 'Declarations', 'Parameters']},
    {'Calls and Argument Passing': ['Recursion', 'Glossary']}
];


const GHandbookContent = () => {
    return (
        <>
            <p id={'Introduction'}> Introduction</p>
            <p>
                Life-cycle, memory instructions, blah blah blah and some history stuff about how the language
                came
                to be created. built T27I first. Do not talk about the history of ternary computers or logic or
                any
                of that, that can be saved for the BTMC Textbook.
            </p>
            <br/>
            <p id={'Overview'}>Chapter 1. Overview</p>
            <p>
                The G programming language is a high-level language that exploits the advantages of ternary
                logic
                machine code. Specifically, our language targets an assembly language, T27I, which assembles to
                a
                balanced ternary machine code specification referred to as BTMC.
            </p>
            <br/>
            <p>
                TernKey features a cutting-edge high-level programming language called G, which resembles C in
                terms
                of structure. It leverages Backus-Naur Form notation and shares syntax and semantic rules
                similar to
                C&apos;s. The G language’s primary goal is to facilitate seamless adoption, allowing developers
                to
                effectively delve into and contrast the conventional binary-based programming paradigm with the
                groundbreaking approach of ternary-based computation.
            </p>
            <br/>
            <p>
                Disclaimer saying why we are not using the full 27-tert register size and only the least
                significant
                teryte because we are using smaller values to allow for easier comprehension and representation.
            </p>
            <br/>
            <p>
                The system enables three-dimensional computation by leveraging ternary logic, allowing for more
                complex decision-making structures. This is achieved through three-way branching in control flow
                mechanisms such as If statements, providing additional neutral branching beyond the conventional
                true and false Boolean logic conditions.
            </p>
            <br/>
            <p>
                Furthermore, all loop constructs, such as for, while, and do-while, support three-way branching,
                enabling a third pathway in iteration logic. This approach, referred to as Terlean logic,
                facilitates thinking beyond binary outcomes by introducing a neutral state, thereby expanding
                computational possibilities.
            </p>
            <br/>
            <p>
                The G language follows structured programming principles and incorporates functional programming
                features for enhanced abstraction and modularity.
            </p>
            <br/>
            <p>
                In addition, a quaternary conditional operator is implemented, extending the capabilities of
                traditional ternary operations by accommodating three-dimensional evaluation of conditions,
                thereby
                further broadening the decision-making options available to expressions.
            </p>
            <br/>
            <p id={'1-1-Comments'}>1.1 Comments</p>
            <p>
                In G, comments enhance the readability of code by providing explanations, clarifications, or
                annotations for the programmer or anyone reviewing the code. Comments may appear anywhere a
                blank,
                tab or newline can. Comments are ignored by the compiler and do not affect the program’s
                execution.
                G supports two types of comments: single-line and multi-line.
            </p>
            <br/>
            <p>
                Single-line comments begin with two forward slashes // and continue until the end of the line.
                They
                are typically used for brief explanations or to disable a single line of code during debugging
                or
                testing.
            </p>
            <br/>
            <p>
                Multi-line comments start with /* and end with */. These comments can span multiple lines,
                making
                them useful for longer descriptions, explanations of complex logic, or block-level annotations
                within the code.
            </p>
            <br/>
            <p>
                While comments are essential for making code more understandable, excessive or poorly written
                comments can reduce clarity. Therefore, it is recommended to use comments judiciously and ensure
                that the comments accurately reflect the purpose and functionality of the code. Commenting is
                especially important in collaborative environments where multiple developers might work on the
                same
                codebase, as it helps maintain consistency and understanding across the team.
            </p>
            <br/>
            <p>
                In addition, G comments cannot be nested. Attempting to nest comments, such as placing a
                multi-line
                comment within another multi-line comment, will result in a compilation error. Therefore,
                developers
                should ensure proper comment usage to avoid disrupting code compilation.
                Single-Line Comment
            </p>
            <br/>
            <p>
                The single-line delimiter symbol, depicted by the // token, is used exclusively to insert
                comments
                into code with one line.
            </p>
            <br/>
            <p>Format:</p>
            <p>
                In the above format, the single-line comment token // embeds a single-line comment in the
                program&apos;s source code.
            </p>
            <br/>
            <p>Example:</p>
            <p>
                In this example, we have three single-line comments on lines 2, 3, and 4. The compiler ignores
                all
                content to the right of each single-line comment delimiter symbol token // as long as it is on
                the
                same line.
            </p>
            <br/>
            <p>
                In this example, we declare an integer variable a with the value 5. In balanced ternary, the
                number
                5 is represented as 000000+--. We then define another integer variable, b, with the value 2. The
                result variable is uninitialized. This tells the program to shift the terts of a to the left by
                2
                positions. The left shift state operator &qt;&qt; works by moving the terts of the balanced
                ternary
                number to the left by the specified number of positions and filling the rightmost terts with
                zeros;
                in our case, shifting 000000+-- by 2 positions to the left results in 0000+--00, equivalent to
                the
                decimal value 45. The final result is stored in the result variable and returned by the program.
            </p>
        </>
    )
}

export {GHandbookContent, GHandbookAnchors};
