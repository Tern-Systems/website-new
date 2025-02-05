import {BLOG_ROUTES} from "@/app/static/routing";

import {getRouteName} from "@/app/utils";


const TAGS = BLOG_ROUTES.map(route => getRouteName(route));


export {TAGS};
