import cn from 'classnames';
import { ReactSVG } from 'react-svg';

import { BreadcrumbRoute } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';
import stylesLocal from './Credo.module.css';

import SVG_CREDO_HR from '@/assets/images/credo-hr.svg';

function CredoPage() {
    return (
        <>
            <section className={cn(styles.section, stylesLocal.sectionGradient)}>
                <div className={cn(styles.content, 'mt-l')}>
                    <BreadcrumbRoute />
                </div>
                <div className={cn('flex flex-col items-center  ', 'mt-xxl lg:mt-5xl')}>
                    <h1 className={'text-32 md:text-48 lg:text-64'}>Our Credo</h1>
                    <ReactSVG
                        src={SVG_CREDO_HR.src}
                        className={cn(
                            '[&_*]:w-10xl md:[&_*]:w-[12.69rem] lg:[&_*]:w-[12.69rem]',
                            'mt-xs md:mt-s lg:mt-xl',
                        )}
                    />
                </div>
                <div
                    className={cn(
                        styles.content,
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
            </section>
        </>
    );
}

export default CredoPage;
