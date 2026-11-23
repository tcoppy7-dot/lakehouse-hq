'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { btn } from '../ui'

type Service = {
  title: string
  summary: string
  detail: string
  price: string
  image: string
  alt: string
  position?: string
}

const services: Service[] = [
  {
    title: 'Boat and jet ski covers',
    summary: 'On or off, whenever you need it.',
    detail:
      'We take covers off before you arrive and put them back on after you leave, at the start and end of every season or any weekend in between.',
    price: '$20 per boat, $10 per jet ski',
    image: '/jetskisondock.jpeg',
    alt: 'Two jet skis on a covered dock lift',
  },
  {
    title: 'Seasonal opening and closing',
    summary: 'Ready in spring. Buttoned up in fall.',
    detail:
      'We get the property ready for the season and close it down properly at the end, working from a full checklist with photos of everything we touch.',
    price: 'Quoted for your property',
    image: '/vikinghouse.JPG',
    alt: 'Lakehouse with a wraparound porch and a wide lawn',
    position: 'center 75%',
  },
  {
    title: 'Patio and dock setup',
    summary: 'Furniture out, cushions on, dock ready.',
    detail:
      'Patio furniture goes out in spring and gets stored in fall. Dock accessories are handled all season so the space is ready when you are.',
    price: '$35 per setup or storage',
    image: '/patiochairs.jpeg',
    alt: 'Covered patio with tables and chairs facing the lake',
  },
  {
    title: 'Guest ready check',
    summary: 'Towels, pantry, and supplies stocked.',
    detail:
      'Before your guests arrive we walk your inventory list and make sure nothing is missing, from towels to the pantry. Your guests can see the packing list from a shared link.',
    price: 'Quoted for your property',
    image: '/towels.jpeg',
    alt: 'Striped beach towels folded on a chair',
  },
  {
    title: 'Lawn and grounds',
    summary: 'Mowed and tidy every visit.',
    detail: 'Regular mowing and basic upkeep so the property always looks cared for, whether you are there or not.',
    price: 'Quoted for your property',
    image: '/property.jpg',
    alt: 'Lakefront yard and dock from the water',
  },
  {
    title: 'Boat fuel top off',
    summary: 'Full tanks before the weekend.',
    detail: 'We fill boats and jet skis so you can head straight out. You pay what the fuel costs, nothing added.',
    price: 'Cost of fuel',
    image: '/gas.jpeg',
    alt: 'Gas cans lined up on a dock next to jet skis',
  },
  {
    title: 'Anything else',
    summary: 'Not on the list? Ask.',
    detail: 'Tell us what you need in the app and we will send you a price before any work starts.',
    price: 'Quoted for the job',
    image: '/boats.jpg',
    alt: 'Pontoon boat cruising past a wooded shoreline',
  },
]

export default function ServiceCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<Service | null>(null)

  const open = (s: Service) => {
    setActive(s)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <>
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-5 sm:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] scroll-px-5 sm:scroll-px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
      >
        {services.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => open(s)}
            aria-haspopup="dialog"
            className="group shrink-0 snap-start w-[76vw] sm:w-[300px] rounded-2xl border border-line bg-surface overflow-hidden text-left transition-colors hover:border-ink-3"
          >
            <span className="relative block aspect-[4/3] bg-sunk">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width: 640px) 76vw, 300px"
                className="object-cover"
                style={{ objectPosition: s.position ?? 'center' }}
              />
            </span>
            <span className="block p-5">
              <span className="block text-[17px] font-semibold">{s.title}</span>
              <span className="block mt-1 text-[15px] text-ink-2">{s.summary}</span>
              <span className="mt-4 flex items-center justify-between text-[14px]">
                <span className="text-ink-2">{s.price}</span>
                <span className="font-medium text-lake group-hover:text-lake-dark">Details</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="hidden sm:flex justify-end gap-2 mt-6 max-w-6xl mx-auto px-10">
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous services" className="h-10 w-10 grid place-items-center rounded-full border border-line bg-surface text-ink-2 hover:text-ink text-lg">
          ‹
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="More services" className="h-10 w-10 grid place-items-center rounded-full border border-line bg-surface text-ink-2 hover:text-ink text-lg">
          ›
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="sheet"
        aria-labelledby="service-sheet-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
        onClose={() => setActive(null)}
      >
        {active && (
          <div>
            <div className="relative aspect-[16/10] bg-sunk">
              <Image
                src={active.image}
                alt={active.alt}
                fill
                sizes="(max-width: 640px) 100vw, 540px"
                className="object-cover"
                style={{ objectPosition: active.position ?? 'center' }}
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-surface/95 text-ink text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h3 id="service-sheet-title" className="text-[24px] font-semibold tracking-[-0.02em]">
                {active.title}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{active.detail}</p>
              <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5 text-[16px]">
                <span className="text-ink-2">Price</span>
                <span className="font-semibold">{active.price}</span>
              </div>
              <Link href="/signup" className={btn('primary', 'lg', 'mt-7 w-full')}>
                Request this service
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
