import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_TITLE = 'Sensoria Kids'
const BASE_URL = 'https://www.sensoriakids.ro'

export function useMeta(title: string, description?: string) {
  const { pathname } = useLocation()

  useEffect(() => {
    // Title
    document.title = title
      ? `${title} — ${BASE_TITLE}`
      : `${BASE_TITLE} — Planșe de nisip colorat pentru copii`

    // Description
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = description
    }

    // Canonical — self-referencing per page
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${BASE_URL}${pathname}`
  }, [title, description, pathname])
}
