"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-semibold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-zinc-500">Effective Date: July 1, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-indigo-500 hover:prose-a:text-indigo-600"
        >
          <p className="text-lg mb-8">
            At Tasma, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our SaaS platform.
          </p>

          <h2 className="text-2xl mt-12 mb-6">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us when you register for an account, subscribe to a newsletter, or otherwise communicate with us. The types of information we may collect include:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, billing information, and any other information you choose to provide.</li>
            <li><strong>Usage Data:</strong> Information about how you use our platform, including features used, time spent, and performance metrics.</li>
            <li><strong>Media Data:</strong> Video and audio files uploaded to our platform for processing. We do not use your proprietary media to train our public models without explicit opt-in consent.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect primarily to provide, maintain, and improve our services. Specific uses include:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>Processing and delivering the subtitling and translation services you request.</li>
            <li>Sending administrative messages, technical notices, and security alerts.</li>
            <li>Responding to your comments, questions, and customer service requests.</li>
            <li>Analyzing trends, usage, and activities in connection with our services to optimize user experience.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">3. Data Storage and Security</h2>
          <p className="mb-8">
            We implement industry-standard security measures, including encryption in transit (TLS) and at rest (AES-256), to protect your personal information and media files. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>

          <h2 className="text-2xl mt-12 mb-6">4. Third-Party Services</h2>
          <p className="mb-8">
            We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, or assist us in analyzing how our service is used (e.g., payment processors like Stripe). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-2xl mt-12 mb-6">5. Your Data Rights</h2>
          <p className="mb-8">
            Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your data. You can manage most of these settings directly from your account dashboard. For data deletion requests, please contact our support team.
          </p>

          <h2 className="text-2xl mt-12 mb-6">6. Changes to This Privacy Policy</h2>
          <p className="mb-8">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically for any changes.
          </p>

          <div className="mt-16 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold mb-2 mt-0">Contact Us</h3>
            <p className="mb-0 text-zinc-600 dark:text-zinc-400">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@tasma.ai">privacy@tasma.ai</a>.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
