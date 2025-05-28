/* eslint-disable prettier/prettier */
"use client";

import { FC } from "react";
import Image from "next/image";
import cn from "classnames";

import { ButtonIcon } from "@/app/ui/form/Button";
import { Course } from "@/app/types/blog";
import { Route } from "@/app/static";

import { useNavigate } from "@/app/hooks";

import { Button } from "@/app/ui/form";

import styles from "@/app/common.module.css";

import PNG_NATURE from "@/assets/images/nature.png";
import {
    faVideo,
    faArrowRight,
    faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

type CourseCardType = "default" | "expand" | "featured" | "popular" | "compact";
export type { CourseCardType as CourseCardType };

interface Props {
    type?: CourseCardType;
    course: Course | null;
    hideTag?: true;
    hideTitle?: true;
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
        hideTitle,
        altLink,
        altIcon,
        className,
        classNameContent,
    } = props;

    const [navigate] = useNavigate(true);

    const openCourse = (course: Course | null) => {
        if (!course) return;
        localStorage.setItem("course", JSON.stringify(course));
        navigate((Route.CourseVideo + "/" + course.id) as Route);
    };

    const expand = type === "expand";
    const popular = type === "popular";
    const featured = type === "featured";
    const compact = type === "compact";
    const fp = type === "featured" || popular;
    // const isArticle = course && "tag" in course;

    const icon = (altIcon ?? altLink) ? faArrowRight : faVideo;
    const label = altLink ?? "Watch";
    const tag = course?.series ?? "Tidal"; // TODO

    if (compact) {
        return (
            <div
                onClick={() => openCourse(course)}
                className={cn(
                    styles.clickable,
                    "w-full h-full flex flex-col overflow-hidden cursor-pointer",
                    "group",
                    className
                )}
            >
                <div
                    className={cn(
                        "relative w-full aspect-[16/9]",
                        "border-s overflow-hidden"
                    )}
                >
                    <Image
                        src={course?.thumbnail || PNG_NATURE}
                        alt={`article-img`}
                        className={cn("w-full h-full object-cover inset-0", {})}
                    />
                    <Button
                        icon={faPlayCircle}
                        className={cn(
                            "absolute inset-0 flex items-center justify-center"
                        )}
                        classNameIcon={cn(
                            "w-[10%] h-auto [&_path]:fill-slate-100",
                            "group-hover:w-[12%]  transition-all duration-100"
                        )}
                    />
                    {hideTag ? null : (
                        <div
                            className={cn(
                                "absolute top-0 left-0 px-2 py-1 min-w-[60px]",
                                "bg-[#D9D9D9] text-black text-12 text-center"
                            )}
                        >
                            {tag}
                        </div>
                    )}
                    <div
                        className={cn(
                            "absolute bottom-0 right-0 px-2 h-[18px] flex items-center min-w-[48px]",
                            "bg-[#979797] text-white text-14 text-center"
                        )}
                    >
                        {course?.duration ?? "00:00"}
                    </div>
                </div>
                {hideTitle ? null : (
                    <div
                        className={cn(
                            "flex flex-col items-start pt-xs gap-y-2",
                            classNameContent
                        )}
                    >
                        <span className={cn("", "text-12 line-clamp-1")}>
                            {course?.title ?? "There will be a title..."}
                        </span>
                        <span className="text-10">
                            {course?.date
                                ? new Date(course.date).toLocaleDateString(
                                      "en-US",
                                      {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                      }
                                  )
                                : "Date TBD"}
                        </span>
                    </div>
                )}
            </div>
        );
    }
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
                    src={course?.thumbnail || PNG_NATURE}
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
                        ["max-h-[185px] pt-s"]: !type || type === "default",
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
                <span
                    className={cn("mb-s leading-n", "text-16", [
                        featured ? "line-clamp-6" : "line-clamp-1",
                    ])}
                >
                    {course?.title ?? "There will be a title..."}
                </span>
                {!type || type === "default" ? (
                    <span
                        className={
                            "mb-n leading-n text-12 line-clamp-2 h-[28px]"
                        }
                    >
                        {course?.description
                            ? course.description
                            : "There will be a description..."}
                    </span>
                ) : null}
                <div
                    className={cn("flex w-full justify-between", {
                        "flex-col space-y-2": featured,
                    })}
                >
                    {!fp || hideTag ? null : (
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
