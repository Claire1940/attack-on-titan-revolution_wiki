import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { Language, ContentItem } from '@/lib/content'

export interface ArticleLink {
  url: string
  title: string
}

export type ModuleLinkMap = Record<string, ArticleLink | null>

interface ArticleWithType extends ContentItem {
  contentType: string
}

interface ModuleFieldConfig {
  field: string
  nameKey: string
}

// Module sub-field mapping: moduleKey -> { field, nameKey }
const MODULE_FIELDS: Record<string, ModuleFieldConfig | ModuleFieldConfig[]> = {
  attackOnTitanRevolutionCodes: [
    { field: 'workingCodes', nameKey: 'code' },
    { field: 'redeemSteps', nameKey: 'title' },
  ],
  attackOnTitanRevolutionOfficialLinks: { field: 'links', nameKey: 'title' },
  attackOnTitanRevolutionBeginnerGuide: { field: 'steps', nameKey: 'title' },
  attackOnTitanRevolutionFamilyTierList: { field: 'tiers', nameKey: 'label' },
  attackOnTitanRevolutionPerksTierList: { field: 'tiers', nameKey: 'summary' },
  attackOnTitanRevolutionSkillTreeGuide: { field: 'steps', nameKey: 'title' },
  attackOnTitanRevolutionPrestigeGuide: { field: 'steps', nameKey: 'title' },
  attackOnTitanRevolutionRaidsGuide: { field: 'panels', nameKey: 'title' },
  attackOnTitanRevolutionTitanShiftingGuide: { field: 'items', nameKey: 'title' },
  attackOnTitanRevolutionArtifactsAndMemoriesGuide: { field: 'items', nameKey: 'name' },
  attackOnTitanRevolutionMissionsGuide: { field: 'items', nameKey: 'map' },
  attackOnTitanRevolutionControlsAndOdmGearGuide: { field: 'items', nameKey: 'title' },
  attackOnTitanRevolutionTradingValues: { field: 'items', nameKey: 'category' },
  attackOnTitanRevolutionArmoredTitanRaidGuide: { field: 'items', nameKey: 'title' },
  attackOnTitanRevolutionFemaleTitanRaidGuide: { field: 'items', nameKey: 'title' },
  attackOnTitanRevolutionColossalTitanRaidGuide: { field: 'items', nameKey: 'title' },
}

// Extra semantic keywords per module to boost matching for h2 titles.
// These supplement the module title text when matching against articles.
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  attackOnTitanRevolutionCodes: ['codes', 'spins', 'emperor keys', 'gems', 'shards', 'rewards'],
  attackOnTitanRevolutionOfficialLinks: ['trello', 'discord', 'roblox', 'official links', 'wiki', 'community'],
  attackOnTitanRevolutionBeginnerGuide: ['beginner guide', 'odm', 'titan combat', 'missions', 'families', 'progression'],
  attackOnTitanRevolutionFamilyTierList: ['family tier list', 'families', 'ackerman', 'yeager', 'fritz', 'helos'],
  attackOnTitanRevolutionPerksTierList: ['perks tier list', 'perks', 'mythic perks', 'builds', 'raid support'],
  attackOnTitanRevolutionSkillTreeGuide: ['skill tree', 'skill points', 'offense', 'defense', 'support', 'nodes'],
  attackOnTitanRevolutionPrestigeGuide: ['prestige', 'prestige memory', 'level cap', 'boosts', 'prestige scrolls'],
  attackOnTitanRevolutionRaidsGuide: ['raids', 'raid rewards', 'boss phases', 'emperor trove', 'raid drops', 'serum farming'],
  attackOnTitanRevolutionTitanShiftingGuide: ['titan shifting', 'complete unlock', 'serums', 'shifter', 'attack titan', 'colossal titan'],
  attackOnTitanRevolutionArtifactsAndMemoriesGuide: ['artifacts', 'memories', 'prestige', 'substats', 'raid drops'],
  attackOnTitanRevolutionMissionsGuide: ['missions', 'skirmish', 'randomizer', 'objective', 'gold', 'exp'],
  attackOnTitanRevolutionControlsAndOdmGearGuide: ['controls', 'odm gear', 'keybinds', 'gas', 'reload', 'movement'],
  attackOnTitanRevolutionTradingValues: ['trading', 'values', 'trade tax', 'trading hub', 'market', 'trades'],
  attackOnTitanRevolutionArmoredTitanRaidGuide: ['armored titan', 'raid guide', 'armored serum', 'rescue boats', 'emperor trove'],
  attackOnTitanRevolutionFemaleTitanRaidGuide: ['female titan', 'raid guide', 'annie', 'female serum', 'qte', 'eren'],
  attackOnTitanRevolutionColossalTitanRaidGuide: ['colossal titan', 'raid guide', 'bertholdt', 'cannons', 'colossal serum', 'update 4'],
}

const FILLER_WORDS = ['attack', 'on', 'titan', 'revolution', '2026', '2025', 'complete', 'guide', 'the', 'and', 'for', 'how', 'with', 'our', 'this', 'your', 'all', 'from', 'learn', 'master']

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !FILLER_WORDS.includes(w))
}

function matchScore(queryText: string, article: ArticleWithType, extraKeywords?: string[]): number {
  const normalizedQuery = normalize(queryText)
  const normalizedTitle = normalize(article.frontmatter.title)
  const normalizedDesc = normalize(article.frontmatter.description || '')
  const normalizedSlug = article.slug.replace(/-/g, ' ').toLowerCase()

  let score = 0

  // Exact phrase match in title (stripped of "Attack on Titan Revolution")
  const strippedQuery = normalizedQuery.replace(/attack on titan revolution\s*/g, '').trim()
  const strippedTitle = normalizedTitle.replace(/attack on titan revolution\s*/g, '').trim()
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20
    if (normalizedDesc.includes(token)) score += 5
    if (normalizedSlug.includes(token)) score += 15
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw)
      if (normalizedTitle.includes(normalizedKw)) score += 15
      if (normalizedDesc.includes(normalizedKw)) score += 5
      if (normalizedSlug.includes(normalizedKw)) score += 10
    }
  }

  return score
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  extraKeywords?: string[],
  threshold = 20,
): ArticleLink | null {
  let bestScore = 0
  let bestArticle: ArticleWithType | null = null

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords)
    if (score > bestScore) {
      bestScore = score
      bestArticle = article
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: `/${bestArticle.contentType}/${bestArticle.slug}`,
      title: bestArticle.frontmatter.title,
    }
  }

  return null
}

export async function buildModuleLinkMap(locale: Language): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = []
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    for (const item of items) {
      allArticles.push({ ...item, contentType })
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import('../locales/en.json')).default as any

  const linkMap: ModuleLinkMap = {}

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfigValue] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey]
    if (!moduleData) continue
    const fieldConfigs = Array.isArray(fieldConfigValue) ? fieldConfigValue : [fieldConfigValue]

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string
    if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || []
      linkMap[moduleKey] = findBestMatch(moduleTitle, allArticles, extraKw, 20)
    }

    // Match sub-items
    for (const fieldConfig of fieldConfigs) {
      const subItems = moduleData[fieldConfig.field] as any[]
      if (Array.isArray(subItems)) {
        for (let i = 0; i < subItems.length; i++) {
          const itemName = subItems[i]?.[fieldConfig.nameKey] as string
          if (itemName) {
            const key = `${moduleKey}::${fieldConfig.field}::${i}`
            linkMap[key] = findBestMatch(itemName, allArticles)
          }
        }
      }
    }
  }

  return linkMap
}
