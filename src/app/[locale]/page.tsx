import { getLatestArticles } from '@/lib/getLatestArticles'
import type { Language } from '@/lib/content'
import type { Locale } from '@/i18n/routing'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const SITE_NAME = 'Attack on Titan Revolution Wiki'
const GAME_NAME = 'Attack on Titan Revolution'
const META_TITLE = 'Attack on Titan Revolution Wiki - Codes, Families & Raids'
const META_DESCRIPTION = 'Attack on Titan Revolution Wiki with working codes, family buffs, perks, raids, titan shifters, builds, updates, and Roblox progression guides.'
const OFFICIAL_LINKS = {
  roblox: 'https://www.roblox.com/games/13379208636/Attack-on-Titan-Revolution',
  robloxGroup: 'https://www.roblox.com/communities/17347863/AoTR-PI',
  discord: 'https://discord.com/invite/aotrevolution',
  trello: 'https://trello.com/b/4n9qqtdW/attack-on-titan-revolution',
  youtube: 'https://www.youtube.com/watch?v=Lso55IMLgu8',
  x: 'https://x.com/_EvolutionPower',
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://attack-on-titan-revolution.wiki').replace(/\/$/, '')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const heroImageUrl = new URL('/images/hero.webp', siteUrl).toString()

  return {
    metadataBase: new URL(siteUrl),
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`,
      siteName: SITE_NAME,
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [
        {
          url: heroImageUrl,
          width: 1920,
          height: 1080,
          alt: `${GAME_NAME} Roblox titan battle hero image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [heroImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const heroImageUrl = new URL('/images/hero.webp', siteUrl).toString()
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": SITE_NAME,
        "description": META_DESCRIPTION,
        "image": {
          "@type": "ImageObject",
          "url": heroImageUrl,
          "width": 1920,
          "height": 1080,
          "caption": `${SITE_NAME} hero image`,
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": SITE_NAME,
        "alternateName": GAME_NAME,
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/android-chrome-512x512.png`,
          "width": 512,
          "height": 512,
        },
        "image": {
          "@type": "ImageObject",
          "url": heroImageUrl,
          "width": 1920,
          "height": 1080,
        },
        "sameAs": Object.values(OFFICIAL_LINKS),
      },
      {
        '@type': 'VideoGame',
        name: GAME_NAME,
        url: OFFICIAL_LINKS.roblox,
        gamePlatform: ['Roblox'],
        applicationCategory: 'Game',
        genre: ['Action RPG', 'Anime', 'Roblox', 'Titan Battle'],
        publisher: {
          '@type': 'Organization',
          name: 'AoTR [PI]',
          url: OFFICIAL_LINKS.robloxGroup,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: OFFICIAL_LINKS.roblox,
        },
      },
      {
        '@type': 'VideoObject',
        name: '[TRAILER] Attack on Titan: Revolution',
        description: 'Official trailer video for Attack on Titan Revolution on Roblox.',
        thumbnailUrl: heroImageUrl,
        embedUrl: 'https://www.youtube.com/embed/Lso55IMLgu8',
        url: OFFICIAL_LINKS.youtube,
      },
    ],
  }

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient latestArticles={latestArticles} locale={locale} />
    </>
  )
}
