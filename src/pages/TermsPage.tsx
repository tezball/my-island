import AppShell from '../components/layout/AppShell'

export default function TermsPage() {
  return (
    <AppShell showBack headerTitle="Terms of Service">
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          <div className="text-sm text-slate-500">
            Last updated: January 2, 2026
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              By accessing or using the my-island platform ("Service"), you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to these
              Terms, you may not use our Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Description of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              my-island is an online platform that connects campers ("Guests") with
              camping accommodation providers ("Hosts"). We facilitate bookings but do
              not own, operate, or manage any camping facilities. We act as an
              intermediary between Guests and Hosts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. User Accounts
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Bookings and Payments
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When you make a booking through our platform:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>You enter into a direct agreement with the Host</li>
              <li>Payment is processed securely through our payment partners</li>
              <li>Prices are displayed in Euros (EUR) and include applicable taxes</li>
              <li>Additional fees may apply as specified during booking</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Cancellation Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Cancellation policies vary by Host and are displayed during the booking
              process. Common policies include:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li><strong>Flexible:</strong> Full refund up to 24 hours before check-in</li>
              <li><strong>Moderate:</strong> Full refund up to 5 days before check-in</li>
              <li><strong>Strict:</strong> 50% refund up to 7 days before check-in</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Guest Responsibilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              As a Guest, you agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Follow all campsite rules and regulations</li>
              <li>Respect the property and other guests</li>
              <li>Leave the site in a clean and tidy condition</li>
              <li>Report any damage or issues promptly</li>
              <li>Not exceed the stated guest capacity</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Host Responsibilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              As a Host, you agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Provide accurate listing descriptions and photos</li>
              <li>Maintain safe and clean facilities</li>
              <li>Honor confirmed bookings</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respond to guest inquiries in a timely manner</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              8. Reviews
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Reviews must be honest, relevant, and not contain:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>False or misleading information</li>
              <li>Offensive or discriminatory content</li>
              <li>Personal contact information</li>
              <li>Promotional material or spam</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              9. Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              my-island is not liable for any direct, indirect, incidental, or
              consequential damages arising from your use of the Service, including
              but not limited to damages related to booking disputes, property damage,
              personal injury, or loss of data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              10. Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All content on the platform, including logos, text, graphics, and software,
              is the property of my-island or its licensors and is protected by
              intellectual property laws. You may not reproduce, distribute, or create
              derivative works without our express permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              11. Termination
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for
              violations of these Terms or for any other reason at our discretion. You
              may also delete your account at any time through your account settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              12. Governing Law
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of
              Ireland. Any disputes arising from these Terms shall be subject to the
              exclusive jurisdiction of the courts of Ireland.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              13. Changes to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may modify these Terms at any time. We will notify users of material
              changes via email or through the platform. Continued use of the Service
              after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              14. Contact Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-1">
              <p className="text-slate-900 dark:text-white font-medium">my-island</p>
              <p className="text-slate-600 dark:text-slate-400">Email: legal@my-island.com</p>
              <p className="text-slate-600 dark:text-slate-400">Address: Dublin, Ireland</p>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
