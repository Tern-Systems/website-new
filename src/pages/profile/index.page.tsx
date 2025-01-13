import React, {Dispatch, FC, ReactElement, SetStateAction, useEffect, useState,} from "react";
import cn from "classnames";

import {EditableProps} from "@/app/ui/form/Editable";

import {COUNTRY, INDUSTRY, JOB_FUNCTION, LANGUAGE, SALUTATION, STATE_PROVINCE, SUB_INDUSTRY,} from "@/app/static";

import {AuthService} from "@/app/services";

import {formatDate} from "@/app/utils/data";
import {useBreakpointCheck, useLoginCheck, useSaveOnLeave} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {Collapsible} from "@/app/ui/misc";
import {Button, Editable, Input} from "@/app/ui/form";
import {DeleteAccountModal} from "./DeleteAccountModal";

import {AuthenticationCode, MessageModal} from "@/app/ui/modals";

import styles from "./Profile.module.css";


const SECTIONS: string[] = [
    "Account Credentials",
    "Contact Information",
    "Company or Organization",
    "Addresses",
    "Third-Party Applications",
    "Offboarding",
];

const DATA_STORAGE: string[] = ["Google Drive", "Dropbox", "SharePoint"];

const SOCIAL_MEDIA: string[] = [
    "Discord",
    "WhatsApp",
    "Instagram",
    "Stack Overflow",
    "GitHub",
    "X",
    "Reddit",
    "LinkedIn",
    "Facebook",
];

const getSimpleToggleProps = (
    setEditState?: Dispatch<SetStateAction<boolean>>,
    isEditState?: boolean
): Pick<
    EditableProps,
    | "classNameWrapper"
    | "classNameToggle"
    | "setParentEditState"
    | "isToggleBlocked"
> => ({
    classNameWrapper: "w-[min(100%,21.625rem)]",
    classNameToggle: "col-start-3",
    setParentEditState: setEditState,
    isToggleBlocked: isEditState,
});

const ProfilePage: FC = () => {
    const modalCtx = useModal();
    const {userData, token} = useUser();
    const isLoggedIn = useLoginCheck();
    const isSmScreen = useBreakpointCheck() === 'sm';
    useSaveOnLeave();

    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [isEditState, setEditState] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            SECTIONS.forEach((section, index) => {
                const elem = document.getElementById(
                    section.toLowerCase().split(" ").join("")
                );
                if (
                    elem &&
                    elem.getBoundingClientRect().top <
                    (elem.offsetTop / window.innerHeight) * (isSmScreen ? 28 : 350)
                )
                    setActiveSectionIdx(index);
            });
        };
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, [isSmScreen]);

    if (!userData || !isLoggedIn) return null;

    // Elements
    const Primary = (
        <span
            className={`col-start-2 bg-control-white-d0 rounded-smallest1 w-[4.15rem] py-[0.1rem] block
                          text-gray text-center text-note font-oxygen mt-[0.62rem]`}
        >
      Primary
    </span>
    );

    const SectionsNav: ReactElement[] = SECTIONS.map((link, idx) => (
        <li
            key={link + idx}
            className={cn(
                `pl-[--2dr] leading-[200%] cursor-pointer
                sm:landscape:pl-[--1dr]`,
                {[`before:bg-control-blue ${styles.line}`]: idx === activeSectionIdx}
            )}
        >
      <span
          onClick={() => {
              setActiveSectionIdx(idx);
              const id = "#" + link.toLowerCase().split(" ").join("");
              document
                  .querySelector(id)
                  ?.scrollIntoView({behavior: "smooth", inline: "center"});
          }}
      >
        {link}
      </span>
        </li>
    ));

    // Third-Party Apps
    const renderConnectedApps = (
        apps: string[],
        userApps: { name: string; link: string }[]
    ): ReactElement[] => {
        return apps.map((app, idx) => {
            const userApp = userApps.find((userApp) => userApp.name === app);
            const isFound = userApp !== undefined;
            const text: string = `${isFound ? `Connected` : `Connect`}`;

            return (
                <span key={text + idx} className={"contents"}>
          {isFound ? (
              <a
                  href={userApp?.link}
                  className={`capitalize col-start-2 ${styles.midCol + " " + styles.ellipsis
                  }`}
                  target={"_blank"}
              >
                  {userApp?.name}
              </a>
          ) : (
              <span
                  className={`capitalize col-start-2 ${styles.midCol + " " + styles.ellipsis
                  }`}
              >
              {app}
            </span>
          )}
                    <Button
                        icon={isFound ? "mark-square" : "plus-square"}
                        hovered={{
                            icon: isFound ? "close-square" : null,
                            text: isFound ? "Disconnect" : "",
                        }}
                        className={`col-start-3 flex-row-reverse place-self-end ${styles.ellipsis
                        } ${styles.connectBtn} ${isFound && styles.connected} ${isFound ? styles.disconnect : styles.connect
                        }`}
                        onClick={() => {
                            // TODO
                        }}
                    >
            {isSmScreen ? "" : text}
          </Button>
        </span>
            );
        });
    };

    // Contact
    const Phones = Object.entries(userData.phones).map(([type, phone], idx) =>
        phone ? (
            <span key={type + idx}>
        <span className={"text-small block mb-[0.62rem] mt-[1rem] capitalize"}>
          {type}
        </span>
        <span>{phone.number + ("ext" in phone ? " - " + phone.ext : "")}</span>
                {phone.isPrimary ? Primary : null}
      </span>
        ) : null
    );

    // Addresses
    const Addresses = Object.entries(userData.address)
        .filter((address) => address[1])
        .map(([type, address], idx) => {
            const state = address ? STATE_PROVINCE?.[address.country]?.[address.state] : '';
            const addressInfo: ReactElement =
                address && address.state && address.country ? (
                    <>
            <span className={"w-[14.69rem] flex flex-col"}>
              <span>{address.line1}</span>
              <span>{address.line2}</span>
              <span>
                {address.city} {state} {address.zip}
              </span>
              <span>{COUNTRY[address.country]}</span>
            </span>
                        {address.isPrimary ? Primary : null}
                    </>
                ) : (
                    <span>--</span>
                );

            return (
                <span key={type + idx} className={"col-start-2"}>
          <span
              className={"text-small mt-[0.76rem] mb-[0.2rem] capitalize block"}
          >
            {type.slice(0, "Address".length + 1)} Address
          </span>
                    {addressInfo}
        </span>
            );
        });

    // Company
    // @ts-expect-error wrong sub-industry key
    const subIndustry = SUB_INDUSTRY?.[userData.company.industry]?.[userData.company.subIndustry];

    return (
        <div className={"flex mt-[3.88rem] sm:mt-0"}>
            <aside
                className={`sticky self-start text-left text-nowrap
                            top-[min(25.3dvw,5.94rem)] ml-[min(5.3dvw,15rem)]
                            sm:portrait:hidden
                            sm:landscape:x-[top-0,ml-[--1dr],mr-[--2dr]]`}
            >
                <div
                    className={`font-bold
                                mb-[--1hdrs] text-header
                                sm:landscape:text-content`}
                >
                    <span>Sections</span>
                </div>
                <ul
                    className={`flex flex-col ${styles.line} before:bg-control-white
                                text-content-small 
                                sm:landscape:text-small`}
                >
                    {SectionsNav}
                </ul>
            </aside>
            <div
                className={`flex-grow flex flex-col gap-y-[--s-dl-smallest]
                            ml-[10rem]
                            sm:ml-0
                            sm:portrait:x-[overflow-y-scroll,max-h-[70dvh]]`}
            >
                <Collapsible
                    title={SECTIONS[0]}
                    icon={"key"}
                    className={styles.collapsible}
                >
          <span className={styles.leftCol + " " + styles.ellipsis}>
            Profile Picture
          </span>
                    <Input
                        type={"file"}
                        classNameWrapper={`bg-control-white text-gray px-[min(3dvw,1rem)] w-fit font-bold rounded-full
                                            h-[--h-control-dl] text-small box-content`}
                    >
                        Upload Media
                    </Input>

                    <span className={styles.leftCol + " " + styles.ellipsis}>TernID</span>
                    <Editable
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInput + " " + styles.singleInputBase
                            } ${styles.common}`,
                            title: "Update your TernID",
                            value: {value: userData.email},
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
            <span className={styles.midCol + " " + styles.ellipsis}>
              {userData.email}
            </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Password
          </span>
                    <Editable
                        type={"password"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        classNameWrapper={
                            getSimpleToggleProps(setEditState, isEditState).classNameWrapper +
                            " gap-y-[--1dr]"
                        }
                        data={{
                            className: `${styles.singleInput + " " + styles.singleInputBase
                            } ${styles.common}`,
                            title: "Update password",
                            value: null,
                            onSave: async (formData) => {
                                if (!("passwordConfirm" in formData) || !userData) return;

                                if (formData.passwordConfirm !== formData.newPassword)
                                    throw `Passwords don't match`;

                                try {
                                    await AuthService.postChangePassword(
                                        formData.currentPassword,
                                        formData.newPassword,
                                        formData.passwordConfirm,
                                        userData?.email
                                    );
                                    modalCtx.openModal(
                                        <MessageModal>Your Password has been changed successfully!</MessageModal>
                                    );
                                } catch (error: unknown) {
                                    if (typeof error === "string")
                                        modalCtx.openModal(<MessageModal>{error}</MessageModal>);
                                }
                            },
                        }}
                    >
            <span className={styles.midCol + " " + styles.ellipsis}>
              <span className={"block"}>•••••••••••••••</span>
              <span className={"text-small"}>
                Last updated&nbsp;
                  {userData.passwordUpdateDate
                      ? formatDate(new Date(userData.passwordUpdateDate), "short")
                      : "--"}
              </span>
            </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Security
          </span>
                    <Editable
                        type={"2FA"}
                        {...getSimpleToggleProps()}
                        classNameWrapper={getSimpleToggleProps().classNameWrapper + " gap-y-[min(3.2dvw,0.94rem)]"}
                        data={{
                            value: {
                                isEmailAdded: !!userData.state2FA.email,
                                isPhoneAdded: !!userData.state2FA.phone,
                                suggestedPhone: userData.phones.personal?.number ?? null,
                            },
                            onSave: async (formData) => {
                                if (
                                    !formData
                                    || !("value" in formData)
                                    || typeof formData.value !== "string"
                                    || !token
                                    || !userData
                                ) {
                                    return;
                                }
                                const phone = formData.value.trim();
                                const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format validation

                                if (!phoneRegex.test(phone))
                                    throw `Invalid phone number format. Please enter a valid number.`;


                                const numericPhone = phone.startsWith("+")
                                    ? phone.slice(1)
                                    : phone;
                                if (numericPhone.length < 10 || numericPhone.length > 15)
                                    throw `Phone number must contain 10 digits long.`;

                                try {
                                    modalCtx.openModal(
                                        <AuthenticationCode
                                            is2FA
                                            isPhoneEnabling
                                            token={token}
                                            phone={phone}
                                            email={userData?.email || ""}
                                        />
                                    );
                                } catch (error: unknown) {
                                    if (typeof error === 'string')
                                        modalCtx.openModal(<MessageModal>{error}</MessageModal>);
                                }
                            },
                            onSwitch: async (state: boolean) => {
                                if (token && userData?.state2FA?.phone) {
                                    modalCtx.openModal(
                                        <AuthenticationCode
                                            is2FA
                                            isDisabling={state}
                                            token={token}
                                            phone={userData?.state2FA?.phone}
                                            email={userData.email}
                                        />
                                    );
                                }
                            }
                        }}
                    >
            <span className={styles.midCol + " " + styles.ellipsis}>
              Enable / disable your two-factor authentication
            </span>
                    </Editable>
                </Collapsible>
                <Collapsible
                    title={SECTIONS[1]}
                    icon={"book"}
                    className={styles.collapsible}
                >
                    <span className={styles.leftCol + " " + styles.ellipsis}>Name</span>
                    <Editable
                        type={"name"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInputBase} ${styles.common} ${styles.roundedWFull}`,
                            value: userData.name,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
            <span
                className={`capitalize ${styles.midCol + " " + styles.ellipsis}`}
            >
              {userData.name.salutation
                  ? SALUTATION[userData.name.salutation]
                  : "--"}
                &nbsp;
                {userData.name.firstname} {userData.name.initial} {userData.name.lastname}
            </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Display Name
          </span>
                    {userData.username ? (
                        <Editable
                            {...getSimpleToggleProps(setEditState, isEditState)}
                            data={{
                                className: `${styles.singleInput + " " + styles.singleInputBase
                                } ${styles.common}`,
                                title: "Update your Display Name",
                                value: {value: userData.username},
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                onSave: async (formData) => {
                                }, //TODO
                            }}
                            setParentEditState={setEditState}
                            isToggleBlocked={isEditState}
                        >
                            <span>{userData.username}</span>
                        </Editable>
                    ) : (
                        <>
                            <span>--</span>
                            <span>--</span>
                        </>
                    )}

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Email Address
          </span>
                    <Editable
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInput + " " + styles.singleInputBase
                            } ${styles.common}`,
                            title: "Update your Email Address",
                            value: {
                                value: userData.email,
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                verify: async (formData) => {
                                }, //TODO
                            },
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
                        <span>{userData.email}</span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Phone Number
          </span>
                    <Editable
                        type={"phone"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInput + " " + styles.singleInputBase
                            } ${styles.common}`,
                            value: userData.phones,
                            onSave: async (formData) => {
                                if (!("business" in formData)) return;
                                Object.entries(formData).forEach(([type, number]) => {
                                    if (number.number !== "" && number.number.length < 10)
                                        throw type + ` number must contain 10 digits`;
                                });
                            }, //TODO
                        }}
                    >
                        <span>{Phones}</span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Country or Region {isSmScreen ? "" : "of Residence"}
          </span>
                    <Editable
                        type={"select"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInputBase} ${styles.common}`,
                            title: "Country / Region",
                            value: {value: "US"},
                            options: COUNTRY,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
            <span>
              {userData.address.personalAddress?.country
                  ? COUNTRY[userData.address.personalAddress?.country]
                  : "--"}
            </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            {isSmScreen ? "" : "Preferred"} Language
          </span>
                    <Editable
                        type={"select"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInputBase} ${styles.common}`,
                            title: "Language",
                            value: {value: "EN"},
                            options: LANGUAGE,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
                        <span>{LANGUAGE[userData.preferredLanguage] ?? "--"}</span>
                    </Editable>
                </Collapsible>
                <Collapsible
                    title={SECTIONS[2]}
                    icon={"building"}
                    className={styles.collapsible}
                >
          <span className={styles.leftCol + " " + styles.ellipsis}>
            Organization{isSmScreen ? "" : "al Information"}
          </span>
                    <Editable
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInput + " " + styles.singleInputBase
                            } ${styles.common}`,
                            value: {value: userData.company?.name ?? "-"},
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
                        <span>{userData.company?.name ?? "--"}</span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
            Career {isSmScreen ? "" : "Information"}
          </span>
                    <Editable
                        type={"company"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInput + " " + styles.singleInputBase
                            } px-[0.76rem] border-small ${styles.roundedWFull}`,
                            value: userData.company,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
                        {userData.company ? (
                            <>
                <span className={"col-start-2 row-start-2"}>
                  <span className={"col-start-2 text-small block mb-[0.2rem]"}>
                    Job Title
                  </span>
                  <span>{userData.company.jobTitle}</span>
                </span>
                                <span className={"mt-[1.25rem]"}>
                  <span className={"col-start-2 text-small block mb-[0.2rem]"}>
                    Job Function
                  </span>
                  <span>{JOB_FUNCTION[userData.company.jobFunction]}</span>
                </span>
                                <span className={"mt-[1.25rem]"}>
                  <span className={"col-start-2 text-small block mb-[0.2rem]"}>
                    Industry
                  </span>
                  <span>{INDUSTRY[userData.company.industry]}</span>
                </span>
                                <span className={"mt-[1.25rem]"}>
                  <span className={"col-start-2 text-small block mb-[0.2rem]"}>
                    Sub-Industry
                  </span>
                  <span>{subIndustry}</span>
                </span>
                            </>
                        ) : (
                            <>--</>
                        )}
                    </Editable>
                </Collapsible>
                <Collapsible
                    title={SECTIONS[3]}
                    icon={"geo"}
                    className={"[&]:items-start"}
                >
          <span className={styles.leftCol + " " + styles.ellipsis}>
            Address {isSmScreen ? "" : "Information"}
          </span>
                    <Editable
                        type={"address"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInputBase} ${styles.common} ${styles.roundedWFull}`,
                            value: userData.address,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            }, //TODO
                        }}
                    >
                        <span>{Addresses}</span>
                    </Editable>
                </Collapsible>
                <Collapsible title={SECTIONS[4]} icon={"blocks"}>
                    <span className={styles.leftCol + " " + styles.ellipsis}>Domain</span>
                    {userData.personalDomain ? (
                        <>
                            <a href={userData.personalDomain.link} target={"_blank"}>
                                {userData.personalDomain.link}
                            </a>
                            <Button
                                disabled={userData.personalDomain.isVerified}
                                icon={
                                    userData.personalDomain.isVerified
                                        ? "mark-flower"
                                        : "plus-flower"
                                }
                                className={"col-start-3 flex-row-reverse place-self-end"}
                            >
                                {isSmScreen
                                    ? ""
                                    : `Verif${userData.personalDomain.isVerified ? "ied" : "y"}`}
                            </Button>
                        </>
                    ) : (
                        <>
                            <span>--</span>
                            <span>--</span>
                        </>
                    )}
                    <span
                        className={`mt-[min(5.3dvw,var(--p-content))] ${
                            styles.leftCol + " " + styles.ellipsis
                        }`}
                    >
            Data Storage
          </span>
                    <span
                        className={`col-start-2 text-small self-end ${styles.ellipsis}`}
                    >
            Applications
          </span>
                    {renderConnectedApps(DATA_STORAGE, userData.connectedApps.data)}

                    <span
                        className={`mt-[min(5.3dvw,var(--p-content))] ${
                            styles.leftCol + " " + styles.ellipsis
                        }`}
                    >
            Social Media
          </span>
                    <span className={"col-start-2 text-small self-end"}>
            Applications
          </span>
                    {renderConnectedApps(SOCIAL_MEDIA, userData.connectedApps.social)}
                </Collapsible>
                <Collapsible title={SECTIONS[5]}>
          <span className={styles.leftCol + " " + styles.ellipsis}>
            {isSmScreen ? "" : "Account"} Offboarding
          </span>
                    <span className={styles.midCol + " " + styles.ellipsis}>
            Delete your account and data
          </span>
                    <Button
                        icon={"delete-square"}
                        className={"flex-row-reverse [&]:place-content-end"}
                        onClick={() =>
                            modalCtx.openModal(<DeleteAccountModal userData={userData}/>, {
                                darkenBg: true,
                            })
                        }
                    >
                        {isSmScreen ? "" : "Delete"}
                    </Button>
                </Collapsible>
            </div>
        </div>
    );
};

export default ProfilePage;
