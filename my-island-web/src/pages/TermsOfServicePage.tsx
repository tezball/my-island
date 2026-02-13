import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left"
            >
                <span className="font-medium text-[#111418] dark:text-white pr-4">{title}</span>
                <span className="material-symbols-outlined text-gray-400 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}>
                    expand_more
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
                    {children}
                </div>
            )}
        </div>
    );
};

export const TermsOfServicePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white mb-3">
                    Terms of Service
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Please read these terms carefully before using the My Island platform.
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Last updated: February 2026</p>
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 px-6">
                <Section title="1. Acceptance of Terms">
                    <p>By accessing or using the My Island platform (myisland.ie), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the platform.</p>
                    <p>These terms constitute a legally binding agreement between you and My Island Ltd, a company registered in Ireland.</p>
                </Section>

                <Section title="2. Account Registration">
                    <p>To use certain features, you must create an account. You agree to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Provide accurate and complete information during registration</li>
                        <li>Keep your login credentials secure and confidential</li>
                        <li>Notify us immediately of any unauthorised use of your account</li>
                        <li>Be responsible for all activity under your account</li>
                    </ul>
                    <p>You must be at least 18 years old to create an account.</p>
                </Section>

                <Section title="3. Platform Description">
                    <p>My Island is a camping and glamping booking platform that connects:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Guests</strong> with camping, glamping, and outdoor accommodation across Ireland</li>
                        <li><strong>Property Owners</strong> with potential guests through online booking management</li>
                        <li><strong>Local Suppliers</strong> with visitors through a marketplace for local products and experiences</li>
                    </ul>
                    <p>My Island acts as an intermediary platform. We are not a party to any booking contract between guests and owners, nor to any transaction between guests and suppliers.</p>
                </Section>

                <Section title="4. Booking Terms">
                    <p>When you make a booking through My Island:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You enter into a direct agreement with the property owner</li>
                        <li>Payment is authorised at the time of booking and captured upon owner confirmation</li>
                        <li>Booking confirmations are sent via email and available in your Trips page</li>
                        <li>Guests must comply with the property's rules and check-in/check-out times</li>
                        <li>The property owner reserves the right to refuse service</li>
                    </ul>
                </Section>

                <Section title="5. Cancellation & Modifications">
                    <p><strong>Guest cancellations:</strong> Guests may cancel bookings through the Trips page. Refund terms depend on how close to the check-in date the cancellation occurs.</p>
                    <p><strong>Guest modifications:</strong> Guests may request date or lot changes subject to the owner's modification policy. Changes within policy may be auto-approved; others require owner approval.</p>
                    <p><strong>Owner cancellations:</strong> If an owner cancels your booking, you will receive a full refund.</p>
                    <p><strong>Platform cancellations:</strong> We reserve the right to cancel bookings in cases of fraud, policy violations, or safety concerns.</p>
                </Section>

                <Section title="6. Payment Terms">
                    <p>All payments are processed securely through Stripe. By making a payment you agree to Stripe's terms of service.</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Prices are displayed in Euros and include any applicable service fees</li>
                        <li>A platform service fee is added to each booking and displayed before payment</li>
                        <li>Payment is authorised at booking time and captured when the owner confirms</li>
                        <li>Refunds are processed to the original payment method</li>
                        <li>Owners and suppliers receive payouts through Stripe Connect</li>
                    </ul>
                </Section>

                <Section title="7. Marketplace Terms">
                    <p>The My Island Marketplace allows local suppliers to promote offers to guests:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Offers are created and managed by individual suppliers</li>
                        <li>Voucher codes are issued upon claiming an offer and can be redeemed at the supplier's premises</li>
                        <li>Vouchers have expiry dates and redemption limits set by the supplier</li>
                        <li>My Island is not responsible for the quality or availability of supplier products or services</li>
                        <li>Disputes regarding marketplace offers should be directed to the supplier in the first instance</li>
                    </ul>
                </Section>

                <Section title="8. Owner Obligations">
                    <p>Property owners who list on My Island agree to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Provide accurate and up-to-date property information, including descriptions, photos, and pricing</li>
                        <li>Maintain their property to the standards described in their listing</li>
                        <li>Respond to booking requests in a timely manner</li>
                        <li>Honour confirmed bookings</li>
                        <li>Comply with all applicable Irish laws, including planning permission, health and safety, and insurance requirements</li>
                        <li>Maintain appropriate public liability insurance</li>
                        <li>Pay subscription fees when due</li>
                    </ul>
                </Section>

                <Section title="9. Supplier Obligations">
                    <p>Suppliers listing on the My Island Marketplace agree to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Provide accurate descriptions of offers and services</li>
                        <li>Honour all valid, unexpired vouchers presented by guests</li>
                        <li>Comply with consumer protection laws</li>
                        <li>Maintain appropriate business insurance and licences</li>
                        <li>Pay subscription fees when due</li>
                    </ul>
                </Section>

                <Section title="10. User Conduct">
                    <p>All users agree not to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Provide false or misleading information</li>
                        <li>Use the platform for any unlawful purpose</li>
                        <li>Harass, abuse, or threaten other users</li>
                        <li>Attempt to circumvent the platform's payment system</li>
                        <li>Scrape, crawl, or use automated tools to access the platform</li>
                        <li>Upload malicious content or attempt to compromise platform security</li>
                        <li>Create multiple accounts for fraudulent purposes</li>
                    </ul>
                </Section>

                <Section title="11. Reviews & Content">
                    <p>Users may submit reviews and other content. By submitting content you:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Confirm that your review reflects a genuine experience</li>
                        <li>Grant My Island a non-exclusive licence to display your content on the platform</li>
                        <li>Agree not to submit defamatory, offensive, or misleading content</li>
                    </ul>
                    <p>We reserve the right to remove or flag content that violates these terms. Property owners and suppliers may post a single response to each review.</p>
                </Section>

                <Section title="12. Intellectual Property">
                    <p>The My Island platform, including its design, code, content, and branding, is the intellectual property of My Island Ltd. You may not copy, modify, distribute, or create derivative works from any part of the platform without written permission.</p>
                    <p>Content you upload (photos, reviews, descriptions) remains your property, but you grant us a licence to use it as described in these terms.</p>
                </Section>

                <Section title="13. Limitation of Liability">
                    <p>To the fullest extent permitted by Irish law:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>My Island provides the platform on an "as is" and "as available" basis</li>
                        <li>We do not guarantee the accuracy of property listings or supplier offers</li>
                        <li>We are not liable for any loss or damage arising from bookings, stays, or marketplace transactions</li>
                        <li>Our total liability shall not exceed the fees paid by you to My Island in the 12 months preceding the claim</li>
                    </ul>
                    <p>Nothing in these terms excludes liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under Irish law.</p>
                </Section>

                <Section title="14. Indemnification">
                    <p>You agree to indemnify and hold harmless My Island Ltd, its directors, employees, and agents from any claims, damages, or expenses arising from your use of the platform, your content, or your violation of these terms.</p>
                </Section>

                <Section title="15. Governing Law">
                    <p>These terms are governed by and construed in accordance with the laws of Ireland. Any disputes arising from these terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts of Ireland.</p>
                </Section>

                <Section title="16. Dispute Resolution">
                    <p>In the event of a dispute, we encourage users to contact us first at support@myisland.ie to seek an amicable resolution. For booking disputes between guests and owners, we will make reasonable efforts to mediate.</p>
                    <p>EU consumers may also use the European Online Dispute Resolution (ODR) platform at ec.europa.eu/odr.</p>
                </Section>

                <Section title="17. Termination">
                    <p>We may suspend or terminate your account if you violate these terms, engage in fraudulent activity, or at our discretion with reasonable notice. Upon termination:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Your right to access the platform ceases immediately</li>
                        <li>Existing confirmed bookings will be honoured where possible</li>
                        <li>Outstanding payments remain due</li>
                        <li>Data retention follows our <Link to="/privacy" className="text-primary hover:text-[#20d85f] underline">Privacy Policy</Link></li>
                    </ul>
                </Section>

                <Section title="18. Changes to Terms">
                    <p>We may update these terms from time to time. Material changes will be communicated via email to registered users and posted on this page with an updated date. Your continued use of the platform after changes constitutes acceptance of the updated terms.</p>
                </Section>

                <Section title="19. Contact">
                    <p>If you have questions about these Terms of Service:</p>
                    <p><strong>My Island Ltd</strong><br />Email: support@myisland.ie</p>
                </Section>
            </div>

            {/* Back to top / navigation */}
            <div className="mt-8 text-center">
                <Link
                    to="/privacy"
                    className="text-primary hover:text-[#20d85f] text-sm font-medium transition-colors"
                >
                    View Privacy Policy
                </Link>
            </div>
        </div>
    );
};
