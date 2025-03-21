import { Dispatch, FC, SetStateAction, useRef } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { CardData, SavedCardFull } from '@/app/types/billing';
import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { getCardName, mapSavedCard } from '@/app/utils';
import { useOuterClickClose } from '@/app/hooks/useOuterClickClose';
import { useModal, useUser } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { MessageModal } from '@/app/ui/modals';

import SVG_CARD from '@/assets/images/icons/card.svg';
import SVG_MARK from '@/assets/images/icons/mark.svg';
import SVG_CROSS from '@/assets/images/icons/close.svg';

const LI_P_CN = `px-xxs py-4xs sm:py-3xs`;

interface Props {
    savedCards: SavedCardFull[];
    setUpdateCards: Dispatch<SetStateAction<boolean>>;
    openState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const ChangePaymentMethod: FC<Props> = (props: Props) => {
    const { savedCards, setUpdateCards, openState } = props;

    const [opened, setOpened] = openState;

    const modalCtx = useModal();
    const { userData } = useUser();

    const ref = useRef<HTMLDivElement | null>(null);

    useOuterClickClose(ref, opened, setOpened);

    const updateCard = async (idx: number) => {
        if (!userData) return false;
        try {
            const updatedCard: CardData = {
                ...mapSavedCard(savedCards[idx]),
                isPreferred: true,
            };
            const { message } = await BillingService.postUpdateCard(updatedCard, userData.email);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            setUpdateCards(true);
            return true;
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            return false;
        }
    };

    // Elements
    const SavedCards = savedCards.map((card, idx) => {
        const { preferred } = card;
        return (
            <li
                key={(card.nickName ?? 'card-') + idx}
                onClick={() => updateCard(idx)}
                className={cn(
                    `grid grid-cols-[min-content,1fr,min-content] items-center justify-between rounded-s [&_path]:fill-primary`,
                    `sm:text-27-xs text-16`,
                    LI_P_CN,
                    { ['brightness-[0.6]']: preferred },
                )}
            >
                <ReactSVG
                    src={SVG_CARD.src}
                    className={`mr-4xs [&_*]:w-[1.55rem] sm:[&_*]:w-[1.375rem]`}
                />
                <span className={'max-w-[calc(100%-1.75rem)] overflow-hidden overflow-ellipsis text-nowrap'}>
                    {getCardName(card)}
                </span>
                {preferred ? (
                    <ReactSVG
                        src={SVG_MARK.src}
                        className={'ml-5xs h-auto w-[1rem] sm:w-[0.875rem]'}
                    />
                ) : null}
            </li>
        );
    });

    return (
        <div
            ref={ref}
            className={'absolute -top-xs right-0 z-10 w-[27.5625rem] max-w-full bg-black'}
        >
            <div className={'flex items-center justify-between'}>
                <h1 className={'pl-xxs text-16 lg:text-18'}>Change Payment Method</h1>
                <ReactSVG
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpened(false);
                    }}
                    src={SVG_CROSS.src}
                    className={cn(
                        'p-3xs hover:bg-black-l0 [&_path]:fill-primary',
                        '[&_*]:size-[0.875rem] sm:[&_*]:size-[0.75rem]',
                    )}
                />
            </div>
            <hr className={'border-gray'} />
            <div className={'p-xxs'}>
                <ul className={'flex list-none flex-col'}>{SavedCards}</ul>
                <PageLink
                    icon={'plus'}
                    href={Route.EditPaymentMethod}
                    className={cn('w-full sm:justify-start', LI_P_CN)}
                    iconClassName={'mr-3xs sm:mr-[1rem]  [&_*]:size-[1.125rem] sm:[&_*]:size-[1rem]'}
                >
                    Add alternative payment method
                </PageLink>
            </div>
        </div>
    );
};

export { ChangePaymentMethod };
