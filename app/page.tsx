import Link from 'next/link'
import Image from 'next/image'
import ServiceCarousel from './components/home/ServiceCarousel'
import { FullLogo, Wordmark, btn } from './components/ui'

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
  { q: 'How do I book a service?', a: 'Open the app, pick a service, and choose a date and time. We confirm every request within 24 hours.' },
  { q: 'How will I know the job got done?', a: 'When we finish, we add a photo to the request. You see it in the app and get an email at the same time.' },
  {
    q: 'What does the $99 membership cover?',
    a: 'Full app access, photo documentation on every job, priority scheduling, and a direct line to your service team. Individual services are billed at the prices listed.',
  },
  { q: 'Can I ask for something that is not on the list?', a: 'Yes. Send a custom request in the app and we will give you a price before any work starts.' },
  { q: 'Can my guests see what to bring?', a: 'Yes. Make a packing list and send guests the link. They can check items off and claim shared things like a cooler, no account needed.' },
]

function PhonePreview() {
  return (
    <div aria-hidden className="w-[300px] rounded-[46px] bg-ink p-[9px] shadow-[0_30px_60px_-30px_rgba(27,31,36,0.5)]">
      <div className="rounded-[38px] bg-paper overflow-hidden h-[600px] flex flex-col text-ink">
        <div className="flex justify-between items-center px-7 pt-3.5 text-[12px] font-semibold">
          <span>9:41</span>
          <span className="w-20 h-6 rounded-full bg-ink" />
          <span>100%</span>
        </div>
        <div className="px-5 pt-5">
          <Image src="/logo-wordmark-dark.png" alt="" width={108} height={18} style={{ height: 18, width: 'auto' }} />
        </div>
        <div className="px-5 pt-5">
          <p className="text-[22px] font-semibold tracking-[-0.02em]">Good morning</p>
          <div className="mt-3 h-10 rounded-full bg-lake text-white text-[14px] font-medium grid place-items-center">Request a service</div>
        </div>
        <div className="px-5 pt-5">
          <p className="text-[13px] font-semibold mb-2">Next visit</p>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[16px] font-semibold leading-tight">Jet Ski Cover Off</p>
              <span className="h-5 px-2 rounded-full text-[11px] font-medium bg-lake-tint text-lake-dark grid place-items-center">Confirmed</span>
            </div>
            <p className="mt-1 text-[13px]">Saturday, May 23 at 9:00 AM</p>
            <p className="mt-2 text-[12px] text-ink-2">You will get a photo when it is done.</p>
          </div>
        </div>
        <div className="px-5 pt-5">
          <p className="text-[13px] font-semibold mb-2">Last finished</p>
          <div className="rounded-2xl border border-line bg-surface overflow-hidden">
            <div className="relative h-28">
              <Image src="/jetskisondock.jpeg" alt="" fill sizes="280px" className="object-cover" />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold">Boat Cover On</p>
                <p className="text-[12px] text-ink-2">Sunday, May 17</p>
              </div>
              <span className="h-5 px-2 rounded-full text-[11px] font-medium bg-ink text-white grid place-items-center">Done</span>
            </div>
          </div>
        </div>
        <div className="mt-auto grid grid-cols-5 border-t border-line text-[10px] text-ink-3 pt-2 pb-5 text-center">
          <span className="text-lake font-medium">Home</span>
          <span>Requests</span>
          <span>House</span>
          <span>Inventory</span>
          <span>Packing</span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex-1">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <nav aria-label="Main" className="max-w-6xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between gap-6">
          <Wordmark />
          <div className="hidden md:flex items-center gap-8 text-[15px] text-ink-2">
            <a href="#services" className="hover:text-ink">Services</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#questions" className="hover:text-ink">Questions</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className={btn('quiet', 'sm')}>
              Sign in
            </Link>
            <Link href="/signup" className={btn('primary', 'sm')}>
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 sm:px-10 pt-14 sm:pt-24 pb-20 sm:pb-28 grid gap-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-semibold tracking-[-0.035em] leading-[1.02] max-w-[13ch]">
              Your lakehouse, ready when you are.
            </h1>
            <p className="mt-6 text-[18px] sm:text-[20px] leading-[1.5] text-ink-2 max-w-[36ch]">
              Request a service from your phone. A local team covers the boats, stocks the house, opens it in spring, and sends a photo when each job is done.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/signup" className={btn('primary', 'lg')}>
                Get started
              </Link>
              <a href="#services" className={btn('secondary', 'lg')}>
                See services
              </a>
            </div>
          </div>
          <div className="justify-self-center">
            <PhonePreview />
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-line bg-surface">
          <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-24">
            <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] font-semibold tracking-[-0.025em] leading-[1.1] max-w-[20ch]">How a request works</h2>
            <ol className="mt-12 grid gap-10 sm:grid-cols-3">
              {[
                ['Tell us about your house', 'Address, door code, WiFi, boats, and what you keep stocked, saved once for you and our team.'],
                ['Pick a service and a date', 'Choose from the menu or describe something custom. We confirm within 24 hours.'],
                ['Get a photo when it is done', 'It shows up in the app and your inbox, so you never have to wonder.'],
              ].map(([title, body], i) => (
                <li key={title}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-lake-tint text-[14px] font-semibold text-lake-dark">{i + 1}</span>
                  <p className="mt-4 text-[18px] font-semibold">{title}</p>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 sm:py-28 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-10 mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] font-semibold tracking-[-0.025em] leading-[1.1]">Services</h2>
            <p className="text-[16px] text-ink-2">Tap a service for details and pricing.</p>
          </div>
          <ServiceCarousel />
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-line scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
            <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] font-semibold tracking-[-0.025em] leading-[1.1] max-w-[22ch]">
              One membership. Clear prices for each job.
            </h2>
            <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="rounded-3xl bg-ink text-white p-8 sm:p-10 flex flex-col">
                <p className="text-[16px] text-white/70">Membership</p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-[64px] font-semibold tracking-[-0.04em] leading-none">$99</span>
                  <span className="text-[16px] text-white/70">per month</span>
                </p>
                <ul className="mt-8 space-y-3 text-[16px] text-white/90">
                  {['Full app access', 'Photo documentation on every job', 'Priority scheduling', 'A direct line to your service team'].map((f) => (
                    <li key={f} className="flex gap-3">
                      <svg aria-hidden viewBox="0 0 20 20" className="w-5 h-5 shrink-0 mt-0.5 text-white/60" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-10 lg:mt-auto inline-flex h-13 items-center justify-center rounded-full bg-white text-ink font-medium hover:bg-white/90 transition-colors">
                  Get started
                </Link>
              </div>
              <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
                <p className="text-[16px] text-ink-2 mb-3">Billed per job</p>
                <ul>
                  {prices.map((item) => (
                    <li key={item.task} className="flex items-baseline justify-between gap-6 py-3.5 border-b border-line last:border-0 text-[16px]">
                      <span>{item.task}</span>
                      <span className={`whitespace-nowrap ${item.price === 'Quote' ? 'text-ink-2' : 'font-semibold'}`}>{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section id="questions" className="border-t border-line scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28 grid gap-10 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-16">
            <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] font-semibold tracking-[-0.025em] leading-[1.1]">Questions</h2>
            <div className="border-t border-line">
              {faqs.map((f) => (
                <details key={f.q} className="faq border-b border-line">
                  <summary className="flex items-center justify-between gap-6 py-5 text-[17px] font-medium">
                    {f.q}
                    <span aria-hidden className="faq-icon text-[24px] font-light leading-none text-ink-3">+</span>
                  </summary>
                  <p className="pb-6 -mt-1 text-[16px] leading-relaxed text-ink-2 max-w-[58ch]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-line">
          <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-24 grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] font-semibold tracking-[-0.025em] leading-[1.1]">Add your house in five minutes.</h2>
              <p className="mt-3 text-[17px] text-ink-2">We reach out within one business day.</p>
              <Link href="/signup" className={btn('primary', 'lg', 'mt-8')}>
                Create an account
              </Link>
            </div>
            <FullLogo width={260} className="justify-self-center md:justify-self-end" />
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-[14px] text-ink-2">
          <Wordmark height={20} />
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#services" className="hover:text-ink">Services</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <Link href="/login" className="hover:text-ink">Sign in</Link>
            <Link href="/signup" className="hover:text-ink">Create an account</Link>
          </div>
          <p className="text-ink-3">© 2026 Lakehouse HQ</p>
        </div>
      </footer>
    </div>
  )
}
