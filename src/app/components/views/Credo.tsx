import React from 'react';

const PARAGRAPHS: string[] = [
    "We abide by the following doctrine, which outlines our core ideology's six core values and exclusive purpose.",
    "We look for consistency, earnestness, acumen, flexibility, obsession, and ingenuity in each constituent we interact with.",
    "These six values, defined as follows, outline our organization's expectations and illustrate the characteristics we respect and adhere to.",
    "Consistency is conveyed through established dependability and predictability of character, stemming from unwavering commitment to their purpose.",
    "Earnestness inspires sincere and intense conviction, sustained by a strongly formed belief in one’s principles.",
    "Acumen produces sound judgments and quick decisions, bolstered by an unwavering confidence in one’s expertise and abilities.",
    "Flexibility increases the propensity to bend easily without breaking and is derived from frequently maintaining an open mind.",
    "Obsession provokes fanatical attention to detail past the point of rationality but stems from a place of deep, unapologetic love.",
    "Ingenuity encapsulates cleverness, originality, and inventiveness, originating from resolute passion.",
    "While our values may serve as a general guide for the characteristics sought by groups and individuals, our purpose encapsulates an exacting and eternal meaning for our company's existence.",
    "The overarching perpetual driving purpose of Tern is to develop, manufacture, preserve, and enhance fundamental computer software and hardware, emphasizing universal efficiency across all processes.",
    "This ideology serves as our organization’s moral compass. We aim to pursue these values and purpose everlastingly.",
]

const Credo = () => {
    const Paragraphs = PARAGRAPHS.map((p, index) => <p key={p.slice(5) + index} className={'mb-[2.3rem]'}>{p}</p>)
    return (
        <div className='text-left text-[1.6875rem] mt-[5.87rem] ml-[5.94rem] font-bold w-[65.125rem]'>
            <h1 className={'text-[2.25rem] mb-[2.3rem]'}>Our Credo</h1>
            {Paragraphs}
        </div>
    );
};

export {Credo};
