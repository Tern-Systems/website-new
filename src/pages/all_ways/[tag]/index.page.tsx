import {useParams} from "next/navigation";

import {ArticleTag} from "@/app/types/blog";

import {TagArticle} from "./TagArticle";


function ArticlesByTag() {
    const {tag = null} = useParams<{ tag: ArticleTag }>() ?? {};
    return <TagArticle tag={tag}/>;
}


export default ArticlesByTag;
