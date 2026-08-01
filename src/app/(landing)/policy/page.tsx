import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/src/client/components/global/layout/Container';
import { Logo } from '@/src/client/components/global/Logo/Logo';

import styles from './PolicyPage.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for SideQuestHQ, including data collection, use, sharing, retention, deletion, children, and contact information.',
};

const effectiveDate = 'August 1, 2026';

const sections = [
  {
    id: 'scope',
    title: '1. Scope of this policy',
    body: [
      'This Privacy Policy explains how SideQuestHQ collects, uses, discloses, protects, and retains information when you use our website, mobile application, learning feeds, cohort features, account features, import tools, and related services.',
      'By using SideQuestHQ, you agree that your information will be handled as described here. If you do not agree with this policy, please do not use the service.',
    ],
  },
  {
    id: 'information-we-collect',
    title: '2. Information we collect',
    body: [
      'Account information: name, username, email address, authentication identifiers, profile details, avatar choices, and preferences you provide when creating or managing an account.',
      'Learning activity: cohorts you join or create, lessons you view, notes, bookmarks, progress, streaks, completion state, imported links, playlists, roadmaps, curriculum prompts, and other learning interactions needed to operate the app.',
      'Content you submit: messages, feedback, support requests, cohort descriptions, comments, files, URLs, and other materials you choose to add to SideQuestHQ.',
      'Device and usage information: device type, operating system, browser, app version, IP address, approximate location derived from IP address, pages or screens viewed, referring pages, crash logs, diagnostics, performance data, and timestamps.',
      'Third-party sign-in or import information: if you connect a third-party account or import content from services such as Google, YouTube, GitHub, Apple, or other providers, we receive the information authorized by you and the provider, such as account identifiers, profile information, and imported content metadata.',
      'Payment information: if paid features are offered, payments may be processed by app stores or payment processors. We do not intentionally store full payment card numbers, but may receive transaction identifiers, subscription status, receipts, billing region, and purchase history needed for entitlement and support.',
    ],
  },
  {
    id: 'how-we-use-information',
    title: '3. How we use information',
    body: [
      'We use information to create and secure accounts, authenticate users, provide personalized learning journeys, generate learning feeds, track progress, synchronize data across devices, operate cohorts, and deliver core app functionality.',
      'We also use information to personalize recommendations, improve curriculum quality, troubleshoot issues, provide customer support, send service notices, prevent abuse, enforce our terms, maintain safety, comply with law, and understand aggregated product performance.',
      'When AI-assisted features are used, submitted prompts, imported resources, learning goals, and related context may be processed to generate summaries, lesson plans, quizzes, recommendations, or other educational outputs. Do not submit sensitive personal information unless it is necessary for your learning use case.',
    ],
  },
  {
    id: 'legal-bases',
    title: '4. Legal bases for processing',
    body: [
      'Where applicable law requires a legal basis, we process personal information to perform our contract with you, with your consent, to comply with legal obligations, and for legitimate interests such as service security, product improvement, fraud prevention, analytics, and support.',
      'You may withdraw consent where processing is based on consent, but this will not affect processing that occurred before withdrawal or processing that is necessary for another lawful basis.',
    ],
  },
  {
    id: 'sharing',
    title: '5. How we share information',
    body: [
      'Service providers: we may share information with vendors that help us host infrastructure, store data, send email, provide analytics, monitor performance, process payments, detect abuse, provide authentication, and deliver AI-assisted features.',
      'User-directed sharing: information you choose to post in cohorts, profiles, messages, shared roadmaps, or collaborative spaces may be visible to other users according to the feature settings.',
      'Legal and safety reasons: we may disclose information if we believe it is necessary to comply with law, respond to lawful requests, protect users, prevent fraud or abuse, investigate security incidents, or defend our rights.',
      'Business transfers: if SideQuestHQ is involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be transferred as part of that transaction, subject to appropriate safeguards.',
      'We do not sell personal information for money. We do not knowingly share personal information for cross-context behavioral advertising unless disclosed and permitted by applicable law and app store policy.',
    ],
  },
  {
    id: 'permissions',
    title: '6. App permissions and platform data',
    body: [
      'SideQuestHQ only requests permissions that are needed for app functionality. Depending on the platform and features you use, permissions may include internet access, notifications, file or media selection for uploads, camera access for profile or content features, and account sign-in through platform providers.',
      'You can manage permissions in your device settings. Disabling a permission may limit related features but should not prevent access to unrelated parts of the app.',
    ],
  },
  {
    id: 'cookies',
    title: '7. Cookies, local storage, and analytics',
    body: [
      'We may use cookies, local storage, device identifiers, and similar technologies to keep you signed in, remember preferences, secure sessions, measure app performance, understand feature usage, and improve the service.',
      'You can control cookies through browser settings. Some security, session, or preference features may not work correctly if cookies or local storage are disabled.',
    ],
  },
  {
    id: 'retention',
    title: '8. Data retention',
    body: [
      'We keep personal information for as long as needed to provide the service, maintain your account, comply with legal obligations, resolve disputes, enforce agreements, prevent abuse, and maintain backups.',
      'When information is no longer needed, we delete it or de-identify it. Backup copies may persist for a limited period before routine deletion.',
    ],
  },
  {
    id: 'deletion',
    title: '9. Access, correction, and deletion',
    body: [
      'You may request access to, correction of, export of, or deletion of your personal information. You may also request that we close your account or delete learning content associated with your account, subject to legal, security, anti-fraud, and backup retention requirements.',
      'To make a privacy request, contact us using the details at the end of this policy. We may need to verify your identity before completing a request.',
    ],
  },
  {
    id: 'children',
    title: '10. Children and families',
    body: [
      'SideQuestHQ is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you are under the age required by your country or platform rules to use online services, you may use SideQuestHQ only with appropriate parent or guardian consent.',
      'If you believe a child provided personal information without required consent, contact us and we will take appropriate steps to delete the information.',
    ],
  },
  {
    id: 'security',
    title: '11. Security',
    body: [
      'We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. No online service can guarantee absolute security, so you should use a strong password, protect your devices, and notify us if you suspect unauthorized access.',
    ],
  },
  {
    id: 'international',
    title: '12. International transfers',
    body: [
      'SideQuestHQ may process and store information in the United States and other countries where we or our service providers operate. Privacy laws in those locations may differ from the laws where you live. Where required, we use appropriate safeguards for international transfers.',
    ],
  },
  {
    id: 'regional-rights',
    title: '13. Regional privacy rights',
    body: [
      'Depending on where you live, you may have rights to know what personal information we collect, access or delete information, correct inaccurate information, receive a portable copy, restrict or object to processing, withdraw consent, appeal a decision, or lodge a complaint with a regulator.',
      'We will not discriminate against you for exercising privacy rights. Some features may be unavailable if the requested change prevents us from providing the service.',
    ],
  },
  {
    id: 'third-party-links',
    title: '14. Third-party links and content',
    body: [
      'SideQuestHQ may let you save, import, or open content from third-party sites and services. Those services are governed by their own terms and privacy policies. We are not responsible for the privacy practices of third parties.',
    ],
  },
  {
    id: 'changes',
    title: '15. Changes to this policy',
    body: [
      'We may update this Privacy Policy as our service, legal obligations, or platform requirements change. If changes are material, we will provide notice through the app, website, email, or another reasonable method. The updated policy will show a new effective date.',
    ],
  },
];

export default function PolicyPage() {
  return (
    <main className={styles.page}>
      <Container size="reading">
        <header className={styles.header}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="SideQuestHQ home"
          >
            <Logo />
          </Link>

          <p className={styles.eyebrow}>Privacy Policy</p>
          <h1 className={styles.title}>SideQuestHQ Privacy Policy</h1>
          <p className={styles.lead}>
            A clear, practical explanation of what we collect, why we collect it, how we protect it,
            and how you can control your information.
          </p>
          <p className={styles.effectiveDate}>Effective date: {effectiveDate}</p>
        </header>

        <section
          className={styles.notice}
          aria-labelledby="plain-language-summary"
        >
          <h2 id="plain-language-summary">Plain-language summary</h2>
          <ul>
            <li>
              We collect information needed to run learning accounts, cohorts, progress, imports,
              and recommendations.
            </li>
            <li>
              We use data to provide and improve SideQuestHQ, keep the service secure, and support
              you.
            </li>
            <li>We do not sell personal information for money.</li>
            <li>You can ask to access, correct, export, or delete your information.</li>
            <li>
              This page is intended to satisfy app store privacy-policy requirements for
              SideQuestHQ.
            </li>
          </ul>
        </section>

        <nav
          className={styles.toc}
          aria-label="Policy sections"
        >
          <h2>Contents</h2>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title.replace(/^\d+\.\s/, '')}</a>
              </li>
            ))}
            <li>
              <a href="#contact">Contact us</a>
            </li>
          </ol>
        </nav>

        <div className={styles.content}>
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
            >
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section
            id="contact"
            className={styles.section}
          >
            <h2>16. Contact us</h2>
            <p>
              If you have questions, requests, or concerns about this Privacy Policy or SideQuestHQ
              data practices, contact us at{' '}
              <a href="mailto:privacy@sidequesthq.com">privacy@sidequesthq.com</a>.
            </p>
            <p>
              Please include enough detail for us to understand your request. Do not include highly
              sensitive information in your initial email unless necessary.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
