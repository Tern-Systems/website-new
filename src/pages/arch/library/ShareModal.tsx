import {FC, useState} from "react";
import Image from "next/image";
import cn from "classnames";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";

import {BaseModal} from "@/app/ui/modals";

import styles from '@/app/common.module.css';


import SVG_FIGURE_FALLBACK from '/public/images/figure.svg';
import SVG_CHEVRON from '/public/images/icons/chewron.svg';
import SVG_COPY from '/public/images/icons/copy.svg';


const ICONS = [ // TODO
    {svg: TwitterIcon, element: TwitterShareButton},
    {svg: WhatsappIcon, element: WhatsappShareButton},
    {svg: FacebookIcon, element: FacebookShareButton},
    {svg: RedditIcon, element: RedditShareButton},
    {svg: TelegramIcon, element: TelegramShareButton},
    {svg: LinkedinIcon, element: LinkedinShareButton},
    {svg: PinterestIcon, element: PinterestShareButton},
    {svg: ViberIcon, element: ViberShareButton},
    {svg: TumblrIcon, element: TumblrShareButton},
];

const VISIBLE_ICONS_COUNT = 7;
const LINK_COPY_TIMEOUT_MS = 50;
const LINK_DESCRIPTION = 'Check my last AR code I generated using https://tern.ac/Service/Create';


interface Props {
    name: string;
    file: string;
}

const ShareModal: FC<Props> = (props: Props) => {
    const {name, file} = props;

    const [iconStartIdx, setIconStartIdx] = useState(0);
    const [infoState, setInfoState] = useState('');

    const handleLinkCopy = async () => {
        setInfoState('');

        if (!navigator.clipboard) {
            setInfoState(`The link can't be copied if you are using http://`);
            return;
        }

        await navigator.clipboard?.writeText(file);
        setTimeout(() => {
            setInfoState('The link has been copied to your clipboard');
        }, LINK_COPY_TIMEOUT_MS);
    }


    const Icons = ICONS.slice(iconStartIdx, VISIBLE_ICONS_COUNT + iconStartIdx).map((icon, idx) => (
        <icon.element key={Date.now() + idx}
                      url={file}
                      summary={LINK_DESCRIPTION}
                      description={LINK_DESCRIPTION}
                      media={file}
                      className={`inline-block [&_path]:bg-control-white rounded-full overflow-hidden ${styles.clickable}`}
        >
            <icon.svg className={'w-[--p-content-xl] h-auto rounded-full  sm:w-[--p-content-s]'}/>
        </icon.element>
    ));

    return (
        <BaseModal title={'Share AR Code'}
                   className={'max-w-[30rem] w-full  sm:landscape:max-w-[21rem]'}
                   classNameContent={'flex flex-col place-items-center'}
        >
            <Image
                src={file || SVG_FIGURE_FALLBACK}
                width={85}
                height={85}
                alt={'figure'}
                className={cn(
                    `p-[--p-content-xs] w-[43%] h-auto rounded-small border-[0.1875rem] border-control-white`,
                    `sm:landscape:x-[p-[--p-content-4xs],max-w-[6.25rem]]`
                )}
            />
            <span
                className={cn(
                    'mt-[--p-content-xxs] w-[90%] font-oxygen text-center leading-[1.2] font-bold select-all',
                    'mb-[--p-content] text-heading-s',
                    'md:x-[mb-[--p-content-s],text-section-s]',
                    'sm:x-[mb-[--p-content-xs],text-basic]',
                    'sm:landscape:x-[text-nowrap,overflow-x-hidden,overflow-ellipsis]',
                )}
            >
                {name}
            </span>
            <span className={'flex place-items-center'}>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[0.875rem] h-auto rotate-90 cursor-pointer'}
                    onClick={() => setIconStartIdx(prevState => prevState > 0 ? prevState - 1 : prevState)}
                />
                <span className={`inline-block w-full`}>
                    <span className={'flex gap-x-[--p-content-3xs] px-[--p-content-4xs]  sm:gap-x-[--p-content-4xs]'}>
                        {Icons}
                    </span>
                </span>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[0.875rem] h-auto -rotate-90 cursor-pointer'}
                    onClick={() =>
                        setIconStartIdx(prevState => ICONS.length - prevState > VISIBLE_ICONS_COUNT ? prevState + 1 : prevState)
                    }
                />
            </span>
            <span
                className={cn(
                    `flex place-items-center mt-[--p-content-s] px-[0.56rem] w-[90%]`,
                    `h-[1.6rem] rounded-smallest border-small border-control-white bg-control-gray-l0`,
                    `md:mt-[--p-content-xs]`,
                    `sm:x-[mt-[--p-content-xxs],h-[1.4rem]]`,
                )}
            >
                <Image
                    src={SVG_COPY}
                    alt={'copy'}
                    className={`${styles.clickable} cursor-pointer h-[75%] w-auto`}
                    onClick={() => handleLinkCopy()}
                />
                <span
                    className={cn(
                        'ml-[0.51rem] overflow-ellipsis overflow-hidden text-nowrap leading-[1.2] select-all',
                        'sm:text-section-xxs'
                    )}
                >
                    {file}
                </span>
            </span>
            <span className={'mt-[--p-content-4xs] text-small leading-[1.2]  sm:text-section-xxs'}>{infoState}</span>
        </BaseModal>
    )
}

export {ShareModal}