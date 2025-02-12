import React, {
    Dispatch,
    ForwardedRef,
    forwardRef,
    ReactElement,
    SetStateAction,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { NavDropdown } from '@/app/types/layout';
import { ALWAYS_MAPPED_ROUTES, DROPDOWN_SUB_NAV_ROUTES, MAPPED_SUB_NAV_ROUTES, NavLink, Route } from '@/app/static';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { checkSubRoute, getRouteLeave, getIdName } from '@/app/utils';
import { useBreakpointCheck, useNavigate } from '@/app/hooks';
import { useLayout, useModal } from '@/app/context';

import { Button, Select } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';
import stylesLayout from './Layout.module.css';

interface Props {
    setNavExpanded: Dispatch<SetStateAction<boolean>>;
    dropdownState: [NavDropdown | null, Dispatch<SetStateAction<NavDropdown | null>>];
    headerLinkCount: number | null;
}

const SubNavElement = (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const { headerLinkCount, dropdownState, setNavExpanded } = props;

    const [navDropdown, setDropdownColumns] = dropdownState;

    const route = usePathname();
    const breakpoint = useBreakpointCheck();
    const modalCtx = useModal();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();

    const subNavRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(ref, () => subNavRef.current as HTMLDivElement);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (subNavRef && !subNavRef?.current?.contains(event.target as Node)) setDropdownColumns(null);
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
        }, []);

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
                          className={cn(
                              'first-letter:uppercase',
                              breakpoint <= Breakpoint.xxs
                                  ? 'px-s first-of-type:font-bold'
                                  : 'first-of-type:x-[mb-5xs,text-documentation]',
                          )}
                      >
                          <PageLink
                              onClick={async () => {
                                  if (isString) {
                                      if (isExternal) window.open(action, '_blank');
                                      else await navigate(action as Route);
                                  } else action(modalCtx);
                                  setDropdownColumns(null);
                                  setNavExpanded(false);
                              }}
                              icon={!entryIdx ? 'arrow-right-long' : undefined}
                              className={'flex-row-reverse'}
                              iconClassName={cn(
                                  'ml-4xs',
                                  breakpoint <= Breakpoint.xxs ? '[&_*]:!size-[0.8rem]' : '!size-[1.6rem]',
                              )}
                          >
                              {title}
                          </PageLink>
                      </li>
                  );
              });

              return (
                  <li
                      key={entries.length + '' + idx}
                      className={'contents'}
                  >
                      <ul
                          className={cn(
                              'flex flex-col text-nowrap',
                              breakpoint <= Breakpoint.xxs ? '[&>li]:x-[gap-y-0,py-s,border-b-s]' : 'gap-y-xxs',
                              { ['flex-1']: Breakpoint.xxs < breakpoint && breakpoint <= Breakpoint.sm },
                          )}
                      >
                          {LinksLi}
                      </ul>
                  </li>
              );
          });

    if (breakpoint <= Breakpoint.xxs) {
        const BackBtn: ReactElement = (
            <li
                key={'back-' + DropdownLi?.length}
                className={'contents'}
            >
                <Button
                    onClick={() => setDropdownColumns(null)}
                    icon={'chevron'}
                    className={'!justify-start border-b-s p-s font-bold'}
                    classNameIcon={'[&_*]:!size-[0.5625rem] rotate-90'}
                >
                    <span>Back</span>
                </Button>
            </li>
        );
        DropdownLi?.unshift(BackBtn);
    }

    const SubNavItems: ReactElement[] | null =
        breakpoint <= Breakpoint.xxs || !subNavLinks
            ? null
            : subNavLinks.map((link, idx) => {
                  const mappedLink = MAPPED_SUB_NAV_ROUTES[link];
                  const mapRoute =
                      mappedLink &&
                      (checkSubRoute(route, link) ||
                          ALWAYS_MAPPED_ROUTES.some((check) => getRouteLeave(link).includes(check)));
                  const isActiveCN = checkSubRoute(route, link, true);
                  const dropdownLinks = DROPDOWN_SUB_NAV_ROUTES[link];

                  return (
                      <li
                          key={link + idx}
                          tabIndex={(headerLinkCount ?? 0) + idx}
                          className={cn('group', stylesLayout.navLink, {
                              [cn(stylesLayout.activeNavLink, 'before:bg-blue')]:
                                  isActiveCN && breakpoint > Breakpoint.xxs,
                          })}
                      >
                          {dropdownLinks ? (
                              <Select
                                  value={link}
                                  options={dropdownLinks}
                                  //eslint-disable-next-line
                                        onChangeCustom={(value) => {
                                      // TODO handle links
                                  }}
                                  classNameWrapper={'!static left-0 size-full'}
                                  className={'!w-full !border-0 !bg-transparent'}
                                  classNameUl={'top-[calc(100%+2px)] py-4xs !rounded-none bg-black-l0'}
                                  classNameOption={cn(
                                      styles.clickable,
                                      '!bg-black-l0 !border-0 text-section-xxs !py-5xs',
                                  )}
                                  classNameChevron={'[&_*]:w-[0.5625rem]'}
                              />
                          ) : (
                              <PageLink href={link}>{getIdName(mapRoute ? mappedLink : link)}</PageLink>
                          )}
                      </li>
                  );
              });

    return (
        <>
            {!DropdownLi ? null : (
                <div
                    ref={subNavRef}
                    className={cn(
                        styles.section,
                        'absolute left-0 z-[1000] bg-black-l0',
                        { ['w-[79%] min-w-0']: breakpoint <= Breakpoint.sm },
                        breakpoint <= Breakpoint.xxs
                            ? cn(
                                  `top-[calc(1px+var(--h-heading))] h-[calc(100dvh-var(--h-heading))] max-w-[14.5625rem] gap-x-l`,
                                  `overflow-y-scroll bg-gray-d0`,
                              )
                            : 'h-fit py-3xl',
                    )}
                >
                    <ul
                        className={cn(
                            styles.content,
                            'flex',
                            breakpoint <= Breakpoint.xxs
                                ? 'flex-col gap-y-s !px-0 text-section-xxs'
                                : 'flex-wrap justify-between gap-xs',
                        )}
                    >
                        {DropdownLi}
                    </ul>
                </div>
            )}
            {!subNavLinks?.length || breakpoint <= Breakpoint.xxs ? null : (
                <div className={'border-b-s border-gray'}>
                    <ul
                        className={cn(
                            styles.content,
                            `flex text-nowrap !pl-s text-section-xxs`,
                            subNavLinks?.length ? 'h-sub-heading ' + styles.slideIn : styles.slideOut,
                            { ['!pl-xs']: breakpoint <= Breakpoint.sm },
                        )}
                    >
                        {SubNavItems}
                    </ul>
                </div>
            )}
        </>
    );
};
const SubNav = forwardRef(SubNavElement);
export { SubNav };
