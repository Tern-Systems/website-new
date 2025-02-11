import {BLOG_ROUTES} from "@/app/static/routing";

import {getIdName} from "@/app/utils";


const TAGS = BLOG_ROUTES.map(route => getIdName(route));


export {TAGS};
