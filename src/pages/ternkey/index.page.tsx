import React, { FC } from "react";
import Image from "next/image";
import cn from "classnames";

import { MISC_LINKS } from "@/app/static";

import styles from "./style.module.css";

import { useUser } from "@/app/context";

import { Button } from "@/app/ui/form";

import SVG_TERNKEY from "/public/images/ternkey-logo-svg.svg";
import PNG_SAMPLE from "/public/images/sample.png";
import PNG_TURNING_HEADS from "/public/images/turning-heads.png";
import PNG_DISCOVERY from "/public/images/discovery.png";
import SVG_SHARE from "/public/images/icons/share.svg";
import SVG_PROFILE from "/public/images/icons/profile.svg";
import SVG_HEART from "/public/images/icons/heart.svg";
import SVG_SAVE from "/public/images/icons/save.svg";
import SVG_SEARCH from "/public/images/icons/search.svg";
import SVG_STAR from "/public/images/icons/star-alt.svg";

const TernKeyPage: FC = () => {
  const userCtx = useUser();
  const env: string | undefined =
    process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV ?? "development";
  const website: string | undefined =
    env === "development" ? "http://localhost:3001" : MISC_LINKS.TernKey;
  return (
    <div className={"overflow-hidden"}>
      <section
        className={cn(
          styles.abstractBackground,
          styles.pageSection,
          "flex-row gap-x-[--p-content-l]",
          "mx-auto py-[8rem]"
        )}
      >
        <span className={"flex flex-col justify-between"}>
          <span
            className={
              "mr-auto text-[min(9.6dvw,3.75rem)] font-oxygen font-bold"
            }
          >
            TernKey
          </span>
          <a
            href={
              userCtx.token
                ? `${website}/?website_login=${encodeURIComponent(
                    userCtx.token || ""
                  )}`
                : website
            }
            target={"_blank"}
            className={
              "p-[--p-content] rounded-small sm:landscape:x-[row-span-2,my-0] mt-[3.69rem]"
            }
          >
            <Image
              src={SVG_TERNKEY}
              alt={"insignia"}
              className={"w-auto h-[20dvw] max-h-[min(25dvw,40rem)]"}
            />
          </a>
          <span>
            <div
              className={
                "text-[2.5rem] my-[2.76rem] md:text-[2rem] sm:text-[2rem]"
              }
            >
              Unlocking the Potential of ternary programming
            </div>
            <div className="flex flex-row gap-[2.19rem]">
              <Button
                className={
                  "text-center bg-[#178AB7] w-[11rem] h-[2.375rem] text-[1.125rem] p-auto sm:w-[9.375rem]"
                }
              >
                Try it Free
              </Button>
              <Button
                className={
                  "text-center text-[#178AB7] bg-[#000] w-[11rem] h-[2.375rem] text-[1.125rem] p-auto sm:w-[9.375rem]"
                }
              >
                Watch Demo
              </Button>
            </div>
          </span>
        </span>
      </section>
      <section className={cn(styles.pageSection, "mx-auto py-[8rem]")}>
        <span
          className={
            "text-[4rem] sm:text-[1.5rem] md:text-[2.5rem] text-center max-w-[71.125rem]"
          }
        >
          TernKey is the World&apos;s First Ternary Software Stack
        </span>
        <p
          className={
            "text-[2.5rem] max-w-[71.125rem] mt-[6rem] md:text-[1.875rem] sm:text-[1rem]"
          }
        >
          We are driving the evolution from binary to ternary computing. By
          harnessing the superior data density and efficiency of ternary logic,
          TernKey provides developers with an innovative platform to redefine
          programming paradigms and unlock new computational possibilities.
        </p>
        <Image
          src={PNG_SAMPLE}
          alt={"sample"}
          className={cn(styles.fullSizeMedia, "my-[7.56rem]")}
        />
        <p
          className={
            "text-[2.5rem] max-w-[71.125rem] mb-[4.75rem] md:text-[1.875rem] sm:text-[1rem]"
          }
        >
          This specialized sandbox environment is designed to support languages
          engineered specifically for ternary logic computation. At its core is
          G, a sophisticated high-level language structurally reminiscent of C,
          enabling a seamless adaptation for developers familiar with
          conventional programming.
        </p>
        <Button className="mt-[2.69rem] text-center text-[#178AB7] bg-[#000] w-[11rem] h-[2.375rem] text-[1.125rem] p-auto sm:text-[1rem] sm:w-[7.25rem] sm:h-[1.875rem]">
          <span className="text-center">G Handbook</span>
        </Button>
      </section>
      <section className={cn(styles.pageSection, "mx-auto py-[8rem]")}>
        {/* <YouTubeEmbed videoid="uMb2KI6PHPQ" width={1138} height={686} /> */}

        <iframe
          src={MISC_LINKS.TernKeyDemoEmbed}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className={cn(styles.iframe)}
        ></iframe>
      </section>
      <section
        className={cn(
          styles.pageSection,
          styles.hideWhenSmall,
          "mx-auto py-[8rem] flex flex-row gap-[5rem] md:gap-[2.13rem]"
        )}
      >
        <Image
          src={PNG_TURNING_HEADS}
          alt={"A Woman looking at a computer screen"}
          className="max-w-[38.6875rem] h-auto md:max-w-[22.0625rem] md:max-h-[21.875rem] sm:max-w-[20.9375rem] sm:max-h-[20.67981rem]"
        />
        <div className="flex flex-col gap-[3rem] md:gap-[2rem]">
          <span className="text-[4rem] sm:text-[1.5rem] md:text-[2.5rem] text-bold">
            Turning Heads
          </span>
          <p className="text-[2.5rem] md:text-[1.75rem] sm:text-[1rem]">
            Users can write code using the TernKey software and run that code
            within our online emulator, enabling software developers from any
            experience level to explore this untapped scape of programming.
          </p>
        </div>
      </section>
      <section
        className={cn(
          styles.pageSection,
          styles.showWhenSmall,
          "mx-auto py-[8rem] flex flex-col gap-[5rem] md:gap-[2.13rem]"
        )}
      >
        <span className="text-[4rem] sm:text-[1.5rem] md:text-[2.5rem] text-bold">
          Turning Heads
        </span>
        <Image
          src={PNG_TURNING_HEADS}
          alt={"A Woman looking at a computer screen"}
          className="max-w-[38.6875rem] h-auto md:max-w-[22.0625rem] md:max-h-[21.875rem] sm:max-w-[20.9375rem] sm:max-h-[20.67981rem] my-[1.2rem]"
        />
        <p className="text-[2.5rem] md:text-[1.75rem] sm:text-[1rem]">
          Users can write code using the TernKey software and run that code
          within our online emulator, enabling software developers from any
          experience level to explore this untapped scape of programming.
        </p>
      </section>
      <section
        className={cn(
          styles.pageSection,
          styles.hideWhenSmall,
          "mx-auto py-[8rem]"
        )}
      >
        <span className="text-[2.5rem] sm:text-[1.5rem] md:text-[2.25rem] text-center mx-auto">
          Learning Together
        </span>
        <div className={"flex gap-[21.91rem] mt-[5.31rem]"}>
          <div className="flex flex-col">
            <span className="text-[2rem]">Fostering Collaboration</span>
            <span className="text-[1.25rem]">
              TernKey enhances developer collaboration through Explore Keys, a
              comprehensive database of TernKey programs, known as Keys. This
              platform connects users with software developers globally,
              fostering an open and dynamic environment for learning, sharing,
              and growth.
            </span>
            <Button className="mt-[2.69rem] text-center bg-[#178AB7] w-[11rem] h-[2.375rem] text-[1.125rem] p-auto">
              <span className="text-center">Explore Keys</span>
            </Button>
          </div>
          <Image
            src={PNG_DISCOVERY}
            alt={"Discovery"}
            className="max-w-[13.1rem] max-h-[13.5rem] md:max-w-[11.516rem] md:max-h-[11.875rem] sm:max-w-[6.061rem] sm:max-h-[6.25rem]"
          />
        </div>
      </section>
      <section
        className={cn(
          styles.pageSection,
          styles.showWhenSmall,
          "mx-auto py-[8rem]"
        )}
      >
        <div className={"flex flex-col mt-[5.31rem] text-center"}>
          <span className="text-[2.5rem] sm:text-[1.5rem] md:text-[2.25rem] text-center mx-auto mb-[3rem]">
            Learning Together
          </span>
          <Image
            src={PNG_DISCOVERY}
            alt={"Discovery"}
            className="max-w-[13.1rem] max-h-[13.5rem] md:max-w-[11.516rem] md:max-h-[11.875rem] sm:max-w-[6.061rem] sm:max-h-[6.25rem] mb-[2.12rem] place-self-center"
          />
          <span className="text-[2rem] sm:text-[1.5rem]">
            Fostering Collaboration
          </span>
          <span className="text-[1.25rem] sm:text-[1rem]">
            TernKey enhances developer collaboration through Explore Keys, a
            comprehensive database of TernKey programs, known as Keys. This
            platform connects users with software developers globally, fostering
            an open and dynamic environment for learning, sharing, and growth.
          </span>
          <Button className="mt-[2.69rem] text-center bg-[#178AB7] w-[7.625rem] h-[1.875rem] text-[1.125rem] p-auto place-self-center">
            <span className="text-center">Explore Keys</span>
          </Button>
        </div>
      </section>
      <section className={cn(styles.pageSection, "mx-auto py-[8rem]")}>
        <span className={"text-[4rem] sm:text-[1.5rem] md:text-[2.5rem]"}>
          Features
        </span>
        <div className={cn(styles.grid)}>
          <div
            className={
              "flex flex-col text-[1.25] md:text-[1rem] sm:text-[0.75rem]"
            }
          >
            <Image
              src={SVG_PROFILE}
              alt={"Profile"}
              className={
                "w-[6.25rem] h-[6.25rem] my-[1.56rem] md:w-[4.375rem] md:h-[4.375rem] md:my-[1.56rem] sm:w-[2.5rem] sm:h-[2.5rem] sm:my-[1.25rem] sm:place-self-center "
              }
            />
            <span className="font-bold">Universal Login</span>
            <span>
              Use the same login for the website for all of our products and
              services including TernKey. One account and you&apos;re free to
              experiment.
            </span>
          </div>
          <div
            className={
              "flex flex-col text-[1.25] md:text-[1rem] sm:text-[0.75rem]"
            }
          >
            <Image
              src={SVG_STAR}
              alt={"Star"}
              className={
                "w-[6.25rem] h-[6.25rem] my-[1.56rem] md:w-[4.375rem] md:h-[4.375rem] md:my-[1.56rem] sm:w-[2.5rem] sm:h-[2.5rem] sm:my-[1.25rem] sm:place-self-center "
              }
            />
            <span className="font-bold">Earn Stars from Other Users</span>
            <span>
              With Explore Keys you can publish your own Keys to be enjoyed by
              other developers and see how the community rates your creations.
            </span>
          </div>
          <div
            className={
              "flex flex-col text-[1.25] md:text-[1rem] sm:text-[0.75rem]"
            }
          >
            <Image
              src={SVG_SEARCH}
              alt={"Search"}
              className={
                "w-[6.25rem] h-[6.25rem] my-[1.56rem] md:w-[4.375rem] md:h-[4.375rem] md:my-[1.56rem] sm:w-[2.5rem] sm:h-[2.5rem] sm:my-[1.25rem] sm:place-self-center "
              }
            />
            <span className="font-bold">Experiment with Other Keys</span>
            <span>
              Explore Keys allows users to discover and tinker with Keys created
              by other users. Publish your own Keys to show the world what you
              can make.
            </span>
          </div>
          <div
            className={
              "flex flex-col text-[1.25] md:text-[1rem] sm:text-[0.75rem]"
            }
          >
            <Image
              src={SVG_SHARE}
              alt={"Share"}
              className={
                "w-[6.25rem] h-[6.25rem] my-[1.56rem] md:w-[4.375rem] md:h-[4.375rem] md:my-[1.56rem] sm:w-[2.5rem] sm:h-[2.5rem] sm:my-[1.25rem] sm:place-self-center  "
              }
            />
            <span className="font-bold">Share Beyond the Scope of TernKey</span>
            <span>
              Don&apos;t limit yourself to merely the users of the application.
              Expand the audience of your Keys by sharing toward your social
              media accounts.
            </span>
          </div>
          <div
            className={
              "flex flex-col text-[1.25] md:text-[1rem] sm:text-[0.75rem]"
            }
          >
            <Image
              src={SVG_SAVE}
              alt={"Save"}
              className={
                "w-[6.25rem] h-[6.25rem] my-[1.56rem] md:w-[4.375rem] md:h-[4.375rem] md:my-[1.56rem] sm:w-[2.5rem] sm:h-[2.5rem] sm:my-[1.25rem] sm:place-self-center "
              }
            />
            <span className="font-bold">Save Your Keys for Later Use</span>
            <span>
              With TernKey Pro users have the ability to save their Keys for
              later use. Access the Key editor to edit previously saved Keys.
            </span>
          </div>
          <div
            className={
              "flex flex-col text-[1.25] md:text-[1rem] sm:text-[0.75rem]"
            }
          >
            <Image
              src={SVG_HEART}
              alt={"Heart"}
              className={
                "w-[6.25rem] h-[6.25rem] my-[1.56rem] md:w-[4.375rem] md:h-[4.375rem] md:my-[1.56rem] sm:w-[2.5rem] sm:h-[2.5rem] sm:my-[1.25rem] sm:place-self-center "
              }
            />
            <span className="font-bold">Keeping Track of Explore Keys</span>
            <span>
              Find an Explore Key you love? Show that love by adding it to your
              Favorites. Favorited Keys rank higher on global Top Picks list.
            </span>
          </div>
        </div>
      </section>
      <section className={cn(styles.pageSection, "mx-auto py-[8rem]")}>
        <span className="text-[2.5rem]">Latest News</span>
        {/* TODO: Add component for Blog posts */}
      </section>
    </div>
  );
};

export default TernKeyPage;
