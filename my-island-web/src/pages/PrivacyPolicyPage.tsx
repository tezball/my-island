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

export const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white mb-3">
                    Privacy Policy
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    How we collect, use, and protect your personal data under the General Data Protection Regulation (GDPR).
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Last updated: February 2026</p>
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 px-6">
                <Section title="1. Data Controller">
                    <p>My Island is operated by My Island Ltd, a company registered in Ireland. We are the data controller for the personal data collected through our platform at myisland.ie.</p>
                    <p>Contact: privacy@myisland.ie</p>
                </Section>

                <Section title="2. Data We Collect">
                    <p><strong>Account information:</strong> Name, email address, password (hashed), profile photo.</p>
                    <p><strong>Booking information:</strong> Check-in/check-out dates, number of guests, accommodation preferences, booking history.</p>
                    <p><strong>Payment information:</strong> Payment card details are processed securely by Stripe and are never stored on our servers. We store Stripe customer IDs and transaction references.</p>
                    <p><strong>Property/business information (Owners & Suppliers):</strong> Business name, address, contact details, bank details (via Stripe Connect), property descriptions and images.</p>
                    <p><strong>Usage data:</strong> Pages visited, features used, browser type, device type, IP address.</p>
                    <p><strong>Communications:</strong> Messages sent through in-app messaging, support enquiries, reviews.</p>
                </Section>

                <Section title="3. How We Use Your Data">
                    <p>We use your personal data to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Create and manage your account</li>
                        <li>Process bookings and payments</li>
                        <li>Facilitate communication between guests and property owners</li>
                        <li>Send booking confirmations, pre-arrival information, and post-stay review requests</li>
                        <li>Manage subscriptions and billing for owners and suppliers</li>
                        <li>Process marketplace offer claims and voucher redemptions</li>
                        <li>Display reviews and ratings</li>
                        <li>Improve our platform and user experience</li>
                        <li>Prevent fraud and ensure platform security</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </Section>

                <Section title="4. Legal Basis for Processing">
                    <p>We process your personal data under the following legal bases as defined by Article 6 of the GDPR:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Contract performance:</strong> Processing necessary to fulfil our contract with you (bookings, account management, payments).</li>
                        <li><strong>Legitimate interests:</strong> Platform improvement, fraud prevention, analytics, and direct marketing to existing customers.</li>
                        <li><strong>Consent:</strong> Where you have given specific consent (e.g., marketing communications, cookie preferences).</li>
                        <li><strong>Legal obligation:</strong> Where processing is necessary to comply with Irish and EU law.</li>
                    </ul>
                </Section>

                <Section title="5. Data Sharing">
                    <p>We share personal data with the following categories of recipients:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Property owners:</strong> Your name, email, and booking details are shared with the owner of the property you book.</li>
                        <li><strong>Suppliers:</strong> When you claim a marketplace offer, your name and voucher details are shared with the relevant supplier.</li>
                        <li><strong>Stripe:</strong> Our payment processor. Stripe processes payment card details under their own privacy policy.</li>
                        <li><strong>Hosting providers:</strong> Our platform infrastructure is hosted on secure cloud services within the EU.</li>
                    </ul>
                    <p>We do not sell your personal data to third parties.</p>
                </Section>

                <Section title="6. Data Retention">
                    <p>We retain your personal data for as long as necessary for the purposes outlined in this policy:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Account data:</strong> Retained while your account is active, and for up to 2 years after deletion request to resolve any disputes.</li>
                        <li><strong>Booking data:</strong> Retained for 7 years for tax and accounting purposes as required by Irish Revenue.</li>
                        <li><strong>Payment records:</strong> Retained for 7 years per Irish financial regulations.</li>
                        <li><strong>Reviews:</strong> Retained for the lifetime of the reviewed property/supplier listing, or until you request deletion.</li>
                        <li><strong>Messages:</strong> Retained for 2 years after the associated booking is completed.</li>
                    </ul>
                </Section>

                <Section title="7. Your GDPR Rights">
                    <p>Under the GDPR, you have the following rights regarding your personal data:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you.</li>
                        <li><strong>Right to rectification:</strong> Request correction of inaccurate personal data.</li>
                        <li><strong>Right to erasure:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
                        <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data.</li>
                        <li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format.</li>
                        <li><strong>Right to object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
                        <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
                    </ul>
                    <p>To exercise any of these rights, contact us at privacy@myisland.ie. We will respond within 30 days.</p>
                </Section>

                <Section title="8. Cookies & Local Storage">
                    <p>We use the following browser storage mechanisms:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Authentication token:</strong> A JWT token stored in localStorage to keep you signed in.</li>
                        <li><strong>Cookie consent preference:</strong> Your cookie consent choice stored in localStorage.</li>
                        <li><strong>Saved favourites:</strong> For anonymous users, saved lot preferences are stored in localStorage and merged to your account on sign-in.</li>
                    </ul>
                    <p>We do not use third-party tracking cookies. Our platform does not serve advertising.</p>
                </Section>

                <Section title="9. Data Security">
                    <p>We implement appropriate technical and organisational measures to protect your personal data, including:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Encryption of data in transit (TLS/HTTPS)</li>
                        <li>Passwords stored using bcrypt hashing</li>
                        <li>Role-based access control for platform staff</li>
                        <li>Regular security reviews and updates</li>
                        <li>Payment data handled exclusively by PCI-DSS compliant processors (Stripe)</li>
                    </ul>
                </Section>

                <Section title="10. International Transfers">
                    <p>Your personal data is primarily stored and processed within the European Economic Area (EEA). Where data is processed outside the EEA (e.g., by sub-processors of our cloud infrastructure providers), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.</p>
                </Section>

                <Section title="11. Children's Privacy">
                    <p>Our platform is not intended for children under the age of 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us at privacy@myisland.ie and we will delete it promptly.</p>
                </Section>

                <Section title="12. Changes to This Policy">
                    <p>We may update this privacy policy from time to time. Material changes will be communicated via email to registered users and posted on this page. Your continued use of the platform after changes constitutes acceptance of the updated policy.</p>
                </Section>

                <Section title="13. Contact & Data Protection Commission">
                    <p>If you have questions about this privacy policy or wish to exercise your data rights:</p>
                    <p><strong>My Island Ltd</strong><br />Email: privacy@myisland.ie</p>
                    <p>If you are not satisfied with our response, you have the right to lodge a complaint with the Irish Data Protection Commission (DPC):</p>
                    <p><strong>Data Protection Commission</strong><br />
                    21 Fitzwilliam Square South, Dublin 2, D02 RD28, Ireland<br />
                    Phone: +353 1 765 0100 / 1800 437 737<br />
                    Website: dataprotection.ie</p>
                </Section>
            </div>

            {/* Back to top / navigation */}
            <div className="mt-8 text-center">
                <Link
                    to="/terms"
                    className="text-primary hover:text-[#20d85f] text-sm font-medium transition-colors"
                >
                    View Terms of Service
                </Link>
            </div>
        </div>
    );
};
