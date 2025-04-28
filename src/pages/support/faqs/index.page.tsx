'use client';

import { FAQs } from '@/app/static';

import FAQsContent from '@/app/ui/templates/FAQs';

function FAQsPage() {
    return <FAQsContent faqsData={FAQs} />;
}

export default FAQsPage;
