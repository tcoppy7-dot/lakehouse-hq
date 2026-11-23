import Link from 'next/link'
import Image from 'next/image'
import ScrollHeroImage from './components/home/ScrollHeroImage'
import ServiceCarousel from './components/home/ServiceCarousel'

const navy = '#0A2342'

const prices = [
  { task: 'Boat cover on or off', price: '$20' },
  { task: 'Jet ski cover on or off', price: '$10' },
  { task: 'Patio furniture setup or storage', price: '$35' },
  { task: 'Boat fuel top off', price: 'Cost of fuel' },
  { task: 'Lawn mowing', price: 'Quote' },
  { task: 'Seasonal opening', price: 'Quote' },
  { task: 'Seasonal closing', price: 'Quote' },
  { task: 'Anything else', price: 'Quote' },
]

const faqs = [
  {
    q: 'How do I book a service?',
    a: 'Open the app, pick a service, and choose a date and time. We confirm every request within 24 hours.',
  },
  {
    q: 'How will I know the job got done?',
    a: 'When we finish, we add a photo to the task. You see it in the app and get an email at the same time.',
  },
  {
    q: 'What does the $99 membership cover?',
    a: 'Full app access, photo documentation on every job, priority scheduling, and a direct line to your service team. Individual services are billed at the prices listed.',
  },
  {
    q: 'Can I ask for something that is not on the list?',
    a: 'Yes. Send a custom request in the app and we will give you a price before any work starts.',
  },
  {
    q: 'Can my guests see what is stocked at the house?',
    a: 'Yes. Your packing list and inventory can be shared with guests through a link, so everyone knows what to bring.',
  },
]

export default function Home() {
  return (
    <main className="font-body bg-white text-[#0A2342] antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-[#0A2342]/[0.06]">
        <nav className="max-w-6xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Lakehouse HQ home">
            <Image src="/logo-wordmark-dark.png" alt="Lakehouse HQ" width={150} height={25} priority className="h-[22px] w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[15px] text-[#3C4E63]">
            <a href="#services" className="hover:text-[#0A2342] transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-[#0A2342] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#0A2342] transition-colors">Pricing</a>
            <a href="#questions" className="hover:text-[#0A2342] transition-colors">Questions</a>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[15px] text-[#3C4E63] hover:text-[#0A2342] transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-4 py-2 text-[15px] font-semibold bg-[#E8A838] text-[#0A2342] hover:bg-[#f0b64e] transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 pt-14 sm:pt-24 pb-10 sm:pb-16">
        <h1 className="font-heading font-medium tracking-[-0.025em] leading-[0.95] text-[clamp(3rem,9.5vw,7.25rem)] max-w-[11ch]">
          Your lakehouse, ready when you are.
        </h1>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
          <p className="text-[18px] sm:text-[21px] leading-[1.5] text-[#3C4E63] max-w-[34ch]">
            We cover the boats, stock the towels, open it in spring, close it in fall, and send you a photo when each job is done.
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/signup"
              className="rounded-full px-7 py-4 text-[16px] font-semibold bg-[#E8A838] text-[#0A2342] hover:bg-[#f0b64e] transition-colors"
            >
              Get started
            </Link>
            <a href="#services" className="text-[16px] font-medium text-[#1A7A8A] hover:text-[#0A2342] transition-colors">
              See services
            </a>
          </div>
        </div>
      </section>

      <ScrollHeroImage src="/july3sun.JPG" alt="Sunset over the lake from a covered boat dock" />

      {/* Product */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-5 sm:px-10 py-24 sm:py-36 grid md:grid-cols-[1fr_auto] gap-16 md:gap-24 items-center scroll-mt-16">
        <div>
          <h2 className="font-heading font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(2.4rem,5.5vw,4.25rem)] max-w-[14ch]">
            Book it from your phone. See it done from anywhere.
          </h2>
          <ol className="mt-12 space-y-8 max-w-md">
            {[
              ['Tell us about your place.', 'House details, boats, door codes, and what you keep stocked, all in one spot.'],
              ['Pick a service and a time.', 'Choose from the menu or ask for something custom. We confirm within 24 hours.'],
              ['Get a photo when it is done.', 'It shows up in the app and in your inbox, so you never have to wonder.'],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-5">
                <span className="font-heading text-[1.6rem] leading-none text-[#1A7A8A] w-5 shrink-0 pt-0.5">{i + 1}</span>
                <p className="text-[17px] leading-relaxed text-[#3C4E63]">
                  <span className="font-semibold text-[#0A2342]">{title}</span> {body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Phone showing the app */}
        <div className="justify-self-center">
          <div className="w-[290px] rounded-[48px] p-[10px] shadow-[0_40px_80px_-30px_rgba(10,35,66,0.45)]" style={{ backgroundColor: navy }}>
            <div className="rounded-[39px] bg-[#F4F7F9] overflow-hidden h-[580px] flex flex-col">
              <div className="flex justify-between items-center px-7 pt-4 text-[12px] font-semibold">
                <span>9:41</span>
                <span className="w-20 h-6 rounded-full" style={{ backgroundColor: navy }} />
                <span className="tracking-tight">100%</span>
              </div>
              <div className="px-5 pt-6 pb-3">
                <p className="text-[13px] text-[#3C4E63]">This week</p>
                <p className="font-heading text-[26px] leading-tight">Your tasks</p>
              </div>
              <div className="px-4 space-y-3">
                <div className="rounded-2xl bg-white overflow-hidden shadow-[0_1px_2px_rgba(10,35,66,0.06)]">
                  <div className="relative h-32">
                    <Image src="/jetskisondock.jpeg" alt="" fill sizes="270px" className="object-cover" />
                  </div>
                  <div className="p-3.5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold">Jet ski covers off</p>
                      <p className="text-[12.5px] text-[#3C4E63] mt-0.5">Saturday, 9:00 AM</p>
                      <p className="text-[12.5px] text-[#3C4E63]">Photo added 9:14 AM</p>
                    </div>
                    <span className="text-[12px] font-semibold rounded-full px-2.5 py-1 bg-[#1A7A8A]/12 text-[#1A7A8A]">Done</span>
                  </div>
                </div>
                {[
                  ['Restock towels and pantry', 'Friday, 2:00 PM'],
                  ['Lawn mowing', 'Thursday, 10:00 AM'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl bg-white p-3.5 flex items-start justify-between gap-3 shadow-[0_1px_2px_rgba(10,35,66,0.06)]">
                    <div>
                      <p className="text-[15px] font-semibold">{t}</p>
                      <p className="text-[12.5px] text-[#3C4E63] mt-0.5">{d}</p>
                    </div>
                    <span className="text-[12px] font-semibold rounded-full px-2.5 py-1 bg-[#E8A838]/18 text-[#8a5a0b]">Scheduled</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto p-4">
                <div className="rounded-full py-3 text-center text-[14px] font-semibold bg-[#E8A838]">Request a service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-[#F4F7F9] py-24 sm:py-32 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <h2 className="font-heading font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(2.4rem,5.5vw,4.25rem)] max-w-[12ch]">
            What we take care of.
          </h2>
          <p className="text-[17px] text-[#3C4E63] max-w-[30ch]">Tap any service to see what is included and what it costs.</p>
        </div>
        <ServiceCarousel />
      </section>

      {/* Photo band */}
      <section className="relative h-[78vh] min-h-[480px] overflow-hidden">
        <Image src="/sunset.jpg" alt="Boats on the lake at sunset" fill sizes="100vw" className="object-cover" style={{ objectPosition: 'center 40%' }} />
        <div className="absolute inset-0 bg-linear-to-t from-[#0A2342]/80 via-[#0A2342]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-5 sm:px-10 pb-14 sm:pb-20">
          <p className="font-heading font-medium text-white tracking-[-0.02em] leading-[1.02] text-[clamp(2.4rem,6vw,5rem)] max-w-[16ch]">
            Spend the weekend on the water, not on the to do list.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-5 sm:px-10 py-24 sm:py-36 scroll-mt-16">
        <h2 className="font-heading font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(2.4rem,5.5vw,4.25rem)] max-w-[15ch]">
          One membership. Clear prices for everything else.
        </h2>
        <div className="mt-14 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6">
          <div className="rounded-[32px] p-8 sm:p-10 text-white flex flex-col" style={{ backgroundColor: navy }}>
            <p className="text-[17px] text-[#A8D5DC]">Membership</p>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-[5.5rem] leading-none tracking-[-0.03em]">$99</span>
              <span className="text-[17px] text-[#A8D5DC]">a month</span>
            </p>
            <ul className="mt-8 space-y-3.5 text-[16px] text-white/90">
              {['Full app access', 'Photo documentation on every job', 'Priority scheduling', 'A direct line to your service team'].map((f) => (
                <li key={f} className="flex gap-3">
                  <svg aria-hidden viewBox="0 0 20 20" className="w-5 h-5 shrink-0 mt-0.5 text-[#E8A838]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-10 lg:mt-auto lg:pt-0 text-center rounded-full py-4 font-semibold bg-[#E8A838] text-[#0A2342] hover:bg-[#f0b64e] transition-colors"
            >
              Get started
            </Link>
          </div>
          <div className="rounded-[32px] bg-[#F4F7F9] p-8 sm:p-10">
            <p className="text-[17px] text-[#3C4E63] mb-4">Services, billed per job</p>
            <ul>
              {prices.map((item) => (
                <li key={item.task} className="flex items-baseline justify-between gap-6 py-4 border-b border-[#0A2342]/[0.08] last:border-0">
                  <span className="text-[16px] sm:text-[17px]">{item.task}</span>
                  <span className={`text-[16px] sm:text-[17px] font-semibold whitespace-nowrap ${item.price === 'Quote' ? 'text-[#3C4E63] font-medium' : ''}`}>
                    {item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section id="questions" className="max-w-6xl mx-auto px-5 sm:px-10 pb-24 sm:pb-36 grid md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 md:gap-16 scroll-mt-16">
        <h2 className="font-heading font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(2.4rem,5.5vw,4.25rem)]">Questions</h2>
        <div className="border-t border-[#0A2342]/10">
          {faqs.map((f) => (
            <details key={f.q} className="faq border-b border-[#0A2342]/10 group">
              <summary className="flex items-center justify-between gap-6 py-6 text-[18px] sm:text-[19px] font-medium rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1A7A8A]">
                {f.q}
                <span aria-hidden className="faq-icon text-[26px] font-light leading-none text-[#1A7A8A]">+</span>
              </summary>
              <p className="pb-7 -mt-1 text-[17px] leading-relaxed text-[#3C4E63] max-w-[58ch]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px]" style={{ backgroundColor: navy }}>
          <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28 grid md:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <h2 className="font-heading font-medium text-white tracking-[-0.02em] leading-[1.02] text-[clamp(2.4rem,5.5vw,4.25rem)] max-w-[13ch]">
                Get your place on our list.
              </h2>
              <p className="mt-6 text-[18px] leading-relaxed text-[#A8D5DC] max-w-[36ch]">
                Tell us about your property and we will reach out within one business day.
              </p>
              <Link
                href="/signup"
                className="mt-10 inline-block rounded-full px-8 py-4 font-semibold bg-[#E8A838] text-[#0A2342] hover:bg-[#f0b64e] transition-colors"
              >
                Get started
              </Link>
            </div>
            <Image src="/logo.png" alt="" width={360} height={267} className="w-[240px] sm:w-[340px] h-auto justify-self-center md:justify-self-end opacity-95" />
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-5 sm:px-10 py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-[15px] text-[#3C4E63]">
        <Image src="/logo-wordmark-dark.png" alt="Lakehouse HQ" width={130} height={22} className="h-[20px] w-auto" />
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          <a href="#services" className="hover:text-[#0A2342]">Services</a>
          <a href="#pricing" className="hover:text-[#0A2342]">Pricing</a>
          <Link href="/login" className="hover:text-[#0A2342]">Sign in</Link>
          <Link href="/signup" className="hover:text-[#0A2342]">Get started</Link>
        </div>
        <p>© 2026 Lakehouse HQ</p>
      </footer>
    </main>
  )
}
