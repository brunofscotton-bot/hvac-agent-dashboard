import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Ringa",
};

export default function TermsOfServicePage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(135deg, #0a0e1a 0%, #111827 40%, #1a1040 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>

        {/* Logo */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <svg
            width="44"
            height="44"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
            <rect x="12" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
            <rect x="18" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
            <rect x="24" y="3" width="3.5" height="42" rx="1.75" fill="#3B6FFF" />
            <rect x="30" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
            <rect x="36" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
            <rect x="42" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
          </svg>
          <span
            className="text-3xl font-bold tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #a8b4ff 50%, #7C3FFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            ringa
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-4xl font-bold">Terms of Service</h1>
        <p className="mb-12 text-center text-gray-400">
          Effective Date: April 2, 2026 | Last Updated: April 2, 2026
        </p>

        {/* Content */}
        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Ringa platform ("Service"), operated by
              De Faria Ventures LLC ("Company," "we," "us," or "our"), you agree
              to be bound by these Terms of Service ("Terms"). If you do not
              agree to these Terms, you may not access or use the Service.
            </p>
            <p className="mt-2">
              These Terms apply to all users of the Service, including HVAC
              company owners, administrators, and any other individuals
              authorized to use the platform on behalf of a subscribing company.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              2. Description of Service
            </h2>
            <p>
              Ringa provides an AI-powered phone agent software-as-a-service
              (SaaS) platform designed for HVAC companies. The Service includes,
              but is not limited to:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                AI phone agent that answers incoming calls on behalf of your
                business
              </li>
              <li>Automated appointment booking and scheduling</li>
              <li>Call handling, routing, and after-hours support</li>
              <li>
                Integration with third-party scheduling and CRM platforms
              </li>
              <li>Dashboard for managing calls, appointments, and settings</li>
              <li>Call recording and transcript storage</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              3. Account Registration and Responsibilities
            </h2>
            <p>
              To use the Service, you must create an account by providing
              accurate and complete information, including your company name,
              email address, and other requested details. You are responsible
              for:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activity that occurs under your account</li>
              <li>
                Ensuring that all information provided to us remains accurate
                and up to date
              </li>
              <li>
                Notifying us immediately of any unauthorized use of your account
              </li>
            </ul>
            <p className="mt-3">
              You must be at least 18 years of age and have the legal authority
              to bind the company you represent to these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              4. Subscription and Billing
            </h2>
            <p>
              Ringa operates on a subscription-based billing model. By
              subscribing to a plan, you agree to the following:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Subscriptions are billed on a monthly basis unless otherwise
                specified
              </li>
              <li>
                Your subscription will automatically renew at the end of each
                billing cycle unless you cancel before the renewal date
              </li>
              <li>
                All fees are non-refundable unless otherwise required by
                applicable law
              </li>
              <li>
                We reserve the right to change pricing with at least 30 days
                prior notice
              </li>
              <li>
                You are responsible for providing valid and up-to-date payment
                information
              </li>
              <li>
                Failure to pay may result in suspension or termination of your
                account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              5. Third-Party Integrations
            </h2>
            <p>
              The Service relies on and integrates with various third-party
              services to deliver its functionality. These include, but are not
              limited to:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                <strong className="text-white">Twilio</strong> -- for telephony,
                phone number provisioning, and call routing
              </li>
              <li>
                <strong className="text-white">Vapi</strong> -- for AI voice
                agent orchestration
              </li>
              <li>
                <strong className="text-white">ElevenLabs</strong> -- for
                text-to-speech voice synthesis
              </li>
              <li>
                <strong className="text-white">Jobber</strong> -- for field
                service management integration
              </li>
              <li>
                <strong className="text-white">Google Calendar</strong> -- for
                appointment scheduling and calendar synchronization
              </li>
            </ul>
            <p className="mt-3">
              Your use of these third-party services is subject to their
              respective terms of service and privacy policies. We are not
              responsible for the availability, accuracy, or conduct of any
              third-party service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              6. Data Handling and Call Recordings
            </h2>
            <p>
              As part of the Service, phone calls handled by the AI agent may be
              recorded and stored. By using the Service, you acknowledge and
              agree that:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Calls may be recorded for quality assurance, training, and
                service improvement purposes
              </li>
              <li>
                Call recordings and transcripts may be stored and accessible
                through your dashboard
              </li>
              <li>
                You are responsible for complying with all applicable federal,
                state, and local laws regarding call recording and consent in
                your jurisdiction
              </li>
              <li>
                You agree to inform your callers that calls may be recorded
                where required by law
              </li>
            </ul>
            <p className="mt-3">
              For more details on how we handle your data, please refer to our{" "}
              <Link href="/privacy" className="text-blue-400 underline hover:text-blue-300">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              7. Acceptable Use
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Violate any applicable local, state, national, or international
                law or regulation
              </li>
              <li>
                Transmit any content that is unlawful, harmful, threatening,
                abusive, harassing, defamatory, or otherwise objectionable
              </li>
              <li>
                Attempt to interfere with, compromise, or disrupt the Service or
                its infrastructure
              </li>
              <li>
                Use the Service for any purpose other than its intended use as
                an HVAC business communication tool
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any aspect of the
                Service
              </li>
              <li>
                Resell, sublicense, or redistribute the Service without our
                prior written consent
              </li>
              <li>
                Use the Service to make unsolicited calls, spam, or engage in
                robocalling
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate your account if we
              determine, in our sole discretion, that you have violated these
              acceptable use terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              8. Intellectual Property
            </h2>
            <p>
              The Service, including all software, content, design, logos,
              trademarks, and other intellectual property, is owned by De Faria
              Ventures LLC and is protected by applicable intellectual property
              laws. You are granted a limited, non-exclusive, non-transferable
              license to use the Service solely for its intended purpose during
              your active subscription.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, De Faria
              Ventures LLC and its officers, directors, employees, and agents
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to
              loss of profits, data, business opportunities, or goodwill,
              arising out of or in connection with your use of the Service.
            </p>
            <p className="mt-3">
              Our total liability to you for any claims arising from your use of
              the Service shall not exceed the total amount you paid to us in
              the twelve (12) months preceding the claim.
            </p>
            <p className="mt-3">
              The Service is provided "as is" and "as available" without
              warranties of any kind, whether express or implied, including but
              not limited to implied warranties of merchantability, fitness for
              a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              10. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless De Faria
              Ventures LLC and its affiliates, officers, directors, employees,
              and agents from and against any and all claims, liabilities,
              damages, losses, and expenses (including reasonable attorneys'
              fees) arising out of or related to your use of the Service, your
              violation of these Terms, or your violation of any rights of a
              third party.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              11. Termination
            </h2>
            <p>
              You may cancel your subscription and terminate your account at any
              time through your dashboard settings or by contacting us. We
              reserve the right to suspend or terminate your account at any time
              for any reason, including but not limited to:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Violation of these Terms</li>
              <li>Non-payment of subscription fees</li>
              <li>Fraudulent or illegal activity</li>
              <li>Extended period of inactivity</li>
            </ul>
            <p className="mt-3">
              Upon termination, your right to use the Service will immediately
              cease. We may retain certain data as required by law or for
              legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              12. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make
              material changes, we will notify you by email or through a
              prominent notice on the Service at least 30 days before the
              changes take effect. Your continued use of the Service after the
              effective date of any modifications constitutes your acceptance of
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              13. Governing Law and Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the State of Florida, without regard to its conflict
              of law provisions. Any disputes arising out of or relating to
              these Terms or the Service shall be resolved exclusively in the
              state or federal courts located in Orange County, Florida.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              14. Severability
            </h2>
            <p>
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision shall be limited or eliminated to the
              minimum extent necessary, and the remaining provisions shall
              remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              15. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="mt-3">
              <p>
                <strong className="text-white">De Faria Ventures LLC</strong>
              </p>
              <p>Orlando, FL</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:hello@ringa.ai"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  hello@ringa.ai
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://hvac-agent-dashboard.vercel.app"
                  className="text-blue-400 underline hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hvac-agent-dashboard.vercel.app
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>Ringa is a product operated by De Faria Ventures LLC, a Florida limited liability company.</p>
        </div>
      </div>
    </div>
  );
}
