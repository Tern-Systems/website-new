import { LAYOUT } from '@/app/static/layout';

import { getIdName } from '@/app/utils';

const TAGS = LAYOUT.blogLinks.map((route) => getIdName(route));

export { TAGS };
