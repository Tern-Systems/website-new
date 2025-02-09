import React, {Dispatch, FC, MutableRefObject, ReactElement, SetStateAction, useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import cn from "classnames";

import {NavDropdown} from "@/app/types/layout";
import {ALWAYS_MAPPED_ROUTES, DROPDOWN_SUB_NAV_ROUTES, MAPPED_SUB_NAV_ROUTES, NavLink, Route} from "@/app/static";
import {Breakpoint} from "@/app/hooks/useBreakpointCheck";

import {checkSubRoute, getRouteLeave, getRouteName} from "@/app/utils";
import {useBreakpointCheck, useNavigate} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";

import {Select} from "@/app/ui/form";
import {PageLink} from "@/app/ui/layout";

import styles from "@/app/common.module.css";
import stylesLayout from './Layout.module.css'


interface Props {
    dropdownState: [NavDropdown | null, Dispatch<SetStateAction<NavDropdown | null>>];
    headerLinkCount: number | null;
}

const SubNav: FC<Props> = (props: Props) => {
    const {headerLinkCount, dropdownState} = props;

    const [navDropdown, setDropdownColumns] = dropdownState;

    const route = usePathname();
    const breakpoint = useBreakpointCheck();
    const modalCtx = useModal();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();

    const subNavRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!subNavRef.current?.contains(event.target as Node))
                setDropdownColumns(null);
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
    }, [])

    const subNavLinks = layoutCtx.navLinks[NavLink.Sub2Nav];

    // Elements
    const DropdownLi: ReactElement[] | null = !navDropdown
        ? null
        : navDropdown.columns.map((column, idx) => {
            const entries = Object.entries(column);
            const LinksLi: ReactElement[] = entries.map(([title, action], entryIdx) => {
                const isString = typeof action === 'string';
                const isExternal = isString && action.startsWith('https://');

                return (
                    <li
                        key={title + idx + entryIdx}
                        className={'first-letter:uppercase first-of-type:x-[mb-5xs,text-documentation]'}
                    >
                        <PageLink
                            onClick={async () => {
                                if (isString) {
                                    if (isExternal)
                                        window.open(action, '_blank');
                                    else
                                        await navigate(action as Route);
                                } else
                                    action(modalCtx);
                                setDropdownColumns(null);
                            }}
                            icon={!entryIdx ? 'arrow-right-long' : undefined}
                            className={'flex-row-reverse'}
                            iconClassName={'ml-4xs !size-[1.6rem]'}
                        >
                            {title}
                        </PageLink>
                    </li>
                );
            })

            return (
                <li key={entries.length + '' + idx} className={'contents'}>
                    <ul className={cn('flex flex-col gap-y-xxs text-nowrap', {['flex-1']: breakpoint <= Breakpoint.sm})}>
                        {LinksLi}
                    </ul>
                </li>
            );
        });


    const SubNavItems: ReactElement[] | null = breakpoint === Breakpoint.xxs || !subNavLinks
        ? null
        : (
            subNavLinks.map((link, idx) => {
                const mappedLink = MAPPED_SUB_NAV_ROUTES[link];
                const mapRoute = mappedLink && (
                    checkSubRoute(route, link)
                    || ALWAYS_MAPPED_ROUTES.some(check => getRouteLeave(link).includes(check))
                );
                const isActiveCN = checkSubRoute(route, link, true);
                const dropdownLinks = DROPDOWN_SUB_NAV_ROUTES[link];

                return (
                    <li
                        key={link + idx}
                        tabIndex={(headerLinkCount ?? 0) + idx}
                        className={cn('group', stylesLayout.navLink, {[cn(stylesLayout.activeNavLink, 'before:bg-blue')]: isActiveCN})}
                    >
                        {dropdownLinks
                            ? (
                                <Select
                                    value={link}
                                    options={dropdownLinks}
                                    //eslint-disable-next-line
                                    onChangeCustom={(value) => {
                                        // TODO handle links
                                    }}
                                    classNameWrapper={'!static left-0 size-full'}
                                    className={'!bg-transparent !border-0 !w-full'}
                                    classNameUl={'top-[calc(100%+2px)] py-4xs !rounded-none bg-black-l0'}
                                    classNameOption={cn(styles.clickable, '!bg-black-l0 !border-0 text-section-xxs !py-5xs')}
                                    classNameChevron={'[&_*]:w-[0.5625rem]'}
                                />
                            )
                            : (
                                <PageLink href={link}>
                                    {getRouteName(mapRoute ? mappedLink : link)}
                                </PageLink>
                            )
                        }
                    </li>
                );
            })
        );

    return (
        <>
            {!DropdownLi
                ? null
                : (
                    <div
                        ref={subNavRef}
                        className={cn(styles.section,
                            'absolute z-10 left-0 py-3xl h-fit bg-black-l0',
                            {['min-w-0 w-[79%]']: breakpoint <= Breakpoint.sm},
                        )}
                    >
                        <ul className={cn(styles.content, 'flex gap-xs flex-wrap justify-between')}>
                            {DropdownLi}
                        </ul>
                    </div>
                )
            }
            {!subNavLinks?.length
                ? null
                : (
                    <div className={'border-b-s border-gray'}>
                        <ul
                            className={cn(styles.content,
                                `flex !pl-s text-section-xxs text-nowrap`,
                                subNavLinks?.length ? 'h-sub-heading ' + styles.slideIn : styles.slideOut,
                                {['!pl-xs']: breakpoint <= Breakpoint.sm},
                            )}
                        >
                            {SubNavItems}
                        </ul>
                    </div>
                )
            }
        </>
    );
}


export {SubNav};
