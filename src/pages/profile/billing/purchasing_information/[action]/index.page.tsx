import React, { ReactElement } from 'react';
import { useParams } from 'next/navigation';

import { Layout } from '@/app/ui/layout';
import { PaymentMethodTool } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import { BreadcrumbRoute } from '@/app/ui/atoms';

function PurchasingMethodPage() {
    const { action } = (useParams() as { action: string }) ?? {};
    return <PaymentMethodTool paymentCreation={action === 'add'} />;
}

PurchasingMethodPage.getLayout = (page: ReactElement) => (
    <Layout>
        <section
            className={`${styles.section} ${styles.fullHeightSection} bg-black bg-gradient-to-t from-blue to-black to-30% lg:to-40%`}
        >
            <div className={styles.content}>
                <BreadcrumbRoute />
                {page}
            </div>
        </section>
    </Layout>
);
PurchasingMethodPage.getMobileLayout = PurchasingMethodPage.getLayout;

export default PurchasingMethodPage;
