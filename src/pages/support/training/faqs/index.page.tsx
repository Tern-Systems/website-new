'use client';

import FAQsContent from '@/app/ui/templates/FAQs';
import { TrainingFAQs } from '@/app/static/training';

export default function TrainingFAQsPage() {
    return <FAQsContent faqsData={TrainingFAQs} />;
}
