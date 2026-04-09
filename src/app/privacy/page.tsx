import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Ringa",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="mb-2 text-center text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-12 text-center text-gray-400">
          Effective Date: April 2, 2026 | Last Updated: April 2, 2026
        </p>

        {/* Content */}
        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              1. Introduction
            </h2>
            <p>
              De Faria Ventures LLC ("Company," "we," "us," or "our") operates
              the Ringa platform ("Service"), an AI-powered phone agent SaaS for
              HVAC companies. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our Service.
            </p>
            <p className="mt-2">
              By using the Service, you consent to the data practices described
              in this Privacy Policy. If you do not agree with the terms of this
              Privacy Policy, please do not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              2. Information We Collect
            </h2>
            <p>
              We collect information in several ways when you use the Service:
            </p>

            <h3 className="mt-4 mb-2 text-lg font-medium text-white">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Company information (name, email address, phone number)
              </li>
              <li>Account credentials (email and password)</li>
              <li>
                Business configuration details (business hours, service fees,
                agent name, language preferences)
              </li>
              <li>
                Payment and billing information (processed through our
                third-party payment processor)
              </li>
              <li>
                Integration credentials (Google Calendar, Jobber API keys)
              </li>
            </ul>

            <h3 className="mt-4 mb-2 text-lg font-medium text-white">
              2.2 Information Collected Through the Service
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Phone call recordings and transcripts from calls handled by the
                AI agent
              </li>
              <li>
                Caller information (phone numbers, names provided during calls)
              </li>
              <li>
                Appointment details (dates, times, service types, customer
                addresses)
              </li>
              <li>Call metadata (duration, timestamps, call outcomes)</li>
              <li>AI agent conversation logs</li>
            </ul>

            <h3 className="mt-4 mb-2 text-lg font-medium text-white">
              2.3 Automatically Collected Information
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Device and browser information (IP address, browser type,
                operating system)
              </li>
              <li>Usage data (pages visited, features used, session duration)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process and manage your subscription and billing</li>
              <li>
                Handle incoming phone calls through the AI agent on your behalf
              </li>
              <li>
                Book and manage appointments with your customers
              </li>
              <li>
                Improve and optimize the AI agent performance and accuracy
              </li>
              <li>
                Send you important notifications about your account, calls, and
                appointments
              </li>
              <li>Provide customer support</li>
              <li>
                Detect, prevent, and address technical issues or security
                threats
              </li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              4. Third-Party Services
            </h2>
            <p>
              We use the following third-party services to deliver the Service.
              Each of these services may collect and process data according to
              their own privacy policies:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-white">Twilio</strong> -- Provides
                telephony infrastructure, phone number provisioning, and call
                routing. Twilio may process caller phone numbers, call
                recordings, and call metadata.
              </li>
              <li>
                <strong className="text-white">Vapi</strong> -- Powers the AI
                voice agent orchestration. Vapi processes call audio and
                conversation data to deliver AI-driven phone interactions.
              </li>
              <li>
                <strong className="text-white">ElevenLabs</strong> -- Provides
                text-to-speech voice synthesis for the AI agent. ElevenLabs
                processes text data to generate natural-sounding speech.
              </li>
              <li>
                <strong className="text-white">Google Calendar</strong> --
                Used for appointment scheduling and calendar synchronization
                when you connect your Google Calendar account.
              </li>
              <li>
                <strong className="text-white">Jobber</strong> -- Used for
                field service management integration when you connect your
                Jobber account.
              </li>
              <li>
                <strong className="text-white">Stripe</strong> -- Processes
                payment information for subscription billing. We do not store
                your full credit card information on our servers.
              </li>
            </ul>
            <p className="mt-3">
              We encourage you to review the privacy policies of these
              third-party services before using the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              5. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide you the Service. Specifically:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Account information is retained for the duration of your
                subscription and for a reasonable period after account
                termination
              </li>
              <li>
                Call recordings and transcripts are retained for up to 12 months
                from the date of the call, unless you request earlier deletion
              </li>
              <li>
                Appointment and customer data is retained for the duration of
                your subscription
              </li>
              <li>
                Billing records are retained as required by applicable tax and
                accounting laws
              </li>
            </ul>
            <p className="mt-3">
              After account termination, we may retain certain data as required
              by law or for legitimate business purposes such as resolving
              disputes and enforcing our agreements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              6. Security Measures
            </h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your information, including:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Encryption of data in transit using TLS/SSL</li>
              <li>Secure password hashing and storage</li>
              <li>
                Access controls limiting who can view and manage your data
              </li>
              <li>Regular security assessments and updates</li>
              <li>
                Secure hosting infrastructure through reputable cloud providers
              </li>
            </ul>
            <p className="mt-3">
              While we strive to use commercially acceptable means to protect
              your information, no method of electronic transmission or storage
              is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              7. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                <strong className="text-white">Access</strong> -- Request a copy
                of the personal information we hold about you
              </li>
              <li>
                <strong className="text-white">Correction</strong> -- Request
                that we correct any inaccurate or incomplete information
              </li>
              <li>
                <strong className="text-white">Deletion</strong> -- Request that
                we delete your personal information, subject to certain legal
                exceptions
              </li>
              <li>
                <strong className="text-white">Portability</strong> -- Request a
                copy of your data in a structured, machine-readable format
              </li>
              <li>
                <strong className="text-white">Objection</strong> -- Object to
                the processing of your personal information in certain
                circumstances
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the
              information provided below. We will respond to your request within
              a reasonable timeframe and in accordance with applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              8. Sharing of Information
            </h2>
            <p>
              We do not sell your personal information to third parties. We may
              share your information in the following circumstances:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                With the third-party service providers listed in Section 4, as
                necessary to deliver the Service
              </li>
              <li>
                To comply with legal obligations, court orders, or governmental
                requests
              </li>
              <li>
                To protect the rights, property, or safety of De Faria Ventures
                LLC, our users, or the public
              </li>
              <li>
                In connection with a merger, acquisition, or sale of all or a
                portion of our assets, in which case you will be notified of any
                change in ownership or use of your information
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              9. Children&#39;s Privacy
            </h2>
            <p>
              The Service is not intended for use by individuals under the age
              of 18. We do not knowingly collect personal information from
              children under 18. If we become aware that we have collected
              personal information from a child under 18, we will take steps to
              delete that information promptly. If you believe a child under 18
              has provided us with personal information, please contact us
              immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              10. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to enhance your
              experience on the Service. These may include:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                <strong className="text-white">Essential cookies</strong> --
                Required for the Service to function properly, including
                authentication tokens
              </li>
              <li>
                <strong className="text-white">Analytics cookies</strong> --
                Help us understand how users interact with the Service so we can
                improve it
              </li>
            </ul>
            <p className="mt-3">
              You can manage cookie preferences through your browser settings.
              Note that disabling certain cookies may impact the functionality
              of the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you by email or through a
              prominent notice on the Service at least 30 days before the
              changes take effect. The "Last Updated" date at the top of this
              page indicates when this Privacy Policy was last revised.
            </p>
            <p className="mt-2">
              Your continued use of the Service after any changes to this
              Privacy Policy constitutes your acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              12. Contact Information
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us:
            </p>
            <div className="mt-3">
              <p>
                <strong className="text-white">De Faria Ventures LLC</strong>
              </p>
              <p>Orlando, FL</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:hello@ringa.live"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  hello@ringa.live
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://ringa.live"
                  className="text-blue-400 underline hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ringa.live
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
