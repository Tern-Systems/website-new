import React, {
    Dispatch,
    ForwardedRef,
    forwardRef,
    ReactElement,
    SetStateAction,
    useImperativeHandle,
    useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { NavDropdown } from '@/app/types/layout';
import { ALWAYS_MAPPED_ROUTES, DROPDOWN_SUB_NAV_ROUTES, MAPPED_SUB_NAV_ROUTES, NavLink, Route } from '@/app/static';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { checkSubRoute, getIdName, getRouteLeave } from '@/app/utils';
import { useBreakpointCheck, useNavigate, useOuterClickClose } from '@/app/hooks';
import { useLayout, useModal } from '@/app/context';

import { Button, Select } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';
import stylesLayout from './Layout.module.css';

import { faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';

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

    useOuterClickClose(subNavRef, !!subNavRef, () => setDropdownColumns(null));

    const subNavLinks = layoutCtx.navLinks[NavLink.SubNav];

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
                              'first-letter:uppercase first-of-type:x-[mb-5xs,text-documentation]',
                              'xxs:px-s xxs:first-of-type:font-bold',
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
                              iconClassName={cn('ml-4xs  size-[1.6rem]  xxs:[&_*]:size-[0.8rem]')}
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
                              'flex flex-col gap-y-xxs text-nowrap',
                              'xxs:x-[flex-1,gap-y-0] xxs:[&>li]:x-[py-s,border-b-s]',
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
                    icon={faChevronDown}
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
                  const activeCN = checkSubRoute(route, link, true);
                  const dropdownLinks = DROPDOWN_SUB_NAV_ROUTES[link];

                  return (
                      <li
                          key={link + idx}
                          tabIndex={(headerLinkCount ?? 0) + idx}
                          className={cn('group', stylesLayout.navLink, {
                              [cn(stylesLayout.activeNavLink, 'xxs:hidden')]: activeCN,
                          })}
                      >
                          {dropdownLinks ? (
                              <Select
                                  value={link}
                                  options={dropdownLinks}
                                  onChangeCustom={(_: string) => {
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
            <Button
                onClick={() => setNavExpanded((prev) => !prev)}
                className='mdmd:hidden md:hidden lg:hidden flex items-center justify-center p-2 absolute top-3 left-2 z-[1100] bg-gray-800 rounded'
            >
                <FontAwesomeIcon
                    icon={faBars}
                    className='w-6 h-6 text-white'
                />
            </Button>
            {!DropdownLi ? null : (
                <div
                    ref={subNavRef}
                    className={cn(
                        styles.section,
                        'absolute left-0 z-[1000] h-fit bg-black-l0',
                        'py-4xl',
                        'sm:x-[min-w-0,w-[79%],overflow-y-scroll] xxs:h-[calc(100dvh-var(--h-heading))]',
                        `xxs:top-[calc(1px+var(--h-heading))]`,
                        `xxs:x-[gap-x-l,max-w-[14.5625rem],p-0,bg-gray-d1]`,
                    )}
                >
                    <ul
                        className={cn(
                            styles.content,
                            'flex',
                            'flex-wrap justify-between gap-xs',
                            'xxs:x-[flex-col,gap-y-s,!px-0,text-section-xxs]',
                        )}
                    >
                        {DropdownLi}
                    </ul>
                </div>
            )}
            {!SubNavItems?.length ? null : (
                <div className={'border-b-s border-gray'}>
                    <ul
                        className={cn(
                            styles.content,
                            `flex text-nowrap !pl-s text-section-xxs`,
                            'sm:!pl-xs',
                            SubNavItems?.length ? 'h-sub-heading ' + styles.slideIn : styles.slideOut,
                        )}
                    >
                        {SubNavItems}
                    </ul>
                </div>
            )}
        </>
    );
};

SubNavElement.displayName = SubNavElement.name;

const SubNav = forwardRef(SubNavElement);
SubNav.displayName = SubNav.name;

export { SubNav };
