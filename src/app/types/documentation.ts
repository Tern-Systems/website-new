import {PropsWithChildren} from "react";

type ContentAnchors = Array<string | Record<string, ContentAnchors>>;

type DocumentationContent = PropsWithChildren & {
    anchors: ContentAnchors;
    isChapter?: boolean;
}

export type {ContentAnchors, DocumentationContent};
