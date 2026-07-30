"use client";

import { motion } from "framer-motion";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-semibold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-zinc-500">Last Updated: July 1, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-indigo-500 hover:prose-a:text-indigo-600"
        >
          <p className="text-lg mb-8">
            Welcome to Tasma. By accessing or using our website, APIs, or software provided in connection with the service, you signify that you have read, understood, and agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl mt-12 mb-6">1. Acceptance of Terms</h2>
          <p className="mb-8">
            By creating an account or using Tasma, you agree to these Terms. If you do not agree to these Terms, you may not use our services. If you are accessing the services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
          </p>

          <h2 className="text-2xl mt-12 mb-6">2. Description of Service</h2>
          <p className="mb-8">
            Tasma provides an AI-powered platform for video subtitling, translation, and transcription. We grant you a limited, non-exclusive, non-transferable, and revocable license to use our platform strictly in accordance with these Terms.
          </p>

          <h2 className="text-2xl mt-12 mb-6">3. User Responsibilities & Acceptable Use</h2>
          <p className="mb-4">
            You are responsible for all activity that occurs under your account. You agree not to use the platform to:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>Process content that is illegal, defamatory, or infringes on intellectual property rights.</li>
            <li>Attempt to reverse engineer, decompile, or hack the service or our underlying AI models.</li>
            <li>Use the service to generate spam or unsolicited mass communications.</li>
            <li>Share your account credentials with unauthorized third parties.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">4. Intellectual Property</h2>
          <p className="mb-8">
            You retain all rights to the media files you upload to Tasma. You grant us a limited license to process, store, and display your content solely for the purpose of providing the service to you. Tasma retains all rights, title, and interest in and to the platform, including our proprietary algorithms, software, and branding.
          </p>

          <h2 className="text-2xl mt-12 mb-6">5. Subscription and Billing</h2>
          <p className="mb-8">
            Certain features of Tasma are billed on a subscription basis. You will be billed in advance on a recurring, periodic basis depending on your selected billing cycle. All payments are non-refundable unless otherwise required by law or explicitly stated in a specific guarantee.
          </p>

          <h2 className="text-2xl mt-12 mb-6">6. Limitation of Liability</h2>
          <p className="mb-8">
            To the maximum extent permitted by law, Tasma shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the service.
          </p>

          <h2 className="text-2xl mt-12 mb-6">7. Termination</h2>
          <p className="mb-8">
            We reserve the right to suspend or terminate your account at any time, with or without cause, and with or without notice. Upon termination, your right to use the service will immediately cease, and we may delete your data in accordance with our data retention policies.
          </p>

          <div className="mt-16 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold mb-2 mt-0">Legal Inquiries</h3>
            <p className="mb-0 text-zinc-600 dark:text-zinc-400">
              For any legal questions or notices, please contact our legal team at <a href="mailto:legal@tasma.ai">legal@tasma.ai</a>.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
