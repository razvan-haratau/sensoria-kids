import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="lg:hidden fixed bottom-6 right-4 z-50 w-11 h-11 rounded-full bg-[#5BC4C0] text-white shadow-hover flex items-center justify-center transition-all active:scale-90"
      aria-label="Înapoi sus"
    >
      <ChevronUp size={22} />
    </button>
  )
}
