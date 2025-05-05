import React from 'react';

const PARAGRAPHS: string = `Tern Systems LLC Privacy Policy

Effective Date: May 3, 2024

This Privacy Policy ("Policy") outlines the data collection and usage practices of Tern Systems LLC ("Company") and applies to the Company website, <a href='https://www.tern.ac' target="_blank" class="underline">www.tern.ac</a>. By using the website, you consent to the practices described herein.

Scope of This Policy
This Policy governs the data collection, usage, and sharing practices of Tern Systems LLC and its website, www.tern.ac. The Company's website serves as an informational platform for businesses and facilitates the sale of high-performance computer systems.

Collection of Personal Information
The Company does not collect personal information unless voluntarily provided by users. Personal information may be collected in the following situations:
• Account Registration: When creating an account.
• Promotions: Participating in sweepstakes or contests.
• Special Offers: Opting into offers from selected third parties.
• Customer Communication: Sending email inquiries.
• Purchases: Submitting payment details for product or service orders.

Personal information is used to:
• Provide products and services requested.
• Communicate updates related to orders or inquiries.
• Facilitate customer service and support.

Additional personal or non-personal information may be collected in the future to enhance service quality.

Sharing of Personal Information
The Company does not sell, rent, or lease customer data to third parties. However, personal information may be shared with trusted partners to:
• Perform statistical analysis.
• Send communications, including email or postal mail.
• Provide customer support.
• Arrange deliveries.

Third parties are contractually obligated to use personal information solely for these purposes and must maintain its confidentiality.

The Company may disclose personal information without prior notice when required to:
1. Comply with legal obligations or respond to legal processes.
2. Protect the rights or property of the Company.
3. Address exigent circumstances, including the safety of users or the public.

Automatically Collected Information
The Company may collect technical data such as:
• IP addresses.
• Browser types.
• Domain names.
• Access times.
• Referring website addresses.

This information is used to improve website functionality, maintain service quality, and analyze usage patterns.

External Links
The website may include links to third-party sites. The Company is not responsible for the privacy practices or content of external websites. Users are encouraged to review the privacy policies of linked sites before providing personal information.

Right to Deletion
Upon receiving a verifiable request, the Company will:
• Delete your personal information from its records.
• Direct service providers to delete your personal information from their systems.

Exceptions: The Company may be unable to delete information if it is required to:
• Complete a transaction or service request.
• Detect and prevent fraud or security incidents.
• Debug systems or repair technical errors.
• Comply with legal obligations.
• Conduct lawful research aligned with applicable privacy laws.

Children Under Thirteen
The Company does not knowingly collect information from children under 13. If you are under 13, please obtain parental or guardian consent before using the website.

Policy Updates
The Company reserves the right to modify this Policy to reflect changes in services, legal requirements, or data protection practices. Significant changes will be communicated through:
• Notifications sent to the primary email address associated with your account.
• Prominent notices on the website.

Continued use of the website constitutes acknowledgment and acceptance of the updated Policy.

Contact Information
For questions or concerns about this Policy, please contact:
Tern Systems LLC
1120 Avenue of the Americas
New York, NY 10036
Email: <a href='mailto:info@tern.ac' target="_blank" class="underline">info@tern.ac</a>
Phone:  <a href='tel:19735908753' target="_blank" class="underline">+1 (973) 590-8753</a> 

This Policy ensures transparency and demonstrates our commitment to safeguarding your data.
 `;

const PrivacyPage = () => (
    <div className={'Privacy Policy'}>
        <pre
            dangerouslySetInnerHTML={{ __html: PARAGRAPHS }}
            className={'whitespace-pre-line '}
        />
    </div>
);

export default PrivacyPage;
