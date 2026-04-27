'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Copy,
  ExternalLink,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useMessages } from 'next-intl'
import enMessages from '@/locales/en.json'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-muted/30 border border-border rounded-xl animate-pulse`} />
)

const formatDetailLabel = (label: string) =>
  label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const DetailValue = ({ value }: { value: any }) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null
    }

    if (value.every((item) => typeof item !== 'object' || item === null)) {
      return (
        <ul className="space-y-2">
          {value.map((item) => (
            <li key={String(item)} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
              <span>{String(item)}</span>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {value.map((item, index) => (
          <div key={item?.name || item?.title || item?.phase || index} className="rounded-lg border border-border bg-muted/30 p-4">
            <DetailValue value={item} />
          </div>
        ))}
      </div>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([key, item]) => (
          <div key={key}>
            <p className="text-xs uppercase text-muted-foreground mb-1">{formatDetailLabel(key)}</p>
            <DetailValue value={item} />
          </div>
        ))}
      </div>
    )
  }

  return <p className="text-sm text-muted-foreground">{String(value)}</p>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  locale: string
}

export default function HomePageClient({ latestArticles, locale }: HomePageClientProps) {
  const rawMessages = useMessages() as any
  const hasCurrentToolCards =
    Array.isArray(rawMessages.tools?.cards) &&
    rawMessages.tools.cards.length >= 8 &&
    rawMessages.tools.cards.every((card: any) => card?.title?.includes('Attack on Titan Revolution'))
  const t = hasCurrentToolCards
    ? rawMessages
    : {
        ...rawMessages,
        faq: enMessages.faq,
        tools: enMessages.tools,
        modules: {
          ...rawMessages.modules,
          ...enMessages.modules,
        },
      }
  const officialLinks = {
    roblox: 'https://www.roblox.com/games/13379208636/Attack-on-Titan-Revolution',
    robloxGroup: 'https://www.roblox.com/communities/17347863/AoTR-PI',
    discord: 'https://discord.com/invite/aotrevolution',
    trello: 'https://trello.com/b/4n9qqtdW/attack-on-titan-revolution',
    youtube: 'https://www.youtube.com/watch?v=Lso55IMLgu8',
  }

  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const codesModule = t.modules.attackOnTitanRevolutionCodes
  const officialLinksModule = t.modules.attackOnTitanRevolutionOfficialLinks
  const beginnerModule = t.modules.attackOnTitanRevolutionBeginnerGuide
  const familyModule = t.modules.attackOnTitanRevolutionFamilyTierList
  const perksModule = t.modules.attackOnTitanRevolutionPerksTierList
  const skillTreeModule = t.modules.attackOnTitanRevolutionSkillTreeGuide
  const prestigeModule = t.modules.attackOnTitanRevolutionPrestigeGuide
  const raidsModule = t.modules.attackOnTitanRevolutionRaidsGuide

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      window.setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current))
      }, 1600)
    } catch {
      setCopiedCode(null)
    }
  }

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={officialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-primary-foreground rounded-lg font-semibold text-lg transition-colors"
              >
                <ClipboardCheck className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href={officialLinks.roblox}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-muted/50 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="Lso55IMLgu8"
              title="[TRAILER] Attack on Titan: Revolution"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <a
              href="#codes"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('codes')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[0].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>

            <a
              href="#trello-discord-links"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('trello-discord-links')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '50ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[1].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>

            <a
              href="#beginner-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('beginner-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[2].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>

            <a
              href="#family-tier-list"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('family-tier-list')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '150ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[3].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>

            <a
              href="#perks-tier-list"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('perks-tier-list')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[4].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[4].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>

            <a
              href="#skill-tree-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('skill-tree-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '250ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[5].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[5].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>

            <a
              href="#prestige-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('prestige-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '300ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[6].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[6].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>

            <a
              href="#raids-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('raids-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '350ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[7].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[7].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Attack on Titan Revolution Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <ClipboardCheck className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{codesModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{codesModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{codesModule.intro}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 mb-10">
            <div className="scroll-reveal space-y-4">
              <h3 className="text-2xl font-bold">{codesModule.workingCodesLabel}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codesModule.workingCodes.map((code: any) => (
                  <div key={code.code} className="p-5 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="font-mono text-xl font-bold text-[hsl(var(--nav-theme-light))]">{code.code}</p>
                        <p className="text-xs text-muted-foreground mt-1">{code.status}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCode(code.code)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                      >
                        {copiedCode === code.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedCode === code.code ? codesModule.copiedLabel : codesModule.copyLabel}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground mb-2">{codesModule.rewardsLabel}</p>
                        <div className="flex flex-wrap gap-2">
                          {code.rewards.map((reward: string) => (
                            <span key={reward} className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground mb-1">{codesModule.requirementsLabel}</p>
                          <p>{code.requirements.join(', ')}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground mb-1">{codesModule.addedLabel}</p>
                          <p>{code.added}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-3 text-sm">
                        <p className="text-xs text-muted-foreground mb-1">{codesModule.bestForLabel}</p>
                        <p>{code.bestFor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="scroll-reveal space-y-4">
              <div className="p-5 bg-card border border-border rounded-xl">
                <h3 className="font-bold text-lg mb-4">{codesModule.redeemLabel}</h3>
                <div className="space-y-4">
                  {codesModule.redeemSteps.map((step: any, index: number) => (
                    <div key={step.title} className="flex gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.12)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-muted/30 border border-border rounded-xl">
                <h3 className="font-bold text-lg mb-3">{codesModule.expiredCodesLabel}</h3>
                <div className="flex flex-wrap gap-2">
                  {codesModule.expiredCodes.map((code: string) => (
                    <span key={code} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Attack on Titan Revolution Official Links */}
      <section id="trello-discord-links" className="scroll-mt-24 px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <MessageCircle className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{officialLinksModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{officialLinksModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{officialLinksModule.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officialLinksModule.links.map((link: any, index: number) => {
              const icons = [ExternalLink, MessageCircle, BookOpen, Star, ClipboardCheck, Sparkles]
              const LinkIcon = icons[index] || ExternalLink

              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.08)] transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                      <LinkIcon className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs">
                      {link.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[hsl(var(--nav-theme-light))] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{link.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {link.bestFor.map((item: string) => (
                      <span key={item} className="rounded-full border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
                    Open link <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 3: Attack on Titan Revolution Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{beginnerModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{beginnerModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{beginnerModule.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6">
            <div className="relative space-y-4">
              <div className="absolute left-6 top-8 bottom-8 w-px bg-[hsl(var(--nav-theme)/0.25)] hidden sm:block" />
              {beginnerModule.steps.map((step: any, index: number) => (
                <div key={step.title} className="relative flex gap-4 rounded-xl border border-border bg-card p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.45)] bg-background text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <span className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs">
                        {step.focus}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {step.keyActions.map((action: string) => (
                        <div key={action} className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                          <Check className="w-4 h-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))] mt-0.5" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.08)] p-6 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-lg">{beginnerModule.tipsLabel}</h3>
              </div>
              <ul className="space-y-3">
                {beginnerModule.quickTips.map((tip: string) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))] mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Module 4: Attack on Titan Revolution Family Tier List */}
      <section id="family-tier-list" className="scroll-mt-24 px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{familyModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{familyModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{familyModule.intro}</p>
          </div>

          <div className="scroll-reveal space-y-6">
            {familyModule.tiers.map((tier: any) => (
              <div key={tier.tier} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr]">
                  <div className="flex md:flex-col items-center justify-center gap-2 bg-[hsl(var(--nav-theme)/0.1)] border-b md:border-b-0 md:border-r border-border p-5">
                    <span className="text-3xl font-bold text-[hsl(var(--nav-theme-light))]">{tier.tier}</span>
                    <span className="text-xs uppercase text-muted-foreground">Tier</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl font-bold mb-2">{tier.label}</h3>
                    <p className="text-muted-foreground mb-5">{tier.description}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {tier.families.map((family: any) => (
                        <article key={family.name} className="rounded-xl border border-border bg-muted/20 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div>
                              <h4 className="text-xl font-bold">{family.name}</h4>
                              <p className="text-sm text-muted-foreground">{family.role}</p>
                            </div>
                            <span className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs text-[hsl(var(--nav-theme-light))]">
                              {family.rarity}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-xs uppercase text-muted-foreground mb-2">{familyModule.strengthsLabel}</p>
                              <div className="flex flex-wrap gap-2">
                                {family.strengths.map((strength: string) => (
                                  <span key={strength} className="rounded-full border border-border bg-card px-2 py-1 text-xs">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {family.skills.length > 0 && (
                              <div>
                                <p className="text-xs uppercase text-muted-foreground mb-2">{familyModule.skillsLabel}</p>
                                <div className="flex flex-wrap gap-2">
                                  {family.skills.map((skill: string) => (
                                    <span key={skill} className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-2 py-1 text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-3 text-sm">
                              <p className="text-xs uppercase text-muted-foreground mb-1">{familyModule.rerollLabel}</p>
                              <p>{family.rerollAdvice}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 5: Attack on Titan Revolution Perks Tier List */}
      <section id="perks-tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{perksModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{perksModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{perksModule.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{perksModule.intro}</p>
          </div>

          <div className="scroll-reveal space-y-6">
            {perksModule.tiers.map((tier: any) => (
              <div key={tier.tier} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[7rem_1fr]">
                  <div className="flex lg:flex-col items-center justify-center gap-2 bg-[hsl(var(--nav-theme)/0.1)] border-b lg:border-b-0 lg:border-r border-border p-5">
                    <span className="text-4xl font-bold text-[hsl(var(--nav-theme-light))]">{tier.tier}</span>
                    <span className="text-xs uppercase text-muted-foreground">{perksModule.tierLabel}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground mb-5">{tier.summary}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {tier.perks.map((perk: any) => (
                        <details key={perk.name} className="group rounded-xl border border-border bg-muted/20 p-5">
                          <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold">{perk.name}</h3>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs text-[hsl(var(--nav-theme-light))]">
                                  {perk.rarity}
                                </span>
                                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                                  {perk.category}
                                </span>
                              </div>
                            </div>
                            <ChevronDown className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                          </summary>

                          <div className="mt-5 space-y-4">
                            <div>
                              <p className="text-xs uppercase text-muted-foreground mb-2">{perksModule.bestForLabel}</p>
                              <div className="flex flex-wrap gap-2">
                                {perk.best_for.map((item: string) => (
                                  <span key={item} className="rounded-full border border-border bg-card px-2 py-1 text-xs">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-lg border border-border bg-card p-4">
                              <p className="text-xs uppercase text-muted-foreground mb-2">{perksModule.whyLabel}</p>
                              <p className="text-sm text-muted-foreground">{perk.why_it_ranks_here}</p>
                            </div>

                            <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                              <p className="text-xs uppercase text-muted-foreground mb-2">{perksModule.recommendedUseLabel}</p>
                              <p className="text-sm">{perk.recommended_use}</p>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Attack on Titan Revolution Skill Tree Guide */}
      <section id="skill-tree-guide" className="scroll-mt-24 px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{skillTreeModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{skillTreeModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{skillTreeModule.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{skillTreeModule.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-5">
            {skillTreeModule.steps.map((step: any) => (
              <article key={step.step} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.1)] text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      {step.tree && (
                        <span className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs text-[hsl(var(--nav-theme-light))]">
                          {step.tree}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.goal}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {Array.isArray(step.details) && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground mb-2">{skillTreeModule.detailsLabel}</p>
                      <DetailValue value={step.details} />
                    </div>
                  )}

                  {step.total_stat_buffs && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground mb-2">{skillTreeModule.statBuffsLabel}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(step.total_stat_buffs).map(([pathName, buffs]) => (
                          <div key={pathName} className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="font-semibold mb-2">{formatDetailLabel(pathName)}</p>
                            <DetailValue value={buffs} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(step.key_skills) && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground mb-2">{skillTreeModule.keySkillsLabel}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {step.key_skills.map((skill: any) => (
                          <div key={`${step.step}-${skill.name}`} className="rounded-lg border border-border bg-muted/30 p-4">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-semibold">{skill.name}</h4>
                              {skill.unlock_level && (
                                <span className="rounded-full border border-border bg-card px-2 py-1 text-xs text-muted-foreground">
                                  Level {skill.unlock_level}
                                </span>
                              )}
                              {skill.family && (
                                <span className="rounded-full border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] px-2 py-1 text-xs">
                                  {skill.family}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{skill.role}</p>
                            <p className="text-sm text-muted-foreground">{skill.use_case}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(step.recommended_path) && (
                    <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                      <p className="text-xs uppercase text-muted-foreground mb-2">{skillTreeModule.recommendedPathLabel}</p>
                      <DetailValue value={step.recommended_path} />
                    </div>
                  )}

                  {Array.isArray(step.best_for) && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground mb-2">{skillTreeModule.bestForLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.best_for.map((item: string) => (
                          <span key={item} className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Attack on Titan Revolution Prestige Guide */}
      <section id="prestige-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{prestigeModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{prestigeModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{prestigeModule.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{prestigeModule.intro}</p>
          </div>

          <div className="scroll-reveal relative space-y-5">
            <div className="absolute left-6 top-10 bottom-10 w-px bg-[hsl(var(--nav-theme)/0.25)] hidden md:block" />
            {prestigeModule.steps.map((step: any) => (
              <article key={step.step} className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-6 h-12 w-12 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.45)] bg-background text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                  {step.step}
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start gap-4 mb-5 md:hidden">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.1)] font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.goal}</p>
                    </div>
                  </div>
                  <div className="hidden md:block mb-5">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground mt-2">{step.goal}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.entries(step)
                      .filter(([key]) => !['step', 'title', 'goal', 'recommended_action'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="rounded-lg border border-border bg-muted/30 p-4">
                          <p className="text-xs uppercase text-muted-foreground mb-2">{formatDetailLabel(key)}</p>
                          <DetailValue value={value} />
                        </div>
                      ))}
                  </div>

                  {step.recommended_action && (
                    <div className="mt-4 rounded-lg border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                      <p className="text-xs uppercase text-muted-foreground mb-2">{prestigeModule.recommendedActionLabel}</p>
                      <p className="text-sm">{step.recommended_action}</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Attack on Titan Revolution Raids Guide */}
      <section id="raids-guide" className="scroll-mt-24 px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <AlertTriangle className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{raidsModule.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{raidsModule.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{raidsModule.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{raidsModule.intro}</p>
          </div>

          <div className="scroll-reveal space-y-4">
            {raidsModule.panels.map((panel: any) => (
              <details key={panel.title} open={panel.default_open} className="group rounded-xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{panel.title}</h3>
                      <p className="text-sm text-muted-foreground">{raidsModule.accordionLabel}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>

                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(panel.content).map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="text-xs uppercase text-muted-foreground mb-2">{formatDetailLabel(key)}</p>
                      <DetailValue value={value} />
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
          communityUrl={officialLinks.discord}
          gameUrl={officialLinks.roblox}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={officialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href={officialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={officialLinks.robloxGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href={officialLinks.trello}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Labels */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.about}
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.privacy}
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.terms}
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.copyrightNotice}
                  </span>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
