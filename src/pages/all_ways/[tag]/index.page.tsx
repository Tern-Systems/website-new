'use client';

import { useParams } from 'next/navigation';

import { ArticleCategory } from '@/app/types/blog';

import { TagArticle } from './TagArticle';

function ArticlesByTag() {
    const { tag = null } = useParams<{ tag: ArticleCategory }>() ?? {};
    return <TagArticle tag={tag} />;
}

export default ArticlesByTag;
