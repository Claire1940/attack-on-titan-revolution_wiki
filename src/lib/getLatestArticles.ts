import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { ContentItem, Language } from '@/lib/content'

export interface ContentItemWithType extends ContentItem {
  contentType: string
}

/**
 * 获取最新文章（服务器端）
 * @param locale 语言
 * @param max 最大数量
 * @returns 排序后的文章列表
 */
export async function getLatestArticles(
  locale: Language,
  max: number = 30
): Promise<ContentItemWithType[]> {
  // 获取所有内容类型的文章
  const allArticles: ContentItemWithType[] = []

  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    allArticles.push(...items.map(item => ({ ...item, contentType })))
  }

  const getUpdateTime = (article: ContentItemWithType) => {
    if (article.frontmatter.lastModified) return new Date(article.frontmatter.lastModified).getTime()
    if (article.frontmatter.date) return new Date(article.frontmatter.date).getTime()
    return 0
  }

  // 首页 Latest Updates 按最近更新降序：优先 lastModified，缺失时回退 date
  const articlesWithMeta = allArticles.map(article => ({
    article,
    updateTime: getUpdateTime(article),
  }))

  // 排序：更新时间降序，同时间按路径稳定排序，避免每次渲染顺序变化
  articlesWithMeta.sort((a, b) => {
    if (a.updateTime !== b.updateTime) return b.updateTime - a.updateTime
    const pathA = `${a.article.contentType}/${a.article.slug}`
    const pathB = `${b.article.contentType}/${b.article.slug}`
    return pathA.localeCompare(pathB)
  })

  return articlesWithMeta.slice(0, max).map(x => x.article)
}
