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
  const path = '/copyright'
  const title = `Copyright Notice - ${SITE_NAME}`
  const description = `Copyright, fair use, trademark, and DMCA information for ${SITE_NAME}.`
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

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Copyright Notice
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Copyright, fair use, and DMCA information for {SITE_NAME}
          </p>
          <p className="text-slate-400 text-sm">
            Last Updated: {UPDATED_AT}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Site Content</h2>
            <p>
              Copyright 2026 {SITE_NAME}. Unless otherwise noted, original text, page structure, guide organization,
              and site-specific materials created for this website are owned by {SITE_NAME} or its contributors.
            </p>

            <h2>2. Game Assets and Trademarks</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made resource for Attack on Titan Revolution on Roblox. We are not
              affiliated with, endorsed by, or sponsored by Roblox, AoTR [PI], Kodansha, Hajime Isayama, or any Attack
              on Titan rights holders.
            </p>
            <p>
              Attack on Titan Revolution, Roblox, related game names, logos, screenshots, characters, artwork, and
              trademarks are the property of their respective owners. References are used for informational, educational,
              commentary, and fan community purposes.
            </p>

            <h2>3. Fair Use</h2>
            <p>
              We may reference limited game-related names, images, and facts to explain gameplay systems such as codes,
              families, perks, raids, titan shifters, builds, progression, and updates. We believe this use is
              transformative and helps players understand the game without replacing the official Roblox experience.
            </p>

            <h2>4. Permitted Use of Our Content</h2>
            <p>You may:</p>
            <ul>
              <li>Read and share links to our pages for personal, non-commercial use.</li>
              <li>Quote short excerpts with clear attribution and a link back to the relevant page.</li>
              <li>Use our guides for learning, discussion, and community reference.</li>
            </ul>
            <p>You may not:</p>
            <ul>
              <li>Copy substantial portions of our original content into another website, app, or database.</li>
              <li>Remove attribution or claim our original content as your own.</li>
              <li>Use automated scraping to reproduce or resell our site content.</li>
            </ul>

            <h2>5. DMCA Takedown Notices</h2>
            <p>
              If you believe material on this site infringes your copyright, send a DMCA notice with the following
              information:
            </p>
            <ul>
              <li>Your physical or electronic signature.</li>
              <li>Identification of the copyrighted work you claim was infringed.</li>
              <li>Identification of the allegedly infringing material and its location on this website.</li>
              <li>Your contact information, including email address.</li>
              <li>A statement that you have a good faith belief the use is not authorized by the copyright owner, agent, or law.</li>
              <li>A statement that the information in the notice is accurate and that you are authorized to act.</li>
            </ul>

            <h2>6. Counter-Notices</h2>
            <p>
              If you believe your material was removed by mistake or misidentification, you may submit a counter-notice
              with the information required by applicable law.
            </p>

            <h2>7. Copyright Contact</h2>
            <p>
              General copyright questions:{' '}
              <a href="mailto:copyright@attack-on-titan-revolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                copyright@attack-on-titan-revolution.wiki
              </a>
              <br />
              DMCA notices:{' '}
              <a href="mailto:dmca@attack-on-titan-revolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                dmca@attack-on-titan-revolution.wiki
              </a>
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
