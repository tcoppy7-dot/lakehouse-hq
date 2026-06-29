import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', backgroundColor: '#0A2342' }}>

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Image src="/logo.png" alt="Lakehouse HQ" width={160} height={54} className="object-contain" loading="eager" />
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium transition-colors" style={{ color: '#A8D5DC' }}>
            Sign In
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-end pb-24 overflow-hidden">
        <Image src="/sunset.jpg" alt="Lake sunset" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.95) 0%, rgba(10,35,66,0.5) 60%, rgba(10,35,66,0.2) 100%)' }} />
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full">
          <p className="text-sm font-medium tracking-widest uppercase mb-6" style={{ color: '#1A7A8A' }}>Lake property services</p>
          <h1 className="text-6xl sm:text-8xl font-bold text-white mb-6 leading-none tracking-tight max-w-4xl">
            Your lakehouse,<br />
            <span style={{ color: '#E8A838' }}>taken care of.</span>
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-xl leading-relaxed font-light" style={{ color: '#A8D5DC' }}>
            Lakehouse HQ is a local property service for lake homeowners who want to enjoy their time on the water, not spend it managing it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="px-8 py-3.5 rounded-full text-base font-semibold transition-colors inline-block text-center" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
              Get started
            </Link>
            <Link href="#how-it-works" className="px-8 py-3.5 rounded-full text-base font-medium transition-colors inline-block text-center border" style={{ borderColor: 'rgba(168,213,220,0.3)', color: '#A8D5DC' }}>
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-8 py-28 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: '#1A7A8A' }}>The process</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">Simple from day one.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            { num: '01', title: 'Sign up', desc: 'Create your account and tell us about your property. Takes five minutes.' },
            { num: '02', title: 'Request a service', desc: 'Pick what you need from our menu and choose a date. We confirm within 24 hours.' },
            { num: '03', title: 'We handle it', desc: 'Our team shows up, does the work, and sends you a photo when it is done.' },
          ].map((item) => (
            <div key={item.num}>
              <p className="text-5xl font-bold mb-6 leading-none" style={{ color: '#1A7A8A' }}>{item.num}</p>
              <h3 className="text-white font-semibold text-xl mb-3">{item.title}</h3>
              <p className="leading-relaxed font-light" style={{ color: '#A8D5DC' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-28" style={{ backgroundColor: '#060F1C' }}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-start mb-20">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: '#1A7A8A' }}>What we do</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">Everything your lakehouse needs, handled.</h2>
            </div>
            <div className="sm:pt-12">
              <p className="text-lg font-light leading-relaxed" style={{ color: '#A8D5DC' }}>
                From opening weekend to closing day, we take care of the tasks that eat up your time and peace of mind.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(168,213,220,0.1)' }}>
            {[
              { title: 'Boat and Jet Ski Covers', desc: 'On and off at the start and end of every season, or whenever you need it.' },
              { title: 'Seasonal Open and Close', desc: 'We prepare your property for the season and button it up at the end. Full checklist, photo documentation.' },
              { title: 'Lawn and Grounds', desc: 'Regular mowing and basic upkeep so the property always looks right.' },
              { title: 'Patio and Dock Setup', desc: 'Furniture out in spring, stored in fall. Dock accessories managed all season.' },
              { title: 'Inventory Checks', desc: 'We verify supplies are stocked before your guests arrive so nothing is missing.' },
              { title: 'Custom Requests', desc: 'Need something done that is not on the list? Just ask and we will handle it.' },
            ].map((service) => (
              <div key={service.title} className="p-8" style={{ backgroundColor: '#060F1C' }}>
                <h3 className="text-white font-semibold text-lg mb-3">{service.title}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: '#A8D5DC' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-8 py-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image src="/service.png" alt="Service in action" fill className="object-cover" sizes="100vw" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: '#1A7A8A' }}>Why it works</p>
            <h2 className="text-4xl font-bold text-white mb-10 leading-tight">You will always know it got done.</h2>
            <div className="space-y-8">
              {[
                { title: 'Photo confirmation on every job', desc: 'Every completed task includes a photo sent directly to you. No wondering if it happened.' },
                { title: 'Fast response, every time', desc: 'We confirm service requests within 24 hours and show up when we say we will.' },
                { title: 'One team, one number', desc: 'You deal with one person who knows your property. Not a call center, not a rotating crew.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-1 rounded-full shrink-0 mt-1" style={{ backgroundColor: '#1A7A8A', minHeight: '100%' }} />
                  <div>
                    <p className="text-white font-semibold mb-1">{item.title}</p>
                    <p className="text-sm font-light leading-relaxed" style={{ color: '#A8D5DC' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-28" style={{ backgroundColor: '#060F1C' }}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: '#1A7A8A' }}>Pricing</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">Simple pricing, no surprises.</h2>
              <p className="text-lg font-light leading-relaxed mb-10" style={{ color: '#A8D5DC' }}>
                A flat monthly membership covers your app access and locks in your service rates. Tasks are priced upfront so you always know what you are paying.
              </p>
              <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: '#0A2342' }}>
                <p className="text-5xl font-bold mb-1" style={{ color: '#E8A838' }}>$250</p>
                <p className="text-white font-medium">per month</p>
                <p className="text-sm font-light mt-3" style={{ color: '#A8D5DC' }}>Includes full app access, photo documentation, priority scheduling, and direct communication with your service team.</p>
              </div>
              <Link href="/signup" className="px-8 py-3.5 rounded-full text-base font-semibold transition-colors inline-block" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
                Get started
              </Link>
            </div>
            <div>
              <div className="divide-y" style={{ borderColor: 'rgba(168,213,220,0.15)' }}>
                {[
                  { task: 'Boat Cover On or Off', price: '$50' },
                  { task: 'Jet Ski Cover On or Off', price: '$25' },
                  { task: 'Patio Furniture Setup or Storage', price: '$35' },
                  { task: 'Lawn Mowing', price: 'Quote' },
                  { task: 'Seasonal Open Package', price: 'Quote' },
                  { task: 'Seasonal Close Package', price: 'Quote' },
                  { task: 'Custom Tasks', price: 'Quote' },
                ].map((item) => (
                  <div key={item.task} className="flex items-center justify-between py-5">
                    <span className="font-light" style={{ color: '#A8D5DC' }}>{item.task}</span>
                    <span className="font-semibold" style={{ color: '#E8A838' }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">Ready to stop managing and start enjoying?</h2>
            <p className="text-lg font-light mb-10 leading-relaxed" style={{ color: '#A8D5DC' }}>
              Tell us about your property and we will reach out within one business day.
            </p>
            <Link href="/signup" className="px-8 py-3.5 rounded-full text-base font-semibold transition-colors inline-block" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
              Get started today
            </Link>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image src="/dock.png" alt="Lakehouse dock" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.6) 0%, rgba(10,35,66,0.1) 100%)' }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10 border-t" style={{ borderColor: 'rgba(168,213,220,0.1)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo.png" alt="Lakehouse HQ" width={120} height={40} className="object-contain" loading="eager" />
          <p className="text-sm font-light" style={{ color: '#A8D5DC' }}>Your lakehouse, taken care of.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm font-light transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>Sign In</Link>
            <Link href="/signup" className="text-sm font-light transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>Sign Up</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
