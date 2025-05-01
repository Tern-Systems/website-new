import cn from 'classnames';
import { ReactSVG } from 'react-svg';

import { BreadcrumbRoute, Content, H1, Section } from '@/app/ui/atoms';

import SVG_CREDO_HR from '@/assets/images/credo-hr.svg';

function CredoPage() {
    return (
        <Content
            type={'long'}
            heading={
                <Section>
                    <BreadcrumbRoute className={'mr-auto w-fit'} />
                    <div className={'flex flex-col items-center  mt-xxl lg:mt-5xl'}>
                        <H1>Our Credo</H1>
                        <ReactSVG
                            src={SVG_CREDO_HR.src}
                            className={'mt-[2.31rem]  sm:mt-xs md:mt-s  w-[12.69rem] sm:w-[6.0625rem]'}
                        />
                    </div>
                </Section>
            }
        >
            <Section>
                <div
                    className={cn(
                        'leading-l',
                        'pt-6xl-1 lg:pt-6xl',
                        'text-20 md:text-32 lg:text-36',
                        'pb-[16.38rem] md:pb-[21.87rem] lg:pb-[27.5rem]',
                    )}
                >
                    <p>
                        We abide and provide by the following doctrine, which outlines our core ideology’s six core
                        values and exclusive purpose. We look for consistency, earnestness, acumen, flexibility,
                        obsession, and ingenuity in each constituent we interact with. These six values, defined as
                        follows, shape our organization’s expectations and illustrate the characteristics we respect and
                        adhere to.
                    </p>
                    <br />
                    <p>
                        Consistency is conveyed through established dependability and predictability of character,
                        stemming from unwavering commitment to their purpose. Earnestness inspires sincere and intense
                        conviction, sustained by a strongly formed belief in one’s principles.
                    </p>
                    <br />
                    <p>
                        Acumen produces sound judgments and quick decisions, bolstered by an unwavering confidence in
                        one’s expertise and abilities.
                    </p>
                    <br />
                    <p>
                        Flexibility increases the propensity to bend easily without breaking and is derived from
                        frequently maintaining an open mind.
                    </p>
                    <br />
                    <p>
                        Obsession provokes fanatical attention to detail past the point of rationality but stems from a
                        place of deep, unapologetic love.
                    </p>
                    <br />
                    <p>
                        Ingenuity encapsulates cleverness, originality, and inventiveness, originating from resolute
                        passion.
                    </p>
                    <br />
                    <p>
                        While our values may serve as a general guide for the characteristics sought by groups and
                        individuals, our purpose encapsulates an exacting and eternal meaning for our company’s
                        existence.
                    </p>
                    <br />
                    <p>
                        tern’s overarching perpetual driving purpose is to develop, manufacture, preserve, and enhance
                        fundamental computer software and hardware, emphasizing universal efficiency across all
                        processes.
                    </p>
                    <br />
                    <p>
                        This ideology serves as our organization’s moral compass. We aim to pursue these values and
                        purpose everlastingly.
                    </p>
                </div>
            </Section>
        </Content>
    );
}

export default CredoPage;
