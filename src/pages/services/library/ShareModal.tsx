import {FC, useState} from "react";
import Image from "next/image";
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
        await navigator.clipboard.writeText(file);

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
                      className={`inline-block [&_path]:bg-control-white  rounded-full overflow-hidden ${styles.clickable}`}
        >
            <icon.svg className={'w-[--2hdr] h-auto rounded-full'}/>
        </icon.element>
    ));

    return (
        <BaseModal title={'Share AR Code'} className={'w-[min(90dvw,30rem)]'}
                   classNameContent={'flex flex-col place-items-center'}>
            <Image
                src={file || SVG_FIGURE_FALLBACK}
                width={85}
                height={85}
                alt={'figure'}
                className={`w-[43%] h-auto rounded-small border-[0.1875rem] border-control-white p-[min(4dvw,1.44rem)]`}
            />
            <span className={'font-oxygen text-content font-bold mt-[min(2.7dvw,1rem)] mb-[min(5.3dvw,1.9rem)]'}>
                {name}
            </span>
            <span className={'flex place-items-center'}>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[min(2.8dvw,0.875rem)] h-auto rotate-90 cursor-pointer'}
                    onClick={() => setIconStartIdx(prevState => prevState > 0 ? prevState - 1 : prevState)}
                />
                <span className={`inline-block h-[--2hdr] w-[100%]`}>
                    <span className={'flex gap-x-[--s-small] px-[min(1dvw,0.63rem)]'}>
                        {Icons}
                    </span>
                </span>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[min(2.8dvw,0.875rem)] h-auto -rotate-90 cursor-pointer'}
                    onClick={() =>
                        setIconStartIdx(prevState => ICONS.length - prevState > VISIBLE_ICONS_COUNT ? prevState + 1 : prevState)
                    }
                />
            </span>
            <span
                className={`px-[min(4dvw,0.56rem)] flex place-items-center mt-[--1hdr] h-[min(6.1dvw,1.6rem)] rounded-smallest
                            w-[90%] max-w-[20rem] overflow-ellipsis border-small border-control-grayL1 bg-control-gray-l0`}>
                <Image
                    src={SVG_COPY}
                    alt={'copy'}
                    className={`${styles.clickable} cursor-pointer h-[75%] w-auto`}
                    onClick={() => handleLinkCopy()}
                />
                <span className={'ml-[min(4dvw,0.51rem)] text-nowrap overflow-ellipsis overflow-hidden'}>
                    {file}
                </span>
            </span>
            <span className={'mt-[0.5rem] text-small'}>{infoState}</span>
        </BaseModal>
    )
}

export {ShareModal}