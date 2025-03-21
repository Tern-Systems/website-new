import React from 'react';

import { Highlighted } from '@/app/ui/organisms';

const PARAGRAPHS: string = `Tern Systems LLC: Terms and Conditions

Effective Date: May 3, 2024

Agreement Overview
This document outlines the Terms and Conditions ("Terms") governing the use of the Tern Systems LLC website, accessible at <a href='https://www.tern.ac' target="_blank" class="underline">www.tern.ac</a> (the "Site"). By accessing or using the Site, you agree to comply with these Terms without modification. If you do not agree, please refrain from using the Site. A copy of these Terms is recommended for your records.

About Tern Systems LLC and the Site
Tern Systems LLC ("Tern Systems") develops, manufactures, and enhances computer software and hardware with a focus on universal process efficiency. The Site provides users with information about our services and offerings.

Privacy Policy
Your use of the Site is governed by the Tern Systems Privacy Policy. This policy details our practices regarding the collection, use, and protection of your personal information.

Electronic Communications
By visiting the Site or communicating via email with Tern Systems, you consent to receive electronic communications. These include agreements, notices, disclosures, and other communications, which fulfill any legal requirement for written communication.

Eligibility and Age Restrictions
• Under 13: The Site does not knowingly collect information from individuals under 13 years of age.
• Under 18: Minors (under 18) may use the Site only with parental or guardian permission.

Links to Third-Party Sites and Services
The Site may include links to third-party websites ("Linked Sites").
• Tern Systems is not responsible for the content or functionality of Linked Sites.
• Links are provided for convenience and do not imply endorsement or association.
• Services provided by Linked Sites are subject to their terms and privacy policies.

Acceptable Use and Intellectual Property
• License Grant: Users are granted a non-exclusive, non-transferable, revocable license to access the Site, subject to compliance with these Terms.
• Prohibited Actions:
    • Engaging in unlawful or prohibited activities.
    • Damaging or disrupting Site functionality.
    • Attempting unauthorized access to Site materials or services.
• Intellectual Property:
    • All content on the Site, including text, graphics, software, and logos, is protected by copyright and intellectual property laws.
    • Users may not modify, distribute, sell, or create derivative works without express written permission from Tern Systems.

Third-Party Accounts Integration
Users may connect third-party accounts to their Tern Systems account. By enabling this feature, users consent to the sharing of their information as governed by the privacy settings of third-party platforms. To restrict such sharing, avoid using this feature.

International Users
The Site is operated from the United States. International users are responsible for compliance with local laws. Content and services accessed from prohibited jurisdictions are unauthorized.

Indemnification
You agree to indemnify and hold harmless Tern Systems and its representatives from any claims, damages, or liabilities arising from:
• Your use of the Site.
• Violation of these Terms or third-party rights.
• Noncompliance with applicable laws.

Arbitration and Dispute Resolution
• Arbitration Requirement: All disputes will be resolved through binding arbitration under the Federal Arbitration Act, administered by the American Arbitration Association or a similar service.
• Class Action Waiver: Disputes must be resolved on an individual basis, with no class, collective, or representative actions allowed.

Limitation of Liability
• The Site, its content, and related services are provided "as is," with no warranties of any kind.
• Tern Systems is not liable for any damages resulting from Site use, including direct, indirect, incidental, or consequential damages.
• Limitations may not apply where prohibited by jurisdiction.

Termination and Access Restriction
Tern Systems may terminate or restrict your access to the Site at its sole discretion, without notice, for any reason, including violation of these Terms.

Governing Law
This agreement is governed by the laws of the State of New York. Disputes are subject to the exclusive jurisdiction of courts located in New York.

Changes to the Terms
Tern Systems reserves the right to modify these Terms at any time. Updated Terms will supersede previous versions and will be posted on the Site. Users are encouraged to review the Terms periodically.

Contact Information
For questions or comments regarding these Terms, please contact:
Tern Systems LLC
1120 Avenue of the Americas
New York, NY 10036
Email: <a href='mailto:info@tern.ac' target="_blank" class="underline">info@tern.ac</a>
Phone: <a href='tel:19735908753' target="_blank">+1 (973) 590-8753</a>
By using the Site, you acknowledge your agreement to these Terms and Conditions.
`;

const TermsPage = () => (
    <Highlighted heading={'Terms & Conditions'}>
        <pre
            dangerouslySetInnerHTML={{ __html: PARAGRAPHS }}
            className={'whitespace-pre-line '}
        />
    </Highlighted>
);

export default TermsPage;
