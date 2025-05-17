'use client';

import { ReactElement } from 'react';
import { useParams } from 'next/navigation';

import { Layout } from '@/app/ui/layout';
import { PaymentMethodTool } from '@/app/ui/templates';

import { BreadcrumbRoute, Content, Section } from '@/app/ui/atoms';

function PurchasingMethodPage() {
    const { action } = (useParams() as { action: string }) ?? {};
    return <PaymentMethodTool creation={action === 'add_payment_method'} />;
}

PurchasingMethodPage.getLayout = (page: ReactElement) => (
    <Layout>
        <Section type={'full-screen'}>
            <Content type={'to-top'}>
                <BreadcrumbRoute length={3} />
                {page}
            </Content>
        </Section>
    </Layout>
);
PurchasingMethodPage.getMobileLayout = PurchasingMethodPage.getLayout;

export default PurchasingMethodPage;
