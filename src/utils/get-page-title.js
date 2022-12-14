import defaultSettings from '@/settings'

const title = defaultSettings.title || '云方量化'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
