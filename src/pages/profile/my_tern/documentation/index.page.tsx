'use client';

import { FC } from 'react';

import { useLoginCheck } from '@/app/hooks';

import DocumentationPage from '@/pages/support/documentation/index.page';

const MyDocumentationPage: FC = () => {
    const isLoggedIn = useLoginCheck();
    if (!isLoggedIn) return null;
    return <DocumentationPage filterBySubscription={true} />;
};

export default MyDocumentationPage;
