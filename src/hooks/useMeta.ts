import { useEffect } from 'react'

const BASE_TITLE = 'Sensoria Kids'

export function useMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE_TITLE}` : `${BASE_TITLE} — Joacă blândă, liniște, creativitate`

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = description
    }
  }, [title, description])
}
