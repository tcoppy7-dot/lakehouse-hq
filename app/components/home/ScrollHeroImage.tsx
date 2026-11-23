'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

// Photo that starts inset with rounded corners and opens up to full width as you scroll.
export default function ScrollHeroImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const top = el.getBoundingClientRect().top
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.7)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        ['--p' as string]: 0,
        paddingInline: 'calc((1 - var(--p)) * clamp(16px, 5vw, 64px))',
      }}
    >
      <div
        className="relative h-[64vh] sm:h-[86vh] overflow-hidden"
        style={{ borderRadius: 'calc((1 - var(--p)) * 32px)' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center 62%', transform: 'scale(calc(1.08 - var(--p) * 0.08))' }}
        />
      </div>
    </div>
  )
}
