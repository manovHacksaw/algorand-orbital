import type { ReactNode } from "react"

import {
  DocBadge,
  DocCallout,
  DocCodeBlock,
  DocLead,
  DocLink,
  DocList,
  DocMuted,
  DocOrderedList,
  DocP,
  DocPageTitle,
  DocQuote,
  DocSection,
  DocSubsection,
  DocTable,
} from "@/components/docs/doc-primitives"
import { docPageMetas, getDocMetaBySlug, type DocPageMeta, type DocPageKey } from "@/lib/docs-config"

const GITHUB_REPO = "https://github.com/manovHacksaw/algorand-orbital"
const ORBITAL_PAPER = "https://www.paradigm.xyz/2025/06/orbital"
const ALGORAND_DOCS = "https://dev.algorand.co"
const ALGOKIT = "https://developer.algorand.org/algokit/"
const PERA_WALLET = "https://perawallet.app"
const ALGORAND_EXPLORER = "https://explorer.perawallet.app"
const DESMOS = "https://www.desmos.com"

type DocPage = {
  meta: DocPageMeta
  content: ReactNode
}

function metaFor(key: DocPageKey) {
  const meta = docPageMetas.find((page) => page.key === key)

  if (!meta) {
    throw new Error(`Missing docs metadata for ${key}`)
  }

  return meta
}

function ResourceLink({ href, label }: { href?: string; label: string }) {
  return href ? <DocLink href={href}>{label}</DocLink> : <DocMuted>{label}</DocMuted>
}

function LinkCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href?: string
}) {
  const content = (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-violet-400/30 hover:bg-violet-400/5">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">{title}</div>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
      <div className="mt-4 text-sm font-medium text-violet-300">{href ? "Open ->" : "Coming soon"}</div>
    </div>
  )

  return href ? (
    <DocLink href={href} className="no-underline">
      {content}
    </DocLink>
  ) : (
    content
  )
}

function FeatureCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-3 text-[0.98rem] leading-7 text-slate-300">{children}</div>
    </div>
  )
}

function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">{question}</h3>
      <div className="mt-3 text-[1rem] leading-8 text-slate-300">{answer}</div>
    </div>
  )
}

const docPagesByKey: Record<DocPageKey, DocPage> = {
  "why-torus": {
    meta: metaFor("why-torus"),
    content: (
      <>
        <DocPageTitle title="Why Torus">
          <DocLead>
            The future holds a million stablecoins. Today&apos;s infrastructure is not ready.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-10">
          <DocP>
            Every new stablecoin, whether it is backed by treasuries, real-world assets, or
            algorithmic mechanisms, needs deep liquidity against every other stablecoin. With
            traditional AMMs, that means separate pools for every pair. Liquidity fragments,
            spreads widen, and capital efficiency falls apart.
          </DocP>

          <DocP className="text-white">
            <strong>Torus fixes this.</strong>
          </DocP>

          <DocSection id="the-problem-with-existing-amms" title="The Problem with Existing AMMs">
            <DocP>
              <strong>Uniswap V3</strong> pioneered concentrated liquidity, but it only supports
              pools between two assets. In a world with dozens of stablecoins, that is not enough.
            </DocP>
            <DocP>
              <strong>Curve Finance</strong> created multi-token stablecoin pools, but every LP in
              a Curve pool gets the same liquidity profile. One LP cannot focus tightly around the
              peg while another chooses broader coverage for depeg events.
            </DocP>
            <DocP>
              Neither approach gives you both multi-token pools and customizable concentrated
              liquidity.
            </DocP>
          </DocSection>

          <DocSection id="what-torus-does-differently" title="What Torus Does Differently">
            <DocP>
              Torus is the first AMM that brings concentrated liquidity to pools of three or more
              stablecoins by using the surface of a mathematical sphere as the trading surface.
            </DocP>

            <DocSubsection title="One Pool, Every Stablecoin">
              <DocP>
                Instead of fragmenting liquidity across dozens of pair pools, Torus lets you create
                a single pool containing 2, 5, or even hundreds of stablecoins. Every token can be
                swapped for every other token directly.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Concentrated Liquidity in Higher Dimensions">
              <DocP>
                LPs choose how tightly to concentrate their liquidity. Narrow ticks maximize capital
                efficiency near the peg. Wider ticks stay active across deeper dislocations.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Massive Capital Efficiency">
              <DocP>
                Inner ticks do not need capital in reserve for extreme depeg scenarios, which lets
                LPs reach dramatically better capital efficiency than uniform-liquidity designs.
              </DocP>
              <DocTable
                headers={["Depeg coverage", "Capital efficiency vs. Curve"]}
                rows={[
                  ["Down to $0.99", "~150x"],
                  ["Down to $0.95", "~30x"],
                  ["Down to $0.90", "~15x"],
                ]}
                compact
              />
              <DocP>
                A $1,000 LP position in a Torus tick covering $0.99 depegs can offer similar market
                depth to roughly $150,000 in a traditional Curve-style pool.
              </DocP>
            </DocSubsection>
          </DocSection>

          <DocSection id="built-on-algorand" title="Built on Algorand">
            <DocList
              items={[
                <>
                  <strong>Instant finality</strong> keeps swaps predictable and confirms them in
                  roughly 3.3 seconds.
                </>,
                <>
                  <strong>Near-zero fees</strong> make stablecoin trading economical even for
                  smaller positions.
                </>,
                <>
                  <strong>Native sqrt opcode</strong> is a natural fit for the sphere and torus
                  math.
                </>,
                <>
                  <strong>Box storage</strong> gives the protocol room for tick data and LP state.
                </>,
                <>
                  <strong>Atomic groups</strong> let multi-step swaps settle as one all-or-nothing
                  operation.
                </>,
              ]}
            />
          </DocSection>

          <DocSection id="the-origin" title="The Origin">
            <DocP>
              Torus implements the Orbital AMM design published by Paradigm in June 2025 and
              authored by Dave White, Dan Robinson, and Ciamac Moallemi. The paper lays out the
              framework; Torus brings it to Algorand.
            </DocP>
            <DocQuote>&quot;Donuts &gt; Curves.&quot;</DocQuote>
          </DocSection>
        </div>
      </>
    ),
  },
  overview: {
    meta: metaFor("overview"),
    content: (
      <>
        <DocPageTitle title="Overview">
          <DocLead>
            Torus Protocol is a decentralized exchange on Algorand optimized for stablecoin swaps.
            It uses spherical geometry with concentrated liquidity to create multi-token pools with
            unusually high capital efficiency.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="key-features" title="Key Features">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard title="Multi-Token Pools">
                Swap between any stablecoins in a single pool, with no routing through intermediate
                pairs.
              </FeatureCard>
              <FeatureCard title="Concentrated Liquidity">
                LPs choose their own risk and reward profile by selecting tick boundaries.
              </FeatureCard>
              <FeatureCard title="Capital Efficient">
                A tick covering down to $0.99 can provide around 150x the effective liquidity of a
                uniform pool.
              </FeatureCard>
              <FeatureCard title="Constant-Time Swaps">
                Swap computation remains O(1) no matter how many tokens live in a pool.
              </FeatureCard>
              <FeatureCard title="Permissionless">
                Anyone can create pools, add liquidity, or trade without gatekeepers.
              </FeatureCard>
            </div>
          </DocSection>

          <DocSection id="quick-links" title="Quick Links">
            <div className="grid gap-4 sm:grid-cols-2">
              <LinkCard
                title="Swap"
                description="Jump into the trading interface and quote swaps against the current pool UI."
                href="/swap"
              />
              <LinkCard
                title="Add Liquidity"
                description="Open the pool flow and explore where LP positions and liquidity management will live."
                href="/pool"
              />
              <LinkCard
                title="Smart Contracts"
                description="Browse the public repository for the current codebase, deployment tooling, and supporting artifacts."
                href={GITHUB_REPO}
              />
              <LinkCard
                title="Original Paper"
                description="Read Paradigm&apos;s Orbital AMM paper for the full research background."
                href={ORBITAL_PAPER}
              />
            </div>
          </DocSection>

          <DocSection id="protocol-stats" title="Protocol Stats">
            <DocTable
              headers={["Metric", "Value"]}
              rows={[
                ["Chain", "Algorand"],
                ["Pool type", "Multi-token stablecoin"],
                ["Max tokens per pool", "Unlimited in theory, practical limit around 200"],
                ["Swap complexity", "O(1) per trade"],
                ["Finality", "~3.3 seconds"],
                ["Fees", "Configurable per pool"],
              ]}
            />
          </DocSection>
        </div>
      </>
    ),
  },
  "basics-introduction": {
    meta: metaFor("basics-introduction"),
    content: (
      <>
        <DocPageTitle title="Introduction">
          <DocLead>
            Welcome to the Torus Protocol docs. This guide is here to help traders, liquidity
            providers, and developers understand how Torus works and how to navigate the protocol.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="what-is-torus" title="What is Torus?">
            <DocP>
              Torus is an automated market maker, or AMM. Instead of matching buyers and sellers
              directly, trades execute against a pool of tokens held by the protocol. Prices come
              from a mathematical invariant.
            </DocP>
            <DocP>
              What makes Torus unique is that invariant. Instead of using the constant-product
              formula from Uniswap or the StableSwap curve from Curve, Torus uses the surface of a
              mathematical sphere in n-dimensional space, where n is the number of tokens in the
              pool.
            </DocP>
          </DocSection>

          <DocSection id="core-concepts" title="Core Concepts">
            <DocSubsection title="Pools">
              <DocP>
                A Torus pool contains n stablecoin tokens as Algorand Standard Assets. Every token
                in the pool can be swapped directly for every other token in the same pool.
              </DocP>
            </DocSubsection>

            <DocSubsection title="The Sphere">
              <DocP>
                The AMM state lives on the surface of an n-dimensional sphere. As trades happen,
                the reserve point slides across that surface while prices remain internally
                consistent.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Ticks">
              <DocP>
                A tick is a liquidity position created by an LP. Each tick defines a spherical cap
                by specifying how far from the equal-price point the position extends.
              </DocP>
            </DocSubsection>

            <DocSubsection title="The Torus Invariant">
              <DocP>
                When the pool has multiple ticks, the active geometry consolidates into a torus.
                That torus equation is what the protocol uses to compute and verify trades.
              </DocP>
            </DocSubsection>
          </DocSection>

          <DocSection id="how-to-use-these-docs" title="How to Use These Docs">
            <DocList
              items={[
                <>
                  <strong>Traders:</strong> start with{" "}
                  <DocLink href="/docs/how-it-works/traders">How It Works: Traders</DocLink>.
                </>,
                <>
                  <strong>LPs:</strong> read{" "}
                  <DocLink href="/docs/how-it-works/liquidity-providers">
                    How It Works: Liquidity Providers
                  </DocLink>.
                </>,
                <>
                  <strong>Math-curious readers:</strong> head to{" "}
                  <DocLink href="/docs/how-it-works/the-math">How It Works: The Math</DocLink>.
                </>,
                <>
                  <strong>Resources and references:</strong> use{" "}
                  <DocLink href="/docs/basics/links">Basics: Links</DocLink>.
                </>,
              ]}
            />
          </DocSection>
        </div>
      </>
    ),
  },
  "basics-faq": {
    meta: metaFor("basics-faq"),
    content: (
      <>
        <DocPageTitle title="Frequently Asked Questions">
          <DocLead>
            Common questions about Torus, stablecoin trading, liquidity provision, and the
            protocol&apos;s compute model.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="general" title="General">
            <div className="space-y-4">
              <FaqItem
                question="What is Torus Protocol?"
                answer={
                  <>
                    Torus is a decentralized exchange on Algorand for swapping stablecoins. It uses
                    spherical geometry to create multi-token pools with concentrated liquidity, so
                    traders can swap any stablecoin for any other in one pool while LPs get much
                    better capital efficiency than traditional DEXs.
                  </>
                }
              />
              <FaqItem
                question="What chain is Torus on?"
                answer={
                  <>
                    Algorand. The protocol leans on Algorand&apos;s quick finality, low fees, native
                    math opcodes like <code>sqrt</code>, and box storage for tick and LP state.
                  </>
                }
              />
              <FaqItem
                question="Is Torus only for stablecoins?"
                answer={
                  <>
                    The design is best suited to assets that should trade near a 1:1 ratio, such as
                    stablecoins, wrapped assets, and similar instruments. It is not meant for highly
                    volatile pairs like ETH/USDC.
                  </>
                }
              />
              <FaqItem
                question="What is the relationship to the Paradigm Orbital paper?"
                answer={
                  <>
                    Torus is an implementation of the Orbital AMM design published by Dave White,
                    Dan Robinson, and Ciamac Moallemi at Paradigm in June 2025. The paper describes
                    the framework; Torus adapts it to Algorand.
                  </>
                }
              />
            </div>
          </DocSection>

          <DocSection id="trading" title="Trading">
            <div className="space-y-4">
              <FaqItem
                question="How do I swap tokens?"
                answer={
                  <>
                    Connect an Algorand wallet, choose the token you want to sell and the token you
                    want to buy, enter an amount, and confirm the transaction group. Swaps settle
                    atomically on Algorand, usually within 3 to 4 seconds.
                  </>
                }
              />
              <FaqItem
                question="What are the fees?"
                answer={
                  <>
                    Pool fees are configured per pool and distributed to LPs. The target range for
                    stablecoin pools is usually around 0.01% to 0.05%, plus a very small Algorand
                    network fee.
                  </>
                }
              />
              <FaqItem
                question="What is slippage?"
                answer={
                  <>
                    Slippage is the difference between the quoted price and the final execution
                    price. For small trades in deep pools it is minimal, but it grows as the trade
                    consumes more liquidity.
                  </>
                }
              />
              <FaqItem
                question="Can I swap any token for any other in the pool?"
                answer={
                  <>
                    Yes. In a pool with five tokens, every token is directly swappable against the
                    other four without routing through an intermediate pair.
                  </>
                }
              />
            </div>
          </DocSection>

          <DocSection id="providing-liquidity" title="Providing Liquidity">
            <div className="space-y-4">
              <FaqItem
                question="How do I earn fees?"
                answer={
                  <>
                    Deposit tokens into a tick. When swaps route through that tick&apos;s active range,
                    you earn a pro-rata share of the pool fees based on your share of liquidity.
                  </>
                }
              />
              <FaqItem
                question="What is a tick?"
                answer={
                  <>
                    A tick defines how far from the equal-price point your liquidity covers.
                    Narrower ticks are more capital efficient but stop earning if the market moves
                    outside the range.
                  </>
                }
              />
              <FaqItem
                question="What is impermanent loss?"
                answer={
                  <>
                    Impermanent loss happens when the relative value of the assets in your position
                    changes. In stablecoin pools it is usually modest during normal conditions, but
                    it becomes meaningful if one asset depegs hard.
                  </>
                }
              />
              <FaqItem
                question="Can I lose money providing liquidity?"
                answer={
                  <>
                    Yes. If a stablecoin in the pool depegs materially, your position can end up
                    holding more of the weak asset and less of the stronger ones.
                  </>
                }
              />
            </div>
          </DocSection>

          <DocSection id="technical" title="Technical">
            <div className="space-y-4">
              <FaqItem
                question="Is the code open source?"
                answer={
                  <>
                    Yes. The current repository is public here:{" "}
                    <DocLink href={GITHUB_REPO}>algorand-orbital</DocLink>.
                  </>
                }
              />
              <FaqItem
                question="Has the protocol been audited?"
                answer={
                  <>
                    The audit status is not published in this repository yet. This page should be
                    updated once a formal audit process is announced or completed.
                  </>
                }
              />
              <FaqItem
                question="How does the compute off-chain, verify on-chain pattern work?"
                answer={
                  <>
                    The heavy math, including quartic solving and Newton iterations, is computed
                    off-chain by the SDK. The smart contract verifies the claimed result against the
                    torus invariant on-chain, which is much cheaper than re-solving the full
                    equation inside the AVM.
                  </>
                }
              />
            </div>
          </DocSection>
        </div>
      </>
    ),
  },
  "basics-links": {
    meta: metaFor("basics-links"),
    content: (
      <>
        <DocPageTitle title="Links & Resources">
          <DocLead>
            Official links, background reading, and practical Algorand resources related to Torus
            Protocol.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="official" title="Official">
            <DocTable
              headers={["Resource", "Link"]}
              rows={[
                ["Website", <ResourceLink key="website" href="/" label="torus protocol app" />],
                ["App (Swap)", <ResourceLink key="swap" href="/swap" label="swap interface" />],
                ["GitHub", <ResourceLink key="github" href={GITHUB_REPO} label="algorand-orbital" />],
                ["Twitter / X", <ResourceLink key="twitter" label="Coming soon" />],
                ["Discord", <ResourceLink key="discord" label="Coming soon" />],
              ]}
            />
          </DocSection>

          <DocSection id="technical-resources" title="Technical Resources">
            <DocTable
              headers={["Resource", "Description"]}
              rows={[
                [
                  "Smart contracts",
                  <>
                    Current repository and implementation artifacts -{" "}
                    <ResourceLink href={GITHUB_REPO} label="GitHub" />
                  </>,
                ],
                [
                  "TypeScript SDK",
                  <>
                    Off-chain trade computation and transaction building -{" "}
                    <ResourceLink label="Coming soon" />
                  </>,
                ],
                [
                  "API reference",
                  <>
                    SDK and integration docs - <ResourceLink label="Coming soon" />
                  </>,
                ],
                [
                  "Testnet app",
                  <>
                    Public testnet interface - <ResourceLink label="Coming soon" />
                  </>,
                ],
              ]}
            />
          </DocSection>

          <DocSection id="research-and-background" title="Research and Background">
            <DocTable
              headers={["Resource", "Description"]}
              rows={[
                [
                  "Orbital Paper (Paradigm)",
                  <>
                    The original research paper by Dave White, Dan Robinson, and Ciamac Moallemi -{" "}
                    <ResourceLink href={ORBITAL_PAPER} label="Read" />
                  </>,
                ],
                [
                  "Implementation Manual",
                  <>
                    Detailed technical notes and repo context -{" "}
                    <ResourceLink href={GITHUB_REPO} label="Repository" />
                  </>,
                ],
                [
                  "Capital Efficiency Calculator",
                  <>
                    Interactive exploration of efficiency curves -{" "}
                    <ResourceLink href={DESMOS} label="Desmos" />
                  </>,
                ],
              ]}
            />
          </DocSection>

          <DocSection id="algorand-resources" title="Algorand Resources">
            <DocTable
              headers={["Resource", "Description"]}
              rows={[
                [
                  "Algorand Developer Docs",
                  <>
                    Official Algorand docs - <ResourceLink href={ALGORAND_DOCS} label="Read" />
                  </>,
                ],
                [
                  "AlgoKit",
                  <>
                    Algorand development toolkit - <ResourceLink href={ALGOKIT} label="Learn more" />
                  </>,
                ],
                [
                  "Pera Wallet",
                  <>
                    Recommended Algorand wallet -{" "}
                    <ResourceLink href={PERA_WALLET} label="Download" />
                  </>,
                ],
                [
                  "Algorand Explorer",
                  <>
                    Browse transactions and contracts -{" "}
                    <ResourceLink href={ALGORAND_EXPLORER} label="Explore" />
                  </>,
                ],
              ]}
            />
          </DocSection>
        </div>
      </>
    ),
  },
  "how-it-works-traders": {
    meta: metaFor("how-it-works-traders"),
    content: (
      <>
        <DocPageTitle title="How It Works: Traders">
          <DocLead>
            Trading on Torus is simple at the surface, even though some serious geometry runs
            underneath.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="swapping-tokens" title="Swapping Tokens">
            <DocOrderedList
              items={[
                <>
                  <strong>Connect your wallet.</strong> Use an Algorand wallet like Pera, Defly, or
                  Lute, and keep a bit of ALGO available for fees.
                </>,
                <>
                  <strong>Select your tokens.</strong> Choose the token you want to sell and the
                  token you want to receive. Both assets must belong to the same Torus pool.
                </>,
                <>
                  <strong>Enter the trade size.</strong> The app computes the expected output,
                  effective price, and price impact.
                </>,
                <>
                  <strong>Set slippage tolerance.</strong> A default around 0.5% is usually enough
                  for stablecoin swaps, though smaller trades can often use a tighter threshold.
                </>,
                <>
                  <strong>Confirm the transaction group.</strong> Your wallet signs a group of
                  Algorand transactions that settles in about 3 to 4 seconds.
                </>,
              ]}
            />
          </DocSection>

          <DocSection id="what-happens-under-the-hood" title="What Happens Under the Hood">
            <DocOrderedList
              items={[
                <>
                  <strong>The SDK computes the output off-chain.</strong> It uses Newton&apos;s method
                  on the torus invariant to solve for the best possible output amount.
                </>,
                <>
                  <strong>An atomic group is assembled.</strong> That group includes the user&apos;s
                  token transfer, any budget-pooling transactions, and the swap application call.
                </>,
                <>
                  <strong>The smart contract verifies the result.</strong> The contract does not
                  re-solve the equation. It checks that the claimed output satisfies the invariant.
                </>,
                <>
                  <strong>The swap either fully succeeds or fully fails.</strong> If the math is
                  invalid, slippage is exceeded, or liquidity is insufficient, the whole group fails
                  atomically.
                </>,
              ]}
            />
          </DocSection>

          <DocSection id="understanding-price-impact" title="Understanding Price Impact">
            <DocP>For small trades, the price is close to the instantaneous price:</DocP>
            <DocCodeBlock code={`price(token_j / token_i) = (r - reserve_i) / (r - reserve_j)`} />
            <DocP>
              As the trade gets larger, the pool state moves farther along the sphere surface and
              the price gets worse. If a large trade crosses a tick boundary, it gets segmented so
              each portion executes against the correct active geometry.
            </DocP>
          </DocSection>

          <DocSection id="fees" title="Fees">
            <DocP>
              Each swap pays a small pool fee, usually around 0.01% to 0.05% for stablecoin pairs.
              Those fees go to active LPs. There is also a very small Algorand network fee.
            </DocP>
          </DocSection>
        </div>
      </>
    ),
  },
  "how-it-works-liquidity-providers": {
    meta: metaFor("how-it-works-liquidity-providers"),
    content: (
      <>
        <DocPageTitle title="How It Works: Liquidity Providers">
          <DocLead>
            LPs deposit stablecoins into Torus pools and earn fees from swaps that travel through
            their chosen tick range.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="key-concepts" title="Key Concepts">
            <DocSubsection title="Ticks: Your Liquidity Position">
              <DocP>
                Unlike a uniform pool where every LP gets the same profile, Torus lets each LP
                choose a tick with a specific range. In practice, that is a decision about how far
                from the peg your liquidity should stay active.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Capital Efficiency: Why Ticks Matter">
              <DocP>
                Narrow ticks do not require capital for the most extreme depeg scenarios. Torus uses
                virtual reserves, a mathematical floor that lives in the invariant without forcing
                LPs to deposit that full reserve upfront.
              </DocP>
              <DocList
                items={[
                  <>
                    <strong>$0.99 depeg tick:</strong> roughly 150x efficiency
                  </>,
                  <>
                    <strong>$0.90 depeg tick:</strong> roughly 15x efficiency
                  </>,
                  <>
                    <strong>Full range:</strong> around 1x efficiency, similar to a uniform stable
                    pool
                  </>,
                ]}
              />
            </DocSubsection>

            <DocSubsection title="Fees">
              <DocP>
                LPs earn fees proportional to their share of liquidity in the active range. Tighter
                ticks can earn significantly more fees per dollar, as long as prices stay inside the
                chosen boundary.
              </DocP>
            </DocSubsection>
          </DocSection>

          <DocSection id="adding-liquidity" title="Adding Liquidity">
            <DocOrderedList
              items={[
                <>
                  <strong>Choose a pool.</strong> Pick the stablecoin pool you want to support.
                </>,
                <>
                  <strong>Choose a tick range.</strong> The interface can present this as a depeg
                  threshold such as $0.95, $0.99, or $0.999.
                </>,
                <>
                  <strong>Deposit tokens.</strong> At the equal-price point, you deposit equal
                  value across the pool assets, adjusted by virtual reserves.
                </>,
                <>
                  <strong>Confirm the group.</strong> Once signed and settled, your liquidity
                  becomes active.
                </>,
              ]}
            />
          </DocSection>

          <DocSection id="removing-liquidity" title="Removing Liquidity">
            <DocP>
              LP positions are withdrawable at any time. The token mix you receive back depends on
              the current pool state, so a depegged token can leave you holding more of that asset
              and less of the stronger ones. Earned fees are included in the withdrawal.
            </DocP>
          </DocSection>

          <DocSection id="risks" title="Risks">
            <DocSubsection title="Impermanent Loss">
              <DocP>
                Stablecoin pools usually experience modest impermanent loss when all assets remain
                near parity, but that can change quickly during a serious depeg.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Tick Boundary Risk">
              <DocP>
                If a narrow tick sits at a boundary like $0.99 and the market moves past it, that
                position becomes pinned to the boundary. Your capital is still there, but it may
                stop earning for one trade direction until prices move back inside range.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Smart Contract Risk">
              <DocP>
                As with any DeFi protocol, contract bugs or economic edge cases can lead to losses.
                The repository is open source, and the public docs should be updated when audit
                details are finalized.
              </DocP>
            </DocSubsection>
          </DocSection>
        </div>
      </>
    ),
  },
  "how-it-works-the-math": {
    meta: metaFor("how-it-works-the-math"),
    content: (
      <>
        <DocPageTitle title="How It Works: The Math">
          <DocLead>
            You do not need to understand the full math to use Torus, but the geometry is the
            whole reason the protocol works.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="the-sphere-amm" title="The Sphere AMM">
            <DocP>The base invariant is the equation of a sphere in n-dimensional space:</DocP>
            <DocCodeBlock code={`sum_i (r - x_i)^2 = r^2`} />
            <DocP>
              Here, <code>n</code> is the number of tokens in the pool, <code>x_i</code> is the
              reserve of token <code>i</code>, and <code>r</code> is the radius parameter that
              controls total liquidity.
            </DocP>
          </DocSection>

          <DocSection id="token-pricing" title="Token Pricing">
            <DocP>The instantaneous price of token j in terms of token i is:</DocP>
            <DocCodeBlock code={`price(j / i) = (r - x_i) / (r - x_j)`} />
            <DocP>
              When reserves are equal, all prices are 1:1. When one token is abundant in the pool,
              its price drops relative to the others.
            </DocP>
          </DocSection>

          <DocSection id="the-equal-price-point" title="The Equal Price Point">
            <DocP>
              The equal-price point is where every token shares the same reserve level and every
              price is exactly 1:
            </DocP>
            <DocCodeBlock code={`q = r * (1 - 1 / sqrt(n))`} />
            <DocP>
              For a 5-token pool with <code>r = 1,000,000</code>, that gives{" "}
              <code>q ~= 552,786</code> per token.
            </DocP>
          </DocSection>

          <DocSection id="tick-boundaries" title="Tick Boundaries">
            <DocP>Each tick is defined by a plane cutting through the sphere:</DocP>
            <DocCodeBlock code={`x . v = k`} />
            <DocP>
              The vector <code>v</code> points toward the equal-price point, and <code>k</code>{" "}
              controls how wide the tick is. Lower values make the tick tighter. Higher values make
              it broader.
            </DocP>
          </DocSection>

          <DocSection id="capital-efficiency" title="Capital Efficiency">
            <DocP>Virtual reserves for a tick with parameter <code>k</code> can be summarized by:</DocP>
            <DocCodeBlock
              code={`c = n * r - k * sqrt(n)
x_min = r - (c + sqrt((n - 1) * (n * r^2 - c^2))) / n`}
            />
            <DocP>
              Capital efficiency is then <code>q / (q - x_min)</code>, where <code>q</code> is the
              equal-price reserve.
            </DocP>
          </DocSection>

          <DocSection id="the-torus-invariant" title="The Torus Invariant">
            <DocP>
              Once multiple ticks consolidate into interior and boundary groups, the combined shape
              becomes a torus:
            </DocP>
            <DocCodeBlock
              code={`r_int^2 = (alpha_int - r_int * sqrt(n))^2 + (||w|| - s_bound)^2`}
            />
            <DocP>
              The contract can evaluate this using only the reserve sum and reserve sum-of-squares,
              which keeps the verification path constant-time even as the number of tokens grows.
            </DocP>
          </DocSection>

          <DocSection id="computing-trades" title="Computing Trades">
            <DocP>
              The off-chain SDK solves the invariant for the output amount using Newton&apos;s method.
              The on-chain contract verifies the result by plugging the claimed output back into the
              torus equation.
            </DocP>
            <DocP>
              When a trade crosses tick boundaries, it gets segmented into multiple verified chunks.
            </DocP>
          </DocSection>

          <DocSection id="further-reading" title="Further Reading">
            <DocList
              items={[
                <>
                  <DocLink href={ORBITAL_PAPER}>Orbital paper by Paradigm</DocLink>
                </>,
                <>
                  <DocLink href="/docs/basics/links">Links & Resources</DocLink> for the surrounding
                  Algorand references and repository entry points
                </>,
              ]}
            />
          </DocSection>
        </div>
      </>
    ),
  },
  "rewards-current": {
    meta: metaFor("rewards-current"),
    content: (
      <>
        <DocPageTitle title="Current Rewards">
          <DocLead>
            Torus plans to incentivize early liquidity providers and active traders through reward
            programs tied to protocol growth.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocCallout title="Status">
            Reward parameters in this repository are still provisional. Treat the structures below
            as the intended program shape until the live numbers and dates are announced.
          </DocCallout>

          <DocSection id="active-programs" title="Active Programs">
            <DocSubsection title="LP Rewards - Season 1">
              <div className="mb-4 flex flex-wrap gap-3">
                <DocBadge>TBA</DocBadge>
                <DocMuted>Duration: To be announced</DocMuted>
                <DocMuted>Total rewards: To be announced</DocMuted>
              </div>
              <DocP>
                Provide liquidity to Torus pools and earn TORUS token rewards on top of swap fee
                revenue. The intended distribution model weights liquidity, time active, and
                capital efficiency.
              </DocP>
              <DocList
                items={[
                  <>Deposit liquidity into an eligible Torus pool</>,
                  <>Rewards accrue over time based on active liquidity share</>,
                  <>Claim rewards from the protocol dashboard once it is live</>,
                ]}
              />
            </DocSubsection>

            <DocSubsection title="Trading Rewards">
              <div className="mb-4 flex flex-wrap gap-3">
                <DocBadge>TBA</DocBadge>
                <DocMuted>Duration: To be announced</DocMuted>
              </div>
              <DocP>
                Torus also plans to reward trading activity. The reward rate is expected to scale
                with trading volume.
              </DocP>
              <DocTable
                headers={["Weekly volume", "Illustrative multiplier"]}
                rows={[
                  ["$0 - $1,000", "1x base"],
                  ["$1,000 - $10,000", "1.5x"],
                  ["$10,000+", "2x"],
                ]}
                compact
              />
            </DocSubsection>
          </DocSection>

          <DocSection id="how-to-participate" title="How to Participate">
            <DocOrderedList
              items={[
                <>Open the Torus app once the rewards dashboard is live</>,
                <>Connect an Algorand wallet</>,
                <>Provide liquidity or trade through eligible pools</>,
                <>Track and claim rewards from the rewards interface</>,
              ]}
            />
          </DocSection>
        </div>
      </>
    ),
  },
  "rewards-referrals": {
    meta: metaFor("rewards-referrals"),
    content: (
      <>
        <DocPageTitle title="Referral Program">
          <DocLead>
            Invite other users to Torus and earn rewards when they trade or provide liquidity
            through your referral path.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocCallout title="Status">
            Referral rewards are not finalized in this repository yet, so the values below should
            be treated as placeholders for the eventual live program.
          </DocCallout>

          <DocSection id="how-it-works" title="How It Works">
            <DocOrderedList
              items={[
                <>Generate a referral link from the rewards dashboard</>,
                <>Share it with friends, communities, or social audiences</>,
                <>Earn protocol rewards when referred users trade or provide liquidity</>,
              ]}
            />
          </DocSection>

          <DocSection id="reward-structure" title="Reward Structure">
            <DocTable
              headers={["Action by referral", "Reward"]}
              rows={[
                ["First swap", "TBA"],
                ["Cumulative $1,000 in trades", "TBA"],
                ["Provides liquidity for at least 1 week", "TBA"],
              ]}
            />
            <DocP>
              The referral design also contemplates a small share of referred swap fees being paid
              out in TORUS during the life of the program.
            </DocP>
          </DocSection>

          <DocSection id="terms" title="Terms">
            <DocList
              items={[
                <>Referral rewards are subject to program terms and may change</>,
                <>Self-referrals are not allowed</>,
                <>Rewards are expected to distribute on a periodic schedule</>,
                <>Referral tracking can be embedded on-chain through referral-aware transaction metadata</>,
              ]}
            />
          </DocSection>
        </div>
      </>
    ),
  },
  "rewards-details": {
    meta: metaFor("rewards-details"),
    content: (
      <>
        <DocPageTitle title="Rewards Details">
          <DocLead>
            A closer look at TORUS token utility and the formulas behind LP and trading incentives.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocSection id="torus-token" title="TORUS Token">
            <DocList
              items={[
                <>
                  <strong>Governance:</strong> vote on pool parameters, fee schedules, and treasury
                  allocations
                </>,
                <>
                  <strong>Rewards:</strong> distributed to LPs and traders during incentive
                  campaigns
                </>,
                <>
                  <strong>Fee sharing:</strong> TORUS stakers may eventually receive a share of
                  protocol fees, subject to governance
                </>,
              ]}
            />
          </DocSection>

          <DocSection id="reward-calculation" title="Reward Calculation">
            <DocSubsection title="LP Rewards Formula">
              <DocCodeBlock
                code={`your_reward = total_epoch_rewards * (your_liquidity * your_time * your_efficiency)
             / sum(all_lp_liquidity * all_lp_time * all_lp_efficiency)`}
              />
              <DocP>
                This structure rewards both capital deployed and capital efficiency. A concentrated
                position can earn the same rewards as a much larger full-range position if it
                provides similar effective depth.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Trading Rewards Formula">
              <DocCodeBlock code={`your_reward = total_epoch_rewards * your_volume / total_volume`} />
              <DocP>
                Volume multipliers can then be layered on top of the base formula to encourage
                sustained usage.
              </DocP>
            </DocSubsection>
          </DocSection>

          <DocSection id="claiming-rewards" title="Claiming Rewards">
            <DocP>
              Rewards are intended to accrue continuously and be claimable from a dedicated
              dashboard. Claimed rewards would settle directly to the connected Algorand wallet as
              TORUS ASA tokens.
            </DocP>
          </DocSection>

          <DocSection id="vesting" title="Vesting">
            <DocP>
              The vesting policy has not been finalized in this repository yet. If rewards launch
              without vesting, this page should explicitly say so. If vesting is introduced,
              publish the unlock schedule here.
            </DocP>
          </DocSection>
        </div>
      </>
    ),
  },
  "rewards-previous": {
    meta: metaFor("rewards-previous"),
    content: (
      <>
        <DocPageTitle title="Previous Rewards">
          <DocLead>
            A record of completed reward programs and campaign structures as they roll out over
            time.
          </DocLead>
        </DocPageTitle>

        <div className="space-y-12">
          <DocCallout title="Status">
            Historical reward data has not been published yet. The examples below show the intended
            archive format once campaigns complete.
          </DocCallout>

          <DocSection id="completed-programs" title="Completed Programs">
            <DocSubsection title="Testnet Incentive Program">
              <div className="mb-4 flex flex-wrap gap-3">
                <DocMuted>Duration: TBA</DocMuted>
                <DocMuted>Total distributed: TBA</DocMuted>
                <DocMuted>Participants: TBA</DocMuted>
              </div>
              <DocP>
                Early testers can be rewarded for performing swaps, providing test liquidity,
                reporting bugs, and contributing to the community.
              </DocP>
            </DocSubsection>

            <DocSubsection title="Launch Week Trading Competition">
              <div className="mb-4 flex flex-wrap gap-3">
                <DocMuted>Duration: TBA</DocMuted>
                <DocMuted>Prize pool: TBA</DocMuted>
              </div>
              <DocTable
                headers={["Rank", "Reward"]}
                rows={[
                  ["1st", "TBA"],
                  ["2nd-5th", "TBA each"],
                  ["6th-20th", "TBA each"],
                  ["All participants", "TBA"],
                ]}
              />
            </DocSubsection>
          </DocSection>
        </div>
      </>
    ),
  },
}

export function getDocPageBySlug(slug?: string[]) {
  const meta = getDocMetaBySlug(slug)

  if (!meta) {
    return null
  }

  return docPagesByKey[meta.key]
}

export function getAllDocsPages() {
  return Object.values(docPagesByKey)
}
