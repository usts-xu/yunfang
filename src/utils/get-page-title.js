import defaultSettings from '@/settings'

const title = defaultSettings.title || '无限策略'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
