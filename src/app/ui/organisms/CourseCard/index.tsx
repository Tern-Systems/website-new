/* eslint-disable prettier/prettier */
"use client";

import { FC } from "react";
import Image from "next/image";
import cn from "classnames";

import { ButtonIcon } from "@/app/ui/form/Button";
import { Article, Tip } from "@/app/types/blog";
import { Route } from "@/app/static";

import { useNavigate } from "@/app/hooks";

import { Button } from "@/app/ui/form";

import styles from "@/app/common.module.css";

import PNG_NATURE from "@/assets/images/nature.png";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

type CourseCardType = "default" | "expand" | "featured" | "popular";
export type { CourseCardType as CourseCardType };

interface Props {
    type?: CourseCardType;
    course: Article | Tip | null; // TODO: Define course types based on the backend
    hideTag?: true;
    altLink?: string;
    altIcon?: ButtonIcon;
    className?: string;
    classNameContent?: string;
}

const CourseCard: FC<Props> = (props: Props) => {
    const {
        type,
        course,
        hideTag,
        altLink,
        altIcon,
        className,
        classNameContent,
    } = props;

    const [navigate] = useNavigate(true);

    const openCourse = (course: Article | Tip | null) => {
        if (!course) return;
        localStorage.setItem("article", JSON.stringify(course));
        navigate((Route.AllWaysArticle + "/" + course.id) as Route);
    };

    const expand = type === "expand";
    const popular = type === "popular";
    const featured = type === "featured";
    const fp = type === "featured" || popular;
    // const isArticle = course && "tag" in course;

    const icon = (altIcon ?? altLink) ? faArrowRight : faVideo;
    const label = altLink ?? "Watch";
    const tag = "Tidal" // TODO

    return (
        <div
            onClick={() => openCourse(course)}
            className={cn(
                styles.clickable,
                "box-border grid h-auto w-full flex-1 overflow-hidden border-s",
                {
                    [fp ? "grid-cols-[3fr_2fr]" : "grid-rows-[4fr,3fr]"]:
                        !popular,
                    ["max-h-[433px]"]: !type || type === "default",
                    ["sm:x-[mx-auto]"]: expand || fp,
                    ["h-[226px]"]: fp,
                },
                className
            )}
        >
            <div
                className={cn(
                    "relative -z-10 flex size-full overflow-hidden",
                    popular ? "pb-0" : "pr-0",
                    {
                        ["p-xs"]: fp,
                    }
                )}
            >
                <div
                    className={
                        "absolute from-0 bg-gradient-to-t from-black to-25%"
                    }
                />
                <Image
                    src={course?.poster || PNG_NATURE}
                    width={100}
                    height={100}
                    alt={`article-img`}
                    className={cn("size-full min-h-full object-cover", {
                        [popular ? "max-h-[12.8125rem]" : "!min-w-[11.625rem]"]:
                            fp,
                    })}
                />
                {!type || type === "default" ? (
                    <div className="absolute left-0 right-0 bottom-0 h-[120px] rotate-180 bg-gradient-to-b from-black via-black via-0% lg:via-5% to-transparent sm:to-60% md:to-40% lg:to-50% z-0" />
                ) : null}
            </div>
            <div
                className={cn(
                    "relative z-10 flex flex-grow flex-col items-start p-xs",
                    {
                        ['max-h-[185px] pt-s']: !type || type === "default",
                        ["px-xs lg:px-xl pt-n  pb-s lg:pb-xxl"]: expand,
                        ["justify-between"]: featured,
                    },
                    classNameContent
                )}
            >
                {fp || hideTag ? null : (
                    <span className={cn("text-[#B3B3B3] text-12 mb-4xs")}>
                        {tag}
                    </span>
                )}
                <span className={cn("mb-s block leading-n", "text-16")}>
                    {course?.title ?? "There will be a title..."}
                </span>
                {(!type || type === "default") ? (
                        <span
                            className={
                                "mb-n block leading-n text-12"
                            }
                        >
                            {course?.description ? (course.description) :
                                    "There will be a description..."}
                        </span>
                    ) : null}
                <div
                    className={cn("flex w-full justify-between", {
                        "flex-col space-y-2": featured,
                    })}
                >
                    {!fp || hideTag ? null :
                    (
                        <div
                            className={cn("text-[#B3B3B3] text-12", {
                                "order-first": featured,
                                "order-last": !featured && popular,
                            })}
                        >
                            {tag}
                        </div>
                    )}
                    <Button
                        icon={icon}
                        className={cn("capitalize text-blue", {
                            "mt-auto": !featured,
                            "!justify-start": featured,
                            "flex-row-reverse": !!altLink,
                        })}
                        classNameIcon={cn(
                            "w-[0.67rem] [&_path]:fill-blue mt-auto",
                            {
                                "ml-5xs": !!altLink,
                            }
                        )}
                    >
                        {label}
                    </Button>
                </div>
            </div>
        </div>
    );
};

CourseCard.displayName = CourseCard.name;

export { CourseCard as CourseCard };
