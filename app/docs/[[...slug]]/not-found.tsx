import Link from "next/link"

export default function DocsNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070913] px-6 text-slate-100">
      <div className="max-w-lg rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_120px_rgba(4,9,24,0.45)]">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
          Torus Protocol Docs
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Page not found</h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          The documentation page you tried to open does not exist, or the route has changed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-xl border border-violet-400/25 bg-violet-400/10 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-400/15"
          >
            Back to Docs
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Back to Site
          </Link>
        </div>
      </div>
    </main>
  )
}
