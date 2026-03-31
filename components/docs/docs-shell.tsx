"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Menu, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

import { docsNavigation, normalizeDocPath, type DocNavItem, type DocPageMeta } from "@/lib/docs-config"
import { cn } from "@/lib/utils"

const footerLinks = [
  {
    label: "GitHub",
    href: "https://github.com/manovHacksaw/algorand-orbital",
  },
  {
    label: "Twitter",
  },
  {
    label: "Discord",
  },
]

type DocsShellProps = {
  page: DocPageMeta
  children: ReactNode
}

function isGroup(item: DocNavItem): item is Extract<DocNavItem, { items: { title: string; href: string }[] }> {
  return "items" in item
}

function FooterLink({ label, href }: { label: string; href?: string }) {
  if (!href) {
    return <span className="text-slate-500">{label}</span>
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="transition hover:text-violet-200"
    >
      {label}
    </a>
  )
}

function SidebarNavigation({
  activePath,
  openGroups,
  onToggleGroup,
  onNavigate,
}: {
  activePath: string
  openGroups: Record<string, boolean>
  onToggleGroup: (title: string) => void
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-2">
      {docsNavigation.map((item) => {
        if (!isGroup(item)) {
          const active = item.href === activePath

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "border border-violet-400/30 bg-violet-400/15 text-violet-100 shadow-[0_0_0_1px_rgba(167,139,250,0.05)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.title}
            </Link>
          )
        }

        const open = openGroups[item.title]
        const containsActive = item.items.some((child) => child.href === activePath)

        return (
          <div key={item.title} className="rounded-2xl border border-white/6 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => onToggleGroup(item.title)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                containsActive ? "text-white" : "text-slate-300 hover:text-white"
              )}
            >
              <span>{item.title}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  open ? "rotate-90 text-violet-300" : "text-slate-500"
                )}
              />
            </button>

            {open ? (
              <div className="space-y-1 px-2 pb-2">
                {item.items.map((child) => {
                  const active = child.href === activePath

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-sm transition",
                        active
                          ? "bg-violet-400/15 text-violet-100"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {child.title}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

export function DocsShell({ page, children }: DocsShellProps) {
  const pathname = usePathname()
  const activePath = normalizeDocPath(pathname ?? page.href)
  const [mobileOpen, setMobileOpen] = useState(false)
  const defaultGroups = useMemo(
    () =>
      Object.fromEntries(
        docsNavigation.filter(isGroup).map((item) => [item.title, true])
      ) as Record<string, boolean>,
    []
  )
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultGroups)

  useEffect(() => {
    setMobileOpen(false)
  }, [activePath])

  useEffect(() => {
    setOpenGroups((previous) => {
      const next = { ...previous }

      docsNavigation.filter(isGroup).forEach((item) => {
        if (item.items.some((child) => child.href === activePath)) {
          next[item.title] = true
        }
      })

      return next
    })
  }, [activePath])

  const toggleGroup = (title: string) => {
    setOpenGroups((previous) => ({
      ...previous,
      [title]: !previous[title],
    }))
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070913] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,92,252,0.22),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(180deg,_#06070d_0%,_#0b1020_45%,_#070913_100%)]" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/5" />
      </div>

      <div className="mx-auto max-w-[1560px] xl:grid xl:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_240px]">
        <aside className="hidden border-r border-white/10 px-6 py-8 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col">
          <Link href="/docs" className="group flex items-center gap-3 rounded-2xl px-2 py-2">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/20 bg-violet-400/10">
              <Image src="/logo.png" alt="Torus" width={36} height={36} className="h-9 w-9 object-contain" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-white">Torus</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Documentation</div>
            </div>
          </Link>

          <div className="mt-8 grid gap-3">
            <Link
              href="/swap"
              className="rounded-xl border border-violet-400/25 bg-violet-400/10 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-400/15"
            >
              Launch App
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Back to Site
            </Link>
          </div>

          <div className="mt-8 flex-1 overflow-y-auto pr-1">
            <SidebarNavigation
              activePath={activePath}
              openGroups={openGroups}
              onToggleGroup={toggleGroup}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-400">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
              Torus Thesis
            </div>
            One pool. Every stable. Swap.
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-40 border-b border-white/10 bg-[#070913]/85 backdrop-blur xl:hidden">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                aria-label="Open documentation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Docs</div>
                <div className="truncate text-sm font-semibold text-white">{page.title}</div>
              </div>
            </div>
          </div>

          <main className="px-4 pb-14 pt-6 sm:px-8 xl:px-12 xl:pt-10">
            <div className="mx-auto max-w-[720px]">
              <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-6 shadow-[0_24px_120px_rgba(4,9,24,0.45)] backdrop-blur sm:px-8 sm:py-10 xl:px-10">
                {children}
              </article>
            </div>
          </main>

          <footer className="border-t border-white/10 px-4 py-8 text-sm text-slate-400 sm:px-8 xl:px-12">
            <div className="mx-auto flex max-w-[720px] flex-wrap items-center justify-between gap-3">
              <p>© 2026 Torus Protocol</p>
              <div className="flex flex-wrap items-center gap-4">
                {footerLinks.map((item) => (
                  <FooterLink key={item.label} label={item.label} href={item.href} />
                ))}
              </div>
            </div>
          </footer>
        </div>

        <aside className="hidden border-l border-white/10 px-6 py-10 2xl:block">
          <div className="sticky top-10">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              On this page
            </div>
            <nav className="space-y-1">
              {page.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 hover:text-white",
                    item.level === 3 ? "ml-3 text-slate-500" : "text-slate-400"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#04050a]/80 backdrop-blur-sm"
            aria-label="Close documentation menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,320px)] flex-col border-r border-white/10 bg-[#0b1020] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/docs" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/20 bg-violet-400/10">
                  <Image src="/logo.png" alt="Torus" width={34} height={34} className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <div className="text-base font-semibold text-white">Torus</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Documentation</div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200"
                aria-label="Close documentation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 grid gap-3">
              <Link
                href="/swap"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-violet-400/25 bg-violet-400/10 px-4 py-3 text-sm font-semibold text-violet-100"
              >
                Launch App
              </Link>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300"
              >
                Back to Site
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <SidebarNavigation
                activePath={activePath}
                openGroups={openGroups}
                onToggleGroup={toggleGroup}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
