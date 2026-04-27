import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

const SITE_NAME = 'Attack on Titan Revolution Wiki'
const SITE_URL = 'https://attack-on-titan-revolution.wiki'
const UPDATED_AT = 'April 27, 2026'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, '')
  const path = '/terms-of-service'
  const title = `Terms of Service - ${SITE_NAME}`
  const description = `Read the Terms of Service for ${SITE_NAME}, an unofficial Attack on Titan Revolution Roblox wiki.`
  const imageUrl = `${siteUrl}/images/hero.webp`

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1920,
          height: 1080,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Terms and conditions for using {SITE_NAME}
          </p>
          <p className="text-slate-400 text-sm">
            Last Updated: {UPDATED_AT}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using {SITE_NAME}, you agree to these Terms of Service. If you do not agree, do not use
              this website.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made resource website for the Roblox game Attack on Titan Revolution. We
              publish informational guides, codes coverage, family and perk references, raid and titan guides, build
              ideas, update notes, and related community resources.
            </p>
            <p>
              We are not the developer or operator of Attack on Titan Revolution, Roblox, Discord, Trello, or YouTube.
              Access to those third-party services is controlled by their respective owners.
            </p>

            <h2>3. Acceptable Use</h2>
            <p>You agree not to use this website to:</p>
            <ul>
              <li>Violate any applicable law, regulation, platform rule, or third-party right.</li>
              <li>Upload, transmit, or distribute malware, spam, scraping abuse, or disruptive automated traffic.</li>
              <li>Interfere with site security, hosting infrastructure, analytics, advertising, or normal operation.</li>
              <li>Misrepresent your identity or imply affiliation with {SITE_NAME}, Roblox, AoTR [PI], or rights holders.</li>
              <li>Copy, republish, or resell substantial portions of our original content without permission.</li>
            </ul>

            <h2>4. Content Accuracy</h2>
            <p>
              We try to keep Attack on Titan Revolution information accurate, but Roblox games change frequently. Codes,
              family buffs, perks, raid rewards, titan mechanics, update details, and player statistics can change
              without notice. Use the site as an informational guide, not as a guaranteed source of live game data.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              Original text, organization, and site features on {SITE_NAME} are protected by copyright and other laws.
              Game names, character references, screenshots, logos, platform names, and trademarks belong to their
              respective owners. We use such materials for commentary, education, reference, and fan community purposes.
            </p>

            <h2>6. External Links</h2>
            <p>
              This website may link to the official Roblox page, Roblox group, Discord server, Trello board, YouTube
              video, and other third-party resources. We do not control those services and are not responsible for their
              content, availability, safety, or policies.
            </p>

            <h2>7. Advertising and Analytics</h2>
            <p>
              We may use analytics and advertising services to support the site. Those providers may process limited
              technical data according to their own terms and privacy policies.
            </p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The website is provided "as is" and "as available" without warranties of any kind. We do not guarantee
              uninterrupted access, error-free content, code availability, raid reward accuracy, or compatibility with
              any particular device or browser.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {SITE_NAME} and its contributors will not be liable for indirect,
              incidental, special, consequential, or punitive damages arising from your use of the website or reliance on
              its content.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service at any time. Continued use of the website after updates means you
              accept the revised terms.
            </p>

            <h2>11. Contact</h2>
            <p>
              For legal questions, contact us at{' '}
              <a href="mailto:legal@attack-on-titan-revolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                legal@attack-on-titan-revolution.wiki
              </a>.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            <span aria-hidden="true">&larr;</span> Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
