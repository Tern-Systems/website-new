import {FC, useState} from "react";
import Image from "next/image";

import {BaseModal} from "@/app/ui/modals";

import SVG_FIGURE_FALLBACK from '@/assets/images/figure.svg';
import SVG_CHEVRON from '@/assets/images/icons/chewron.svg';
import SVG_COPY from '@/assets/images/icons/copy.svg';
import SVG_DISCORD from "@/assets/images/icons/discord.svg";

import SVG_DROPBOX from "@/assets/images/icons/dropbox.svg";
import SVG_FACEBOOK from "@/assets/images/icons/facebook.svg";
import SVG_GOOGLE_DRIVE from "@/assets/images/icons/drive.svg";
import SVG_INSTAGRAM from "@/assets/images/icons/instagram.svg";
import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_REDDIT from "@/assets/images/icons/reddit.svg";
import SVG_SHAREPOINT from "@/assets/images/icons/sharepoint.svg";
import SVG_VIBER from "@/assets/images/icons/viber.svg";
import SVG_X from "@/assets/images/icons/x-twitter.svg";


const ICONS: { svg: string, href: string }[] = [ // TODO
    {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
    {svg: SVG_VIBER, href: 'https://discord.gg/ZkZZmm8k4f'},
    {svg: SVG_INSTAGRAM, href: 'https://discord.gg/ZkZZmm8k4f'},
    {svg: SVG_X, href: 'https://x.com/Tern_Systems'},
    {svg: SVG_REDDIT, href: 'https://www.reddit.com/user/Tern_Systems'},
    {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys'},
    {svg: SVG_FACEBOOK, href: 'https://www.facebook.com/ternsystemsinc'},
    {svg: SVG_SHAREPOINT, href: 'https://www.facebook.com/ternsystemsinc'},
    {svg: SVG_GOOGLE_DRIVE, href: 'https://www.facebook.com/ternsystemsinc'},
    {svg: SVG_DROPBOX, href: 'https://www.facebook.com/ternsystemsinc'},
];
const VISIBLE_ICONS_COUNT = 7;


interface Props {
    name: string;
    file: string;
}

const ShareModal: FC<Props> = (props: Props) => {
    const {name, file} = props;

    const [iconStartIdx, setIconStartIdx] = useState(0);

    const Icons = ICONS.slice(iconStartIdx, VISIBLE_ICONS_COUNT + iconStartIdx).map((icon, idx) => (
        <a
            key={icon.href + idx}
            href={icon.href}
            target={'_blank'}
            className={'inline-block [&_path]:bg-control-white'}
        >
            <Image src={icon.svg} alt={icon.href + idx} className={`w-[--2hdr] rounded-full`}/>
        </a>
    ));

    return (
        <BaseModal title={'Share AR Code'} className={'w-[min(90dvw,30rem)]'}
                   classNameContent={'flex flex-col place-items-center'}>
            <Image
                src={file || SVG_FIGURE_FALLBACK}
                width={85}
                height={85}
                alt={'figure'}
                className={`size-[43%] rounded-full border-[0.1875rem] border-control-white p-[min(4dvw,1.44rem)]`}
            />
            <span className={'font-oxygen text-content font-bold mt-[min(2.7dvw,1rem)] mb-[min(5.3dvw,1.9rem)]'}>
                {name}
            </span>
            <span className={'flex place-items-center'}>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[min(2.8dvw,0.875rem)] rotate-90 cursor-pointer'}
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
                    className={'w-[min(2.8dvw,0.875rem)] -rotate-90 cursor-pointer'}
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
                    className={'cursor-pointer h-[75%]'}
                    onClick={() => navigator.clipboard.writeText(file)}
                />
                <span className={'ml-[min(4dvw,0.51rem)]'}>{file}</span>
            </span>
        </BaseModal>
    )
}

export {ShareModal}