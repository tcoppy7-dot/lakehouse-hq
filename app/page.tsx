export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A2342] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">⚓</div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Lakehouse HQ
        </h1>
        <p className="text-xl text-[#5BA4CF] italic mb-8">
          Your lakehouse, handled.
        </p>
        <p className="text-[#F0F6FC] text-lg mb-12">
          Property management, concierge services, and peace of mind, all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="bg-[#1A7A8A] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#065A82] transition-colors">
            Sign In
          </a>
          <a href="/signup" className="bg-[#E8A838] text-[#0A2342] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#d4962e] transition-colors">
            Get Started
          </a>
        </div>
      </div>
    </main>
  )
}
