import type { ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type DocTableProps = {
  headers: ReactNode[]
  rows: ReactNode[][]
  compact?: boolean
}

type DocCodeBlockProps = {
  code: string
  language?: "bash" | "python" | "solidity" | "typescript"
}

const languageKeywords: Record<NonNullable<DocCodeBlockProps["language"]>, Set<string>> = {
  bash: new Set([
    "if",
    "then",
    "fi",
    "for",
    "in",
    "do",
    "done",
    "while",
    "case",
    "esac",
    "function",
    "export",
    "echo",
    "cd",
    "npm",
    "bun",
    "git",
    "node",
    "python",
  ]),
  python: new Set([
    "and",
    "as",
    "assert",
    "break",
    "class",
    "continue",
    "def",
    "elif",
    "else",
    "except",
    "False",
    "for",
    "from",
    "if",
    "import",
    "in",
    "None",
    "pass",
    "return",
    "True",
    "try",
    "while",
    "with",
    "yield",
  ]),
  solidity: new Set([
    "address",
    "bool",
    "bytes",
    "constructor",
    "contract",
    "else",
    "emit",
    "error",
    "event",
    "external",
    "function",
    "if",
    "import",
    "internal",
    "mapping",
    "memory",
    "override",
    "pragma",
    "public",
    "pure",
    "returns",
    "revert",
    "struct",
    "uint",
    "uint16",
    "uint64",
    "uint256",
    "view",
  ]),
  typescript: new Set([
    "async",
    "await",
    "const",
    "class",
    "export",
    "extends",
    "false",
    "for",
    "function",
    "if",
    "import",
    "interface",
    "let",
    "new",
    "null",
    "return",
    "true",
    "type",
    "undefined",
    "while",
  ]),
}

type Token = {
  type: "plain" | "comment" | "string" | "number" | "keyword"
  value: string
}

function getCommentStart(language?: DocCodeBlockProps["language"]) {
  if (!language) return null
  return language === "bash" || language === "python" ? "#" : "//"
}

function tokenizeCodeLine(line: string, language?: DocCodeBlockProps["language"]) {
  if (!language) {
    return [{ type: "plain", value: line }] satisfies Token[]
  }

  const tokens: Token[] = []
  const commentStart = getCommentStart(language)
  const keywords = languageKeywords[language]
  let index = 0

  while (index < line.length) {
    if (commentStart && line.startsWith(commentStart, index)) {
      tokens.push({ type: "comment", value: line.slice(index) })
      break
    }

    const char = line[index]

    if (char === '"' || char === "'" || char === "`") {
      let cursor = index + 1

      while (cursor < line.length) {
        if (line[cursor] === char && line[cursor - 1] !== "\\") {
          cursor += 1
          break
        }
        cursor += 1
      }

      tokens.push({ type: "string", value: line.slice(index, cursor) })
      index = cursor
      continue
    }

    if (/\d/.test(char)) {
      let cursor = index + 1

      while (cursor < line.length && /[\d._]/.test(line[cursor])) {
        cursor += 1
      }

      tokens.push({ type: "number", value: line.slice(index, cursor) })
      index = cursor
      continue
    }

    if (/[A-Za-z_$]/.test(char)) {
      let cursor = index + 1

      while (cursor < line.length && /[A-Za-z0-9_$]/.test(line[cursor])) {
        cursor += 1
      }

      const value = line.slice(index, cursor)
      tokens.push({ type: keywords.has(value) ? "keyword" : "plain", value })
      index = cursor
      continue
    }

    tokens.push({ type: "plain", value: char })
    index += 1
  }

  return tokens
}

function tokenClassName(type: Token["type"]) {
  switch (type) {
    case "comment":
      return "text-slate-500"
    case "string":
      return "text-emerald-300"
    case "number":
      return "text-amber-300"
    case "keyword":
      return "text-violet-300"
    default:
      return "text-slate-100"
  }
}

export function DocLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const classes = cn(
    "font-medium text-violet-300 underline decoration-violet-400/50 underline-offset-4 transition hover:text-violet-200",
    className
  )

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export function DocMuted({ children }: { children: ReactNode }) {
  return <span className="text-slate-400">{children}</span>
}

export function DocP({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[1.03rem] leading-8 text-slate-300", className)}>{children}</p>
}

export function DocLead({ children }: { children: ReactNode }) {
  return (
    <p className="text-balance text-[1.2rem] leading-9 text-slate-200 sm:text-[1.3rem]">
      {children}
    </p>
  )
}

export function DocPageTitle({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <header className="mb-12 border-b border-white/10 pb-10">
      <div className="mb-4 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
        Torus Protocol Docs
      </div>
      <h1 className="max-w-3xl text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  )
}

export function DocSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-6 pt-2">
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.8rem]">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function DocSubsection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
      {children}
    </section>
  )
}

export function DocList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 text-[1.03rem] leading-8 text-slate-300">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function DocOrderedList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-4 text-[1.03rem] leading-8 text-slate-300">
      {items.map((item, index) => (
        <li key={index} className="flex gap-4">
          <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-400/30 bg-violet-400/10 text-sm font-semibold text-violet-200">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

export function DocCallout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-5 py-4">
      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-violet-200">
        {title}
      </div>
      <div className="text-[0.98rem] leading-7 text-slate-300">{children}</div>
    </div>
  )
}

export function DocQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg italic leading-8 text-slate-200">
      {children}
    </blockquote>
  )
}

export function DocBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
      {children}
    </span>
  )
}

export function DocTable({ headers, rows, compact = false }: DocTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-white/5">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={cn(
                  "border-b border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300",
                  compact ? "whitespace-nowrap" : ""
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-white/5 px-4 py-3 text-[0.98rem] leading-7 text-slate-300 last:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DocCodeBlock({ code, language }: DocCodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n")

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-[0_24px_80px_rgba(5,10,24,0.5)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
          {language ?? "plain text"}
        </span>
        <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
          Code sample
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7">
        <code>
          {lines.map((line, lineIndex) => {
            const tokens = tokenizeCodeLine(line, language)

            return (
              <div key={`${line}-${lineIndex}`} className="min-h-7">
                {tokens.length === 0 ? (
                  <span className="text-slate-100">&nbsp;</span>
                ) : (
                  tokens.map((token, tokenIndex) => (
                    <span key={`${token.value}-${tokenIndex}`} className={tokenClassName(token.type)}>
                      {token.value}
                    </span>
                  ))
                )}
              </div>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
