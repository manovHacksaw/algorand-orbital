import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsShell } from "@/components/docs/docs-shell"
import { getAllDocSlugs } from "@/lib/docs-config"
import { getDocPageBySlug } from "@/lib/docs-content"

type DocsPageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getDocPageBySlug(slug)

  if (!page) {
    return {
      title: "Torus Protocol Docs",
    }
  }

  return {
    title: `${page.meta.title} - Torus Protocol Docs`,
    description: page.meta.description,
  }
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params
  const page = getDocPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return <DocsShell page={page.meta}>{page.content}</DocsShell>
}
