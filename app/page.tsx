import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0D1F35' }}>

      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Image src="/logo.png" alt="Lakehouse HQ" width={180} height={60} className="object-contain" />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#A8D5DC] hover:text-white text-sm transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ backgroundColor: '#C9963A', color: '#0D1F35' }}>
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image src="/sunset.jpg" alt="Lake sunset" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,31,53,0.5) 0%, rgba(13,31,53,0.7) 100%)' }} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wider uppercase" style={{ backgroundColor: 'rgba(74,147,155,0.3)', color: '#A8D5DC', border: '1px solid rgba(74,147,155,0.5)' }}>
            Now serving your lake
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            Your lakehouse,<br />
            <span style={{ color: '#C9963A' }}>handled.</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#A8D5DC' }}>
            Lakehouse HQ combines a smart property app with a real local service team. Request tasks, track your property, and enjoy the lake without the stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 rounded-xl text-lg font-bold transition-colors" style={{ backgroundColor: '#C9963A', color: '#0D1F35' }}>
              Get Started for $250/mo
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl text-lg font-semibold transition-colors text-white" style={{ backgroundColor: 'rgba(74,147,155,0.3)', border: '1px solid rgba(74,147,155,0.5)' }}>
              Sign In
            </Link>
          </div>
          <p className="text-sm mt-4" style={{ color: '#A8D5DC' }}>No contracts. Cancel anytime.</p>
        </div>
      </section>

      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6 rounded-2xl p-8" style={{ backgroundColor: '#162D44' }}>
          {[
            { number: '$250', label: 'Per month', sub: 'Full app access included' },
            { number: '$50', label: 'Boat cover on/off', sub: 'Fixed price, no surprises' },
            { number: '24hr', label: 'Response time', sub: 'For all service requests' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold" style={{ color: '#C9963A' }}>{stat.number}</p>
              <p className="text-white font-semibold text-sm mt-1">{stat.label}</p>
              <p className="text-xs mt-1" style={{ color: '#A8D5DC' }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Stop managing.<br />
              <span style={{ color: '#4A939B' }}>Start enjoying.</span>
            </h2>
            <p className="text-lg mb-6 leading-relaxed" style={{ color: '#A8D5DC' }}>
              Lakehouse ownership should feel like a reward, not a second job. We handle the tasks so you can focus on making memories on the water.
            </p>
            <ul className="space-y-3">
              {[
                'Request services with a tap',
                'Get photo confirmation every time',
                'Track your property from anywhere',
                'Share packing lists with guests',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#4A939B' }}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden">
            <Image src="/dock.png" alt="Relaxing at the lake" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything your lakehouse needs</h2>
          <p style={{ color: '#A8D5DC' }}>One app. One team. Total peace of mind.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '🏡', title: 'Property Hub', desc: 'WiFi, access codes, emergency contacts, and house rules all in one secure place.' },
            { icon: '🔧', title: 'Task Requests', desc: 'Request services from a fixed price menu. We show up, you relax.' },
            { icon: '📸', title: 'Photo Confirmation', desc: 'Every completed job includes a photo so you always know it got done.' },
            { icon: '📦', title: 'Inventory Tracker', desc: 'Know exactly what is at the house, what needs restocking, and what is missing.' },
            { icon: '🚤', title: 'Boat and Watercraft', desc: 'Track your boat details, slip number, and jet ski info all in one place.' },
            { icon: '🧳', title: 'Trip Packing Lists', desc: 'Send guests a shareable checklist before they arrive. No app account needed.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl p-6 flex gap-4" style={{ backgroundColor: '#162D44' }}>
              <span className="text-3xl shrink-0">{feature.icon}</span>
              <div>
                <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#A8D5DC' }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden">
            <Image src="/boats.jpg" alt="Lake boats" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Simple, transparent pricing</h2>
            <p className="mb-6" style={{ color: '#A8D5DC' }}>Fixed prices for predictable tasks. No surprises, no negotiating.</p>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#162D44' }}>
              {[
                { task: 'Boat Cover On / Off', price: '$50' },
                { task: 'Jet Ski Cover On / Off', price: '$25' },
                { task: 'Patio Furniture Up / Down', price: '$35' },
                { task: 'Boat Fuel Top-Off', price: 'Actual cost' },
                { task: 'Seasonal Open Package', price: 'Quote' },
                { task: 'Seasonal Close Package', price: 'Quote' },
              ].map((item, i) => (
                <div key={item.task} className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: i % 2 === 0 ? '#162D44' : '#0D1F35' }}>
                  <span className="text-white text-sm">{item.task}</span>
                  <span className="font-bold text-sm" style={{ color: '#C9963A' }}>{item.price}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: '#A8D5DC' }}>All tasks require an active $250/month subscription.</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
          <p style={{ color: '#A8D5DC' }}>Three steps to a stress free lakehouse.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Sign up', desc: 'Create your account and add your lakehouse details in the Property Hub.' },
            { step: '02', title: 'Request a task', desc: 'Pick a service from the menu, choose a date and time, and submit.' },
            { step: '03', title: 'We handle it', desc: 'Our team shows up, gets it done, and sends you a photo confirmation.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#C9963A' }}>
                <span className="font-bold" style={{ color: '#0D1F35' }}>{item.step}</span>
              </div>
              <h3 className="text-white font-bold mb-2 text-lg">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#A8D5DC' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl overflow-hidden p-12">
          <Image src="/sunset.jpg" alt="Lake sunset" fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(13,31,53,0.85)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Image src="/logo.png" alt="Lakehouse HQ" width={160} height={54} className="object-contain mx-auto mb-6" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to enjoy the lake?</h2>
            <p className="mb-8" style={{ color: '#A8D5DC' }}>Join lakehouse owners who have handed off the hassle.</p>
            <Link href="/signup" className="px-8 py-4 rounded-xl text-lg font-bold transition-colors inline-block" style={{ backgroundColor: '#C9963A', color: '#0D1F35' }}>
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8" style={{ borderTop: '1px solid #162D44' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo.png" alt="Lakehouse HQ" width={120} height={40} className="object-contain" />
          <p className="text-sm" style={{ color: '#A8D5DC' }}>Your lakehouse, handled.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>Sign In</Link>
            <Link href="/signup" className="text-sm transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>Sign Up</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
