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
  const path = '/privacy-policy'
  const title = `Privacy Policy - ${SITE_NAME}`
  const description = `${SITE_NAME} Privacy Policy. Learn how we collect, use, and protect data while you use this Roblox game wiki.`
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            How {SITE_NAME} collects, uses, and protects information
          </p>
          <p className="text-slate-400 text-sm">
            Last Updated: {UPDATED_AT}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made resource for Attack on Titan Revolution on Roblox. We collect only
              the limited information needed to operate, secure, and improve this website.
            </p>
            <ul>
              <li><strong>Usage data:</strong> Browser type, device type, approximate location, pages viewed, referrers, and interaction events.</li>
              <li><strong>Preferences:</strong> Language, theme, and similar local preferences stored in your browser.</li>
              <li><strong>Technical data:</strong> IP address, user agent, diagnostic logs, and basic security signals used to prevent abuse.</li>
              <li><strong>Voluntary contact:</strong> Information you send when contacting us by email.</li>
            </ul>

            <h2>2. How We Use Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain Attack on Titan Revolution guides, codes, family, perk, raid, titan, build, and update resources.</li>
              <li>Understand which pages are useful to players and improve content quality.</li>
              <li>Monitor performance, diagnose technical issues, and protect the site from spam or abuse.</li>
              <li>Remember basic display preferences such as language and theme.</li>
              <li>Respond to legitimate privacy, support, or legal requests.</li>
            </ul>

            <h2>3. Cookies and Analytics</h2>
            <p>
              We may use cookies, local storage, and privacy-conscious analytics tools to understand aggregate site
              usage. Analytics data helps us improve the site and is not used to sell personal information.
            </p>
            <p>
              You can disable cookies in your browser settings. Some site preferences may not work correctly if cookies
              or local storage are blocked.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              This website may link to Roblox, Discord, Trello, YouTube, analytics providers, hosting providers, and
              advertising networks. Those services are governed by their own privacy policies. We are not responsible
              for the practices of third-party websites.
            </p>

            <h2>5. Advertising</h2>
            <p>
              We may display ads through third-party ad networks. Advertising partners may use cookies or similar
              technologies to measure ad performance and prevent fraud. You can manage ad personalization through your
              browser or platform privacy settings where available.
            </p>

            <h2>6. Children's Privacy</h2>
            <p>
              This website is intended for a general gaming audience. We do not knowingly collect personal information
              from children under 13. If you believe a child has provided personal information, contact us and we will
              take appropriate steps to remove it.
            </p>

            <h2>7. Data Retention and Security</h2>
            <p>
              We retain information only as long as needed for the purposes described above, unless a longer period is
              required by law. We use reasonable safeguards, but no internet service can guarantee absolute security.
            </p>

            <h2>8. Your Choices</h2>
            <p>
              Depending on your location, you may have rights to request access, correction, deletion, or restriction of
              certain information. You may also opt out of analytics by blocking cookies or using browser privacy tools.
            </p>

            <h2>9. Unofficial Fan Site Disclaimer</h2>
            <p>
              {SITE_NAME} is not affiliated with, endorsed by, or sponsored by Roblox, AoTR [PI], Kodansha, Hajime
              Isayama, or any Attack on Titan rights holders. Game names, trademarks, and assets belong to their
              respective owners.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy as our website, legal requirements, or third-party services change. The
              updated date at the top of this page will reflect the latest revision.
            </p>

            <h2>11. Contact</h2>
            <p>
              For privacy questions or requests, contact us at{' '}
              <a href="mailto:privacy@attack-on-titan-revolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                privacy@attack-on-titan-revolution.wiki
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
