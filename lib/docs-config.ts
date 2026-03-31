export type DocTocItem = {
  id: string
  label: string
  level?: 2 | 3
}

export type DocPageKey =
  | "why-torus"
  | "overview"
  | "basics-introduction"
  | "basics-faq"
  | "basics-links"
  | "how-it-works-traders"
  | "how-it-works-liquidity-providers"
  | "how-it-works-the-math"
  | "rewards-current"
  | "rewards-referrals"
  | "rewards-details"
  | "rewards-previous"

export type DocPageMeta = {
  key: DocPageKey
  title: string
  description: string
  slug: string[]
  href: string
  toc: DocTocItem[]
}

export type DocNavLink = {
  title: string
  href: string
}

export type DocNavItem =
  | {
      title: string
      href: string
      items?: never
    }
  | {
      title: string
      href?: never
      items: DocNavLink[]
    }

export function createDocHref(slug: string[]) {
  return slug.length ? `/docs/${slug.join("/")}` : "/docs"
}

export const docPageMetas: DocPageMeta[] = [
  {
    key: "why-torus",
    title: "Why Torus",
    description:
      "Why multi-stablecoin liquidity needs a new AMM design, and how Torus brings concentrated liquidity to n-token pools on Algorand.",
    slug: ["why-torus"],
    href: createDocHref(["why-torus"]),
    toc: [
      { id: "the-problem-with-existing-amms", label: "The Problem with Existing AMMs" },
      { id: "what-torus-does-differently", label: "What Torus Does Differently" },
      { id: "built-on-algorand", label: "Built on Algorand" },
      { id: "the-origin", label: "The Origin" },
    ],
  },
  {
    key: "overview",
    title: "Overview",
    description:
      "A high-level look at Torus Protocol, its core features, and why spherical concentrated liquidity matters for stablecoin markets.",
    slug: ["overview"],
    href: createDocHref(["overview"]),
    toc: [
      { id: "key-features", label: "Key Features" },
      { id: "quick-links", label: "Quick Links" },
      { id: "protocol-stats", label: "Protocol Stats" },
    ],
  },
  {
    key: "basics-introduction",
    title: "Introduction",
    description:
      "Start here for the key concepts behind Torus, including pools, spheres, ticks, and the torus invariant.",
    slug: ["basics", "introduction"],
    href: createDocHref(["basics", "introduction"]),
    toc: [
      { id: "what-is-torus", label: "What is Torus?" },
      { id: "core-concepts", label: "Core Concepts" },
      { id: "how-to-use-these-docs", label: "How to Use These Docs" },
    ],
  },
  {
    key: "basics-faq",
    title: "Frequently Asked Questions",
    description:
      "Answers to the most common questions about trading, liquidity provision, protocol design, and technical implementation.",
    slug: ["basics", "faq"],
    href: createDocHref(["basics", "faq"]),
    toc: [
      { id: "general", label: "General" },
      { id: "trading", label: "Trading" },
      { id: "providing-liquidity", label: "Providing Liquidity" },
      { id: "technical", label: "Technical" },
    ],
  },
  {
    key: "basics-links",
    title: "Links & Resources",
    description:
      "Official links, technical references, background research, and Algorand resources related to Torus Protocol.",
    slug: ["basics", "links"],
    href: createDocHref(["basics", "links"]),
    toc: [
      { id: "official", label: "Official" },
      { id: "technical-resources", label: "Technical Resources" },
      { id: "research-and-background", label: "Research and Background" },
      { id: "algorand-resources", label: "Algorand Resources" },
    ],
  },
  {
    key: "how-it-works-traders",
    title: "How It Works: Traders",
    description:
      "See the complete swap flow, from wallet connection to invariant verification and segmented execution across tick boundaries.",
    slug: ["how-it-works", "traders"],
    href: createDocHref(["how-it-works", "traders"]),
    toc: [
      { id: "swapping-tokens", label: "Swapping Tokens" },
      { id: "what-happens-under-the-hood", label: "What Happens Under the Hood" },
      { id: "understanding-price-impact", label: "Understanding Price Impact" },
      { id: "fees", label: "Fees" },
    ],
  },
  {
    key: "how-it-works-liquidity-providers",
    title: "How It Works: Liquidity Providers",
    description:
      "Learn how ticks work, how capital efficiency changes with tick width, and what risks LPs take when supplying liquidity.",
    slug: ["how-it-works", "liquidity-providers"],
    href: createDocHref(["how-it-works", "liquidity-providers"]),
    toc: [
      { id: "key-concepts", label: "Key Concepts" },
      { id: "adding-liquidity", label: "Adding Liquidity" },
      { id: "removing-liquidity", label: "Removing Liquidity" },
      { id: "risks", label: "Risks" },
    ],
  },
  {
    key: "how-it-works-the-math",
    title: "How It Works: The Math",
    description:
      "A readable tour of the sphere invariant, tick boundaries, torus consolidation, and how trades are computed in O(1) time.",
    slug: ["how-it-works", "the-math"],
    href: createDocHref(["how-it-works", "the-math"]),
    toc: [
      { id: "the-sphere-amm", label: "The Sphere AMM" },
      { id: "token-pricing", label: "Token Pricing" },
      { id: "the-equal-price-point", label: "The Equal Price Point" },
      { id: "tick-boundaries", label: "Tick Boundaries" },
      { id: "capital-efficiency", label: "Capital Efficiency" },
      { id: "the-torus-invariant", label: "The Torus Invariant" },
      { id: "computing-trades", label: "Computing Trades" },
      { id: "further-reading", label: "Further Reading" },
    ],
  },
  {
    key: "rewards-current",
    title: "Current Rewards",
    description:
      "A snapshot of the live or upcoming liquidity mining and trading incentives available to Torus users.",
    slug: ["rewards", "current"],
    href: createDocHref(["rewards", "current"]),
    toc: [
      { id: "active-programs", label: "Active Programs" },
      { id: "how-to-participate", label: "How to Participate" },
    ],
  },
  {
    key: "rewards-referrals",
    title: "Referral Program",
    description:
      "How referral links work, what actions are rewarded, and the terms for referral distributions.",
    slug: ["rewards", "referrals"],
    href: createDocHref(["rewards", "referrals"]),
    toc: [
      { id: "how-it-works", label: "How It Works" },
      { id: "reward-structure", label: "Reward Structure" },
      { id: "terms", label: "Terms" },
    ],
  },
  {
    key: "rewards-details",
    title: "Rewards Details",
    description:
      "Token utility, reward formulas, claiming behavior, and the details behind how incentives are calculated.",
    slug: ["rewards", "details"],
    href: createDocHref(["rewards", "details"]),
    toc: [
      { id: "torus-token", label: "TORUS Token" },
      { id: "reward-calculation", label: "Reward Calculation" },
      { id: "claiming-rewards", label: "Claiming Rewards" },
      { id: "vesting", label: "Vesting" },
    ],
  },
  {
    key: "rewards-previous",
    title: "Previous Rewards",
    description:
      "An archive of completed incentive programs and the prize structures used in earlier campaigns.",
    slug: ["rewards", "previous"],
    href: createDocHref(["rewards", "previous"]),
    toc: [
      { id: "completed-programs", label: "Completed Programs" },
    ],
  },
]

export const docsNavigation: DocNavItem[] = [
  {
    title: "Why Torus",
    href: createDocHref(["why-torus"]),
  },
  {
    title: "Overview",
    href: createDocHref(["overview"]),
  },
  {
    title: "Basics",
    items: [
      { title: "Introduction", href: createDocHref(["basics", "introduction"]) },
      { title: "FAQ", href: createDocHref(["basics", "faq"]) },
      { title: "Links", href: createDocHref(["basics", "links"]) },
    ],
  },
  {
    title: "How It Works",
    items: [
      { title: "Traders", href: createDocHref(["how-it-works", "traders"]) },
      {
        title: "Liquidity Providers",
        href: createDocHref(["how-it-works", "liquidity-providers"]),
      },
      { title: "The Math", href: createDocHref(["how-it-works", "the-math"]) },
    ],
  },
  {
    title: "Rewards",
    items: [
      { title: "Current Rewards", href: createDocHref(["rewards", "current"]) },
      { title: "Referrals", href: createDocHref(["rewards", "referrals"]) },
      { title: "Rewards Details", href: createDocHref(["rewards", "details"]) },
      { title: "Previous Rewards", href: createDocHref(["rewards", "previous"]) },
    ],
  },
]

export const docsRedirectAliases = [
  { source: "/why-torus", destination: createDocHref(["why-torus"]) },
  { source: "/overview", destination: createDocHref(["overview"]) },
  { source: "/basics/introduction", destination: createDocHref(["basics", "introduction"]) },
  { source: "/basics/faq", destination: createDocHref(["basics", "faq"]) },
  { source: "/basics/links", destination: createDocHref(["basics", "links"]) },
  {
    source: "/how-it-works/traders",
    destination: createDocHref(["how-it-works", "traders"]),
  },
  {
    source: "/how-it-works/liquidity-providers",
    destination: createDocHref(["how-it-works", "liquidity-providers"]),
  },
  {
    source: "/how-it-works/the-math",
    destination: createDocHref(["how-it-works", "the-math"]),
  },
  { source: "/rewards/current", destination: createDocHref(["rewards", "current"]) },
  { source: "/rewards/referrals", destination: createDocHref(["rewards", "referrals"]) },
  { source: "/rewards/details", destination: createDocHref(["rewards", "details"]) },
  { source: "/rewards/previous", destination: createDocHref(["rewards", "previous"]) },
]

export function getDocMetaBySlug(slug?: string[]) {
  const normalizedSlug = slug && slug.length > 0 ? slug : ["why-torus"]
  return docPageMetas.find((page) => page.slug.join("/") === normalizedSlug.join("/"))
}

export function getDocMetaByHref(href: string) {
  const normalizedHref = href === "/docs" ? createDocHref(["why-torus"]) : href.replace(/\/$/, "")
  return docPageMetas.find((page) => page.href === normalizedHref)
}

export function getAllDocSlugs() {
  return docPageMetas.map((page) => page.slug)
}

export function normalizeDocPath(pathname: string) {
  if (pathname === "/docs" || pathname === "/docs/") {
    return createDocHref(["why-torus"])
  }

  return pathname.replace(/\/$/, "")
}
