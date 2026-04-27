import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

const SITE_NAME = 'Attack on Titan Revolution Wiki'
const GAME_NAME = 'Attack on Titan Revolution'
const SITE_URL = 'https://attack-on-titan-revolution.wiki'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, '')
  const path = '/about'
  const title = `About ${SITE_NAME}`
  const description = `Learn about ${SITE_NAME}, an unofficial Roblox resource hub for Attack on Titan Revolution codes, families, perks, raids, titans, builds, and updates.`
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

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About {SITE_NAME}
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            A focused Roblox resource hub for {GAME_NAME}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome</h2>
            <p>
              {SITE_NAME} is an unofficial, fan-made website built to help Roblox players understand and progress in{' '}
              {GAME_NAME}. The site focuses on the topics players search for most: working codes, families, perks,
              raids, titans, titan shifters, builds, progression routes, and update coverage.
            </p>
            <p>
              Our goal is to make practical information easier to scan, compare, and revisit while the game continues
              to evolve through new updates and balance changes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>What We Cover</h2>
            <ul>
              <li><strong>Codes:</strong> Working rewards, expired codes, redemption steps, and common redeem issues.</li>
              <li><strong>Families and perks:</strong> Buffs, reroll priorities, rarity context, and practical recommendations.</li>
              <li><strong>Raids and titans:</strong> Boss mechanics, shifter rewards, keys, drops, and team preparation.</li>
              <li><strong>Builds:</strong> Family, perk, skill tree, and artifact combinations for different playstyles.</li>
              <li><strong>Progression:</strong> Leveling, prestige, missions, gold, XP, and update-driven route changes.</li>
              <li><strong>Updates:</strong> Patch notes, new systems, balance changes, and player-facing summaries.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Editorial Approach</h2>
            <p>
              We prioritize clear explanations, source-aware updates, and practical player decisions over generic
              summaries. When possible, we align pages with official Roblox, Discord, and Trello information, then
              explain what it means for players in normal gameplay.
            </p>
            <p>
              Player statistics, code availability, raid rewards, and update details can change quickly. Pages should be
              treated as living references rather than permanent official records.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Unofficial Fan Site</h2>
            <p>
              {SITE_NAME} is not affiliated with, endorsed by, or sponsored by Roblox, AoTR [PI], Kodansha, Hajime
              Isayama, or any Attack on Titan rights holders. All game names, platform names, trademarks, and assets
              belong to their respective owners.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Contact</h2>
            <p>
              General inquiries:{' '}
              <a href="mailto:contact@attack-on-titan-revolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                contact@attack-on-titan-revolution.wiki
              </a>
              <br />
              Corrections and contributions:{' '}
              <a href="mailto:contribute@attack-on-titan-revolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                contribute@attack-on-titan-revolution.wiki
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
