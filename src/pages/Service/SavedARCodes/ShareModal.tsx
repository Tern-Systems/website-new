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
            className={'inline-block [&_path]:bg-white'}
        >
            <Image src={icon.svg} alt={icon.href + idx} className={`min-w-[2.5rem] rounded-full`}/>
        </a>
    ));

    return (
        <BaseModal title={'Share AR Code'} className={'w-[30.31rem]'}
                   classNameContent={'flex flex-col place-items-center'}>
            <Image
                src={file ?? SVG_FIGURE_FALLBACK}
                width={85}
                height={85}
                alt={'figure'}
                className={`size-[8.19rem] rounded-full border-[0.1875rem] border-control4 p-[1.44rem]`}
            />
            <span className={'font-oxygen text-[1.3125rem] font-bold mt-[1rem] mb-[1.9rem]'}>{name}</span>
            <span className={'flex place-items-center'}>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[0.875rem] h-[1.5rem] rotate-90 cursor-pointer'}
                    onClick={() =>
                        setIconStartIdx(prevState => prevState > 0 ? prevState - 1 : prevState)
                    }
                />
                <span className={`inline-block h-[2.5rem] w-[23.62rem]`}>
                    <span className={'flex gap-[0.81rem] px-[0.63rem]'}>
                        {Icons}
                    </span>
                </span>
                <Image
                    src={SVG_CHEVRON}
                    alt={'right'}
                    className={'w-[0.875rem] h-[1.5rem] -rotate-90 cursor-pointer'}
                    onClick={() =>
                        setIconStartIdx(prevState => ICONS.length - prevState > VISIBLE_ICONS_COUNT ? prevState + 1 : prevState)
                    }
                />
            </span>
            <span
                className={'px-[0.56rem] flex place-items-center mt-[1.56rem] h-[1.625rem] rounded-[0.375rem] w-[24.74rem] overflow-ellipsis border-small border-control bg-control2'}>
                <Image
                    src={SVG_COPY}
                    alt={'copy'}
                    className={'cursor-pointer'}
                    onClick={() => navigator.clipboard.writeText(file)}
                />
                <span className={'ml-[0.51rem]'}>{file}</span>
            </span>
        </BaseModal>
    )
}

export {ShareModal}