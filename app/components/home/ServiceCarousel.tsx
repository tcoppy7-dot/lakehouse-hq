'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-5 sm:px-[max(2.5rem,calc((100vw-72rem)/2))] scroll-px-5 sm:scroll-px-[max(2.5rem,calc((100vw-72rem)/2))]"
      >
        {services.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => open(s)}
            className="group relative shrink-0 snap-start w-[78vw] sm:w-[340px] aspect-[4/5] rounded-[28px] overflow-hidden text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1A7A8A]"
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="(max-width: 640px) 78vw, 340px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ objectPosition: s.position ?? 'center' }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0A2342]/85 via-[#0A2342]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 pr-16">
              <p className="font-heading text-[1.65rem] leading-[1.1] text-white">{s.title}</p>
              <p className="font-body mt-2 text-[15px] text-white/80">{s.summary}</p>
            </div>
            <span
              aria-hidden
              className="absolute bottom-6 right-5 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-[#0A2342] text-xl leading-none"
            >
              +
            </span>
          </button>
        ))}
      </div>

      <div className="hidden sm:flex justify-end gap-3 mt-6 max-w-6xl mx-auto px-10">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous services"
          className="w-11 h-11 rounded-full bg-[#E3EBF0] text-[#0A2342] text-lg hover:bg-[#d4e0e7] transition-colors"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="More services"
          className="w-11 h-11 rounded-full bg-[#E3EBF0] text-[#0A2342] text-lg hover:bg-[#d4e0e7] transition-colors"
        >
          ›
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="sheet font-body"
        aria-labelledby="service-sheet-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
        onClose={() => setActive(null)}
      >
        {active && (
          <div>
            <div className="relative aspect-[16/10]">
              <Image
                src={active.image}
                alt={active.alt}
                fill
                sizes="(max-width: 640px) 100vw, 560px"
                className="object-cover"
                style={{ objectPosition: active.position ?? 'center' }}
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#0A2342] text-2xl leading-none grid place-items-center"
              >
                ×
              </button>
            </div>
            <div className="p-7 sm:p-8">
              <h3 id="service-sheet-title" className="font-heading text-[2rem] leading-[1.1]">
                {active.title}
              </h3>
              <p className="mt-4 text-[17px] leading-relaxed text-[#3C4E63]">{active.detail}</p>
              <div className="mt-6 flex items-baseline justify-between border-t border-[#E3EBF0] pt-5">
                <span className="text-[15px] text-[#3C4E63]">Price</span>
                <span className="text-[17px] font-semibold">{active.price}</span>
              </div>
              <Link
                href="/signup"
                className="mt-7 block w-full text-center rounded-full py-4 font-semibold bg-[#E8A838] text-[#0A2342] hover:bg-[#f0b64e] transition-colors"
              >
                Request this service
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
