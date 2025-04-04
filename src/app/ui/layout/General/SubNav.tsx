'use client';

import { Dispatch, ForwardedRef, forwardRef, ReactElement, SetStateAction, useImperativeHandle, useRef } from 'react';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { NavDropdown } from '@/app/types/layout';
import { ALWAYS_MAPPED_ROUTES, DROPDOWN_SUB_NAV_ROUTES, MAPPED_SUB_NAV_ROUTES, NavLink, Route } from '@/app/static';
import { Breakpoint } from '@/app/static';

import { checkSubRoute, getIdName, getRouteLeave } from '@/app/utils';
import { useBreakpointCheck, useNavigate, useOuterClickClose } from '@/app/hooks';
import { useLayout, useModal } from '@/app/hooks';

import { Button, Select } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';
import stylesLayout from './Layout.module.css';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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

    const xxs = breakpoint <= Breakpoint.xxs;

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
                              'first-letter:uppercase first-of-type:x-[mb-5xs,text-24]',
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
                              iconClassName={cn('ml-4xs  !size-xs  xxs:h-6xs')}
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

    if (xxs) {
        const BackBtn: ReactElement = (
            <li
                key={'back-' + DropdownLi?.length}
                className={'contents'}
            >
                <Button
                    onClick={() => setDropdownColumns(null)}
                    icon={faChevronLeft}
                    className={'!justify-start border-b-s p-s font-bold'}
                    classNameIcon={'!size-8xs !min-w-fit'}
                >
                    <span>Back</span>
                </Button>
            </li>
        );
        DropdownLi?.unshift(BackBtn);
    }

    const SubNavItems: ReactElement[] | null =
        xxs || !subNavLinks
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
                                  classNameOption={cn(styles.clickable, '!bg-black-l0 !border-0 text-12 !py-5xs')}
                                  classNameChevron={'w-8xs'}
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
                        'absolute left-0 z-[1000] h-fit bg-black-l0',
                        'py-4xl',
                        'sm:x-[min-w-0,w-[79%]] xxs:h-[calc(100vh-var(--h-heading))] xxs:overflow-y-scroll',
                        `xxs:top-[calc(1px+var(--h-heading))]`,
                        `xxs:x-[gap-x-l,w-fit,max-w-fit,p-0,bg-gray-d1]`,
                    )}
                >
                    <ul
                        className={cn(
                            styles.content,
                            'flex min-h-fit',
                            'flex-wrap justify-between gap-xs',
                            'xxs:x-[flex-col,gap-y-s,!px-0,text-12]',
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
                            `flex text-nowrap !pl-s text-12`,
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

const SubNav = forwardRef(SubNavElement);

SubNav.displayName = 'SubNav';

export { SubNav };
