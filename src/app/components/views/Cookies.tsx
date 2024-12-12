import React from 'react';
import styles from '../../page.module.css';
import {withSectionLink} from "@/app/hocs";
import {useRouter} from "next/navigation";
import {SectionsEnum} from "@/app/utils/sections";

const PARAGRAPHS: string = `Tern Systems LLC Cookie Policy

Effective Date: August 23, 2024

Tern Systems LLC (“we,” “us,” “our”) is committed to providing a personalized online experience through the use of cookies on our website. This Cookie Policy explains what cookies are, the types of cookies we use, their purposes, and your choices regarding their usage.

What Are Cookies?
Cookies are small text files stored on your device by websites you visit. They serve various functions, including enhancing website functionality, improving user experience, and providing insights into website performance. Cookies cannot execute programs or transmit viruses. Each cookie is uniquely assigned and can only be read by the web server within the domain that issued it.

We may utilize both:
• Session Cookies: Temporary cookies that expire when your browser is closed.
• Persistent Cookies: Cookies that remain on your device until you delete them.

The primary purpose of cookies is to enhance your experience by recognizing you on future visits and streamlining your interactions with our website.

Purpose of Cookies
Cookies simplify your online interactions by:
• Saving time and effort when re-entering data.
• Remembering your preferences (e.g., language or region).
• Enabling website features, such as secure logins, shopping carts, and content customization.

Types of Cookies We Use
1. Strictly Necessary Cookies
   These are essential for the basic functionality of our website and services. Examples include cookies that allow secure logins, cart usage, and transaction processing.
2. Analytical/Performance Cookies
   These cookies help us analyze website traffic and usage patterns to improve functionality and user experience. Data collected is aggregated and does not identify individual users.
3. Functionality Cookies
   These enable enhanced but non-essential features, such as personalized content, user greetings, and stored preferences.
4. Advertising, Tracking, or Targeting Cookies
   These cookies record user behavior (e.g., pages visited, videos viewed) to provide relevant advertisements and improve website engagement. These may also include third-party cookies.
5. Third-Party Cookies
   Our website may include third-party features such as social media plugins, maps, and analytics services. These cookies, managed by third parties, may track users across websites. Review their respective policies for detailed information.

Cookie Management and User Choices
You can control your cookie preferences through:
• Browser Settings: Most browsers allow you to block or delete cookies. Blocking all cookies may limit functionality.
• Withdrawing Consent: You may withdraw consent for non-essential cookies at any time by contacting us.

Legal Basis for Cookie Use
Our Privacy Policy details our legal basis for processing personal data collected through cookies. We process data to:
• Comply with legal obligations.
• Protect our rights or property.
• Safeguard users or the public in exigent circumstances.

Changes to This Cookie Policy
We reserve the right to modify this Cookie Policy as required by law or business needs. Updates will be posted on this page, and your continued use of the website signifies your acceptance of these changes.

Contact Information
If you have questions about this policy or believe we have not adhered to its terms, please contact us:
• Address: Tern Systems LLC, 1120 Avenue of the Americas, New York, NY 10036
• Email: <a href='mailto:info@tern.ac' target="_blank" class="underline">info@tern.ac</a>
• Phone: <a href='tel:19735908753' target="_blank" class="underline">+1 (973) 590-8753</a>
 `;

const CookieView = () => {
    const router = useRouter();
    const SectionLink = withSectionLink();

    return (
        <div className={`${styles.highlight} max-w-[112.25rem] max-h-[41.625rem]`}>
            <h1 className={'mb-[2.3rem]'}>Cookies Policy</h1>
            <span className={'overflow-y-scroll [&&]:text-[1.6875rem]'}>
                <pre className={'font-neo'} dangerouslySetInnerHTML={{__html: PARAGRAPHS}}/>
               <span>
                   For additional information, please refer to our&nbsp;
                   <SectionLink
                       section={SectionsEnum.Privacy}
                       className={'inline-flex underline'}
                   >
                       Privacy Policy
                   </SectionLink>
                   .
               </span>
            </span>
        </div>
    );
};

export {CookieView};
