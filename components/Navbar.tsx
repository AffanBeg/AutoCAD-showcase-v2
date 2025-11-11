export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur bg-black/30">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 grid place-items-center">🔧</div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Showcase3D</p>
            <h1 className="text-xl font-semibold leading-tight">Demo</h1>
          </div>
        </div>
        <nav className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1">
          <a className="h-9 px-3 rounded-lg text-sm hover:bg-white/5" href="/dashboard">Dashboard</a>
          <a className="h-9 px-3 rounded-lg text-sm hover:bg-white/5" href="/dashboard/new">New</a>
          <a className="h-9 px-3 rounded-lg text-sm hover:bg-white/5" href="/s/example-slug">Public</a>
        </nav>
      </div>
    </header>
  );
}
