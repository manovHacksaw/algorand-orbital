# Torus Protocol — Documentation Site

## Project Overview for AI Site Builder (Lovable)

Build a /docs route for **Torus Protocol** — a multi-stablecoin AMM (Automated Market Maker) built on Algorand that uses spherical geometry to enable concentrated liquidity across pools of n stablecoins.

### Design Requirements
- **Theme:** Dark mode, similar to the reference screenshot — dark navy/black background (#0a0b0f or similar), with a left sidebar navigation
- **Sidebar:** Fixed left sidebar with collapsible sections, active page highlighted in purple/violet accent color
- **Typography:** Clean sans-serif font (Inter, Satoshi, or similar), white text on dark background
- **Accent color:** Purple/violet (#7c5cfc or similar) for active links, buttons, and highlights
- **Layout:** Sidebar (250px) + Main content area (max-width 720px, centered) + optional right-side TOC
- **Code blocks:** Dark code blocks with syntax highlighting (use a theme like One Dark or Dracula)
- **Logo:** Text logo "Torus" in the top-left of the sidebar, with a small donut/torus icon if possible

### Sidebar Structure (exactly matching this hierarchy):

```
Why Torus          ← standalone page (highlighted in purple when active)

Overview           ← standalone page

▾ Basics           ← collapsible section
    Introduction
    FAQ
    Links

▾ How It Works     ← collapsible section
    Traders
    Liquidity Providers
    The Math

▾ Rewards          ← collapsible section
    Current Rewards
    Referrals
    Rewards Details
    Previous Rewards
```

---

## Page Content

---

### PAGE: Why Torus

**Route:** `/why-torus`

# Why Torus

The future holds a million stablecoins. Today's infrastructure isn't ready.

Every new stablecoin — whether backed by treasuries, real-world assets, or algorithmic mechanisms — needs deep liquidity against every other stablecoin. With traditional AMMs, that means creating separate pools for every pair: USDC/USDT, USDC/DAI, USDT/DAI, and so on. Five stablecoins need 10 pools. Twenty stablecoins need 190 pools. Liquidity fragments, spreads widen, and capital efficiency collapses.

**Torus fixes this.**

## The Problem with Existing AMMs

**Uniswap V3** pioneered concentrated liquidity — letting LPs focus their capital where trading actually happens. But it only supports pools between two assets. For a world with dozens of stablecoins, that's not enough.

**Curve Finance** created multi-token stablecoin pools. But every LP in a Curve pool gets the same liquidity profile. There's no way for one LP to say "I only want to provide liquidity near the $1 peg" while another provides wider coverage for depeg events.

Neither approach gives you both: multi-token pools AND customizable concentrated liquidity.

## What Torus Does Differently

Torus is the first AMM that brings concentrated liquidity to pools of three or more stablecoins. It does this by using the surface of a mathematical sphere as the AMM's trading surface, with tick boundaries drawn as circles (orbits) around the $1 equal-price point.

### One Pool, Every Stablecoin
Instead of fragmenting liquidity across dozens of pair pools, Torus lets you create a single pool containing 2, 5, or even hundreds of stablecoins. Every token can be swapped for every other token directly — no routing through intermediate pairs.

### Concentrated Liquidity in Higher Dimensions
LPs choose how tightly to concentrate their liquidity. Want maximum capital efficiency? Set a narrow tick that only covers down to a $0.99 depeg. Want to earn fees during volatility? Set a wider tick that covers deeper depegs. Different LPs in the same pool can have completely different strategies.

### Massive Capital Efficiency
Because inner ticks don't need to hold capital in reserve for extreme depeg scenarios, LPs can achieve dramatically higher capital efficiency:

| Depeg Coverage | Capital Efficiency vs. Curve |
|----------------|------------------------------|
| Down to $0.99  | ~150x                        |
| Down to $0.95  | ~30x                         |
| Down to $0.90  | ~15x                         |

This means an LP depositing $1,000 in a Torus tick covering $0.99 depegs provides the same market depth as $150,000 in a traditional Curve pool.

### Built on Algorand
Torus leverages Algorand's unique strengths:
- **Instant finality** — swaps confirm in ~3.3 seconds
- **Near-zero fees** — fractions of a cent per transaction
- **Native sqrt opcode** — the AVM has built-in square root computation, perfect for sphere math
- **Box storage** — unlimited on-chain storage for tick and LP data
- **Atomic groups** — complex multi-step swaps execute atomically

## The Origin

Torus implements the **Orbital AMM** design published by Paradigm in June 2025, authored by Dave White, Dan Robinson, and Ciamac Moallemi — three of the leading researchers in DeFi mechanism design. The original paper describes the mathematical framework; Torus is the first working implementation, built for Algorand.

> "Donuts > Curves."

---

### PAGE: Overview

**Route:** `/overview`

# Overview

Torus Protocol is a decentralized exchange (DEX) on Algorand optimized for stablecoin swaps. It uses a novel mathematical approach — spherical geometry with concentrated liquidity — to create multi-token stablecoin pools with unprecedented capital efficiency.

## Key Features

**Multi-Token Pools**
Swap between any stablecoins in a single pool. No need to route through intermediate pairs. One pool can hold USDC, USDT, DAI, FRAX, and more — all tradable against each other directly.

**Concentrated Liquidity**
LPs choose their own risk/reward profile by selecting tick boundaries. Tighter ticks near the $1 peg earn more fees per dollar deposited. Wider ticks earn fees during depeg events.

**Capital Efficient**
Virtual reserves mean LPs only deposit the capital actually needed for their chosen price range. A tick covering down to $0.99 provides ~150x the effective liquidity compared to the same capital in a uniform pool.

**Constant-Time Swaps**
Thanks to the torus invariant, swap computation complexity is O(1) regardless of how many tokens are in the pool. A pool with 100 tokens computes swaps just as fast as a pool with 2.

**Permissionless**
Anyone can create pools, add liquidity, or trade. No whitelisting, no KYC, no intermediaries.

## Quick Links

- **Swap:** [Launch App →](#)
- **Add Liquidity:** [Provide Liquidity →](#)
- **Smart Contracts:** [GitHub →](#)
- **Original Paper:** [Paradigm — Orbital](https://www.paradigm.xyz/2025/06/orbital)

## Protocol Stats

| Metric | Value |
|--------|-------|
| Chain | Algorand |
| Pool Type | Multi-token stablecoin |
| Max Tokens per Pool | Unlimited (practical limit ~200) |
| Swap Complexity | O(1) per trade |
| Finality | ~3.3 seconds |
| Fees | Configurable per pool |

---

### PAGE: Introduction (under Basics)

**Route:** `/basics/introduction`

# Introduction

Welcome to the Torus Protocol documentation. This guide will help you understand how Torus works, whether you're a trader looking to swap stablecoins, a liquidity provider looking to earn fees, or a developer looking to integrate with the protocol.

## What is Torus?

Torus is an automated market maker (AMM) — a type of decentralized exchange where trades are executed against a pool of tokens held in a smart contract, rather than matched between buyers and sellers. The smart contract uses a mathematical formula (an "invariant") to determine prices automatically.

What makes Torus unique is its invariant: instead of using the standard constant-product formula (like Uniswap) or a stableswap curve (like Curve), Torus uses the surface of a **mathematical sphere** in n-dimensional space, where n is the number of tokens in the pool.

## Core Concepts

### Pools
A Torus pool contains n stablecoin tokens (as Algorand Standard Assets / ASAs). All tokens in the pool can be swapped for any other token in the pool directly.

### The Sphere
The AMM's state — the reserves of each token — lives on the surface of an n-dimensional sphere. As trades happen, the state point slides along this surface. The sphere's equation ensures that prices stay consistent and no value is created or destroyed.

### Ticks
A tick is a liquidity position created by an LP. Each tick defines a region on the sphere's surface (a "spherical cap") by specifying how far from the $1 equal-price point the tick extends. Ticks are nested: larger ticks fully contain smaller ticks.

### The Torus Invariant
When the pool has multiple ticks, some will be "interior" (prices haven't diverged enough to hit their boundary) and some will be "boundary" (prices have diverged past their limit). By consolidating all interior ticks into one sphere and all boundary ticks into another, the combined shape is a **torus** (donut). The equation of this torus is what the protocol uses to compute trades.

## How to Use These Docs

- **Traders:** Start with [How It Works → Traders](/how-it-works/traders) to learn how to swap
- **LPs:** Read [How It Works → Liquidity Providers](/how-it-works/liquidity-providers) to understand positions and fees
- **Curious about the math:** Check out [How It Works → The Math](/how-it-works/the-math) for the full mathematical framework
- **Looking for links and resources:** See [Basics → Links](/basics/links)

---

### PAGE: FAQ (under Basics)

**Route:** `/basics/faq`

# Frequently Asked Questions

## General

**What is Torus Protocol?**
Torus is a decentralized exchange on Algorand for swapping stablecoins. It uses spherical geometry to create multi-token pools with concentrated liquidity — meaning you can swap any stablecoin for any other in a single pool, and LPs get dramatically better capital efficiency than existing DEXs.

**What chain is Torus on?**
Algorand. We chose Algorand for its instant finality, near-zero fees, native math opcodes (including sqrt), and box storage that lets us store unlimited tick and LP data on-chain.

**Is Torus only for stablecoins?**
The current design is optimized for tokens that should trade near a 1:1 ratio (stablecoins, wrapped tokens, liquid staking tokens). The sphere geometry assumes an "equal price point" where all tokens are worth the same. It is not designed for volatile asset pairs like ETH/USDC.

**What's the relationship to the Paradigm Orbital paper?**
Torus is an implementation of the Orbital AMM design published by Dave White, Dan Robinson, and Ciamac Moallemi at Paradigm in June 2025. The paper describes the mathematical framework; Torus brings it to life on Algorand.

## Trading

**How do I swap tokens?**
Connect your Algorand wallet (Pera, Defly, or Lute), select the tokens you want to swap, enter the amount, and confirm the transaction. The swap settles in a single atomic group of transactions on Algorand — typically within 3-4 seconds.

**What are the fees?**
Swap fees are set per pool and are distributed to liquidity providers. The typical fee is 0.01% to 0.05% for stablecoin pools. Algorand network fees are a fraction of a cent per transaction.

**What is slippage?**
Slippage is the difference between the expected price and the actual price of your trade. For small trades in a well-funded pool, slippage is minimal. For larger trades, the price moves against you as your trade uses up available liquidity. You can set a maximum slippage tolerance to protect yourself.

**Can I swap any token for any other in the pool?**
Yes. In a pool with 5 tokens, you can swap any of the 5 directly for any other — no routing through intermediate pairs needed.

## Providing Liquidity

**How do I earn fees?**
Deposit tokens into a tick (a liquidity position with a specific price range). When traders swap through your tick's price range, you earn a share of the swap fees proportional to your share of the tick's liquidity.

**What is a tick?**
A tick defines how far from the $1 equal-price point your liquidity covers. A narrow tick (e.g., covering down to $0.99) means higher capital efficiency but you stop earning fees if a token depegs beyond $0.99. A wider tick (e.g., covering down to $0.50) earns fees even during major depegs but has lower capital efficiency.

**What is impermanent loss?**
Impermanent loss (IL) occurs when the price ratio between tokens in your position changes. For stablecoin pools, IL is minimal under normal conditions since all tokens should trade near $1. However, if a token permanently depegs, LPs holding that token's reserves will experience losses.

**Can I lose money providing liquidity?**
Yes. If a stablecoin in the pool depegs significantly (loses its peg to $1), your position may end up holding more of the depegged token and less of the stable ones. This is the fundamental risk of providing liquidity in any AMM.

## Technical

**Is the code open source?**
Yes. All smart contracts and the SDK are open source and available on GitHub.

**Has the protocol been audited?**
[Update this based on actual audit status]

**How does the compute off-chain, verify on-chain pattern work?**
The heavy math (solving quartic equations, Newton's method iterations) is computed off-chain by the TypeScript SDK. The on-chain smart contract only verifies that the claimed trade satisfies the torus invariant — a much cheaper operation. This keeps transactions fast and within Algorand's opcode budget.

---

### PAGE: Links (under Basics)

**Route:** `/basics/links`

# Links & Resources

## Official

| Resource | Link |
|----------|------|
| Website | [torus.finance](#) |
| App (Swap) | [app.torus.finance](#) |
| GitHub | [github.com/torus-protocol](#) |
| Twitter / X | [@TorusProtocol](#) |
| Discord | [discord.gg/torus](#) |

## Technical Resources

| Resource | Description |
|----------|-------------|
| Smart Contracts | Algorand Python contracts — [GitHub →](#) |
| TypeScript SDK | Off-chain trade computation and transaction building — [npm →](#) |
| API Reference | SDK documentation — [docs →](#) |
| Testnet App | Try Torus on Algorand testnet — [testnet.torus.finance](#) |

## Research & Background

| Resource | Description |
|----------|-------------|
| Orbital Paper (Paradigm) | The original research paper by Dave White, Dan Robinson, and Ciamac Moallemi — [Read →](https://www.paradigm.xyz/2025/06/orbital) |
| Implementation Manual | Our detailed technical manual covering the full math and Algorand implementation — [PDF →](#) |
| Capital Efficiency Calculator | Interactive Desmos graph showing efficiency vs. depeg price — [Desmos →](https://www.desmos.com) |

## Algorand Resources

| Resource | Description |
|----------|-------------|
| Algorand Developer Docs | Official Algorand documentation — [Read →](https://dev.algorand.co) |
| AlgoKit | Algorand development toolkit — [Learn more →](https://developer.algorand.org/algokit/) |
| Pera Wallet | Recommended Algorand wallet — [Download →](https://perawallet.app) |
| Algorand Explorer | View transactions on-chain — [Explore →](https://explorer.perawallet.app) |

---

### PAGE: Traders (under How It Works)

**Route:** `/how-it-works/traders`

# How It Works: Traders

Trading on Torus is simple from the user's perspective, even though powerful math runs under the hood.

## Swapping Tokens

### Step 1: Connect Your Wallet
Connect an Algorand wallet (Pera, Defly, or Lute) to the Torus app. Make sure you have some ALGO for transaction fees (typically less than $0.01 per swap).

### Step 2: Select Tokens
Choose which token you want to sell ("From") and which you want to buy ("To"). Both must be in the same Torus pool. The app shows available pools and tokens.

### Step 3: Enter Amount
Enter how much you want to swap. The app instantly computes your expected output, the effective price, and the price impact.

### Step 4: Set Slippage Tolerance
The default slippage tolerance is 0.5%. For stablecoin swaps, this is more than enough. You can tighten it to 0.1% for smaller trades or increase it for larger trades.

### Step 5: Confirm and Swap
Review the trade details and confirm. Your wallet will ask you to sign a group of transactions (this is normal — Torus uses Algorand's atomic group feature to bundle the swap into a single all-or-nothing execution). The swap settles in about 3-4 seconds.

## What Happens Under the Hood

When you submit a swap, here is what actually happens:

1. **The SDK computes the optimal output** off-chain using Newton's method on the torus invariant equation. This gives the maximum amount of output token you can receive for your input.

2. **An atomic transaction group is built** containing:
   - Your token transfer (sending the input token to the pool)
   - Budget-pooling transactions (to give the smart contract enough compute budget)
   - The swap application call (telling the pool: "I sent X of token A, give me Y of token B")

3. **The smart contract verifies** that the claimed output is correct by checking the torus invariant. It does NOT re-solve the equation — it just plugs in the numbers and checks that the math holds. This is fast and cheap.

4. **If verification passes**, the contract sends you the output tokens via an inner transaction. If anything is wrong (bad math, slippage exceeded, insufficient liquidity), the entire atomic group fails and your input tokens are returned.

## Understanding Price Impact

For small trades, the price is approximately the instantaneous price:

```
price(token_j / token_i) = (r - reserve_i) / (r - reserve_j)
```

As your trade gets larger, you move the reserves further along the sphere surface, and the price worsens. This is called price impact. The app shows the expected price impact before you confirm.

For very large trades that cross tick boundaries, the trade is segmented — part executes at one price, then a tick boundary is crossed, and the rest executes at a slightly different price. The SDK handles all of this automatically.

## Fees

Each swap incurs a small fee (typically 0.01%–0.05%) that goes to liquidity providers. This fee is deducted from the output amount. The fee rate is set per pool.

There is also a negligible Algorand network fee (~0.001 ALGO per transaction, well under $0.01).

---

### PAGE: Liquidity Providers (under How It Works)

**Route:** `/how-it-works/liquidity-providers`

# How It Works: Liquidity Providers

Liquidity providers (LPs) deposit stablecoins into Torus pools and earn fees from every swap that trades through their liquidity position.

## Key Concepts

### Ticks: Your Liquidity Position
Unlike Curve where all LPs share the same liquidity profile, Torus lets you create a **tick** — a position with a specific price range.

Each tick is defined by a parameter **k** that determines how far from the $1 peg your liquidity covers. Smaller k = tighter range = higher capital efficiency. Larger k = wider range = more resilient to depegs.

The app presents this as a simple choice: "What's the minimum depeg price you want to cover?"

### Capital Efficiency: Why Ticks Matter
When you create a narrow tick, you don't need to deposit capital to cover extreme scenarios (like a token going to $0). The protocol uses **virtual reserves** — a mathematical floor that exists in the formula but doesn't require actual token deposits.

Example for a 5-token pool:
- **$0.99 depeg tick:** You deposit ~$67 but provide ~$10,000 worth of effective liquidity (~150x efficiency)
- **$0.90 depeg tick:** You deposit ~$67 but provide ~$1,000 worth of effective liquidity (~15x efficiency)
- **Full range:** You deposit ~$67 and provide ~$67 of effective liquidity (1x, same as Curve)

### Fees
You earn a share of swap fees proportional to your share of liquidity in the active tick range. The narrower your tick, the more concentrated your liquidity, and the more fees you earn per dollar deposited — as long as prices stay within your range.

## Adding Liquidity

### Step 1: Choose a Pool
Select which stablecoin pool you want to provide liquidity to.

### Step 2: Choose Your Tick Range
Select a depeg price threshold. The app shows you the capital efficiency multiplier and the corresponding fee yield estimate for each option.

Common choices:
- **Conservative ($0.95):** Covers moderate depegs, ~30x efficiency
- **Standard ($0.99):** Covers minor fluctuations, ~150x efficiency
- **Aggressive ($0.999):** Maximum efficiency but very narrow range

### Step 3: Deposit Tokens
Deposit the required tokens. At the equal price point, you deposit equal amounts of each token in the pool (minus virtual reserves). The app calculates the exact deposit amounts.

### Step 4: Confirm
Sign the transaction group. Your liquidity is now active and earning fees.

## Removing Liquidity

You can remove your liquidity at any time. The tokens you receive back depend on the current pool state — if prices have shifted, you may get back a different ratio of tokens than you deposited. Your earned fees are included in the withdrawal.

## Risks

### Impermanent Loss
If a stablecoin in the pool depegs, your position will accumulate more of the depegged token and less of the stable ones. For stablecoin pools, this risk is low under normal market conditions but can be significant during depeg events.

### Tick Boundary Risk
If you have a narrow tick (e.g., $0.99) and a token depegs beyond your boundary, your tick becomes "pinned" to its boundary. You stop earning fees for that trade direction until prices return within your range. Your capital is safe — it's just not earning fees.

### Smart Contract Risk
As with any DeFi protocol, there is inherent risk in smart contract bugs or exploits. Torus's contracts are open-source and [audited / undergoing audit].

---

### PAGE: The Math (under How It Works)

**Route:** `/how-it-works/the-math`

# How It Works: The Math

This page explains the mathematical framework behind Torus. You don't need to understand this to use the protocol, but if you're curious about what makes it tick (pun intended), read on.

## The Sphere AMM

The core invariant of Torus is the equation of a sphere in n-dimensional space:

```
Σᵢ (r - xᵢ)² = r²
```

where:
- **n** is the number of tokens in the pool
- **xᵢ** is the reserves of token i
- **r** is the radius (a parameter that controls total liquidity)

The sphere is centered at the point (r, r, ..., r). The pool's reserve state lives on the surface of this sphere.

## Token Pricing

The instantaneous price of token j in terms of token i is:

```
price(j/i) = (r - xᵢ) / (r - xⱼ)
```

When reserves are equal (all tokens at the same level), all prices are 1:1. When one token's reserves are high (lots of it in the pool), its price is low.

## The Equal Price Point

The point where all reserves are equal and all prices are 1:

```
q = r × (1 - 1/√n)     for each token
```

For a 5-token pool with r = 1,000,000: q ≈ 552,786 per token.

## Tick Boundaries

A tick is defined by a plane cutting through the sphere:

```
x · v = k
```

where v = (1/√n, 1/√n, ..., 1/√n) is the unit vector pointing toward the equal price point. The value of k determines how wide the tick is:

- **k = k_min = r(√n - 1):** The tick has zero width (boundary at the equal price point)
- **k = k_max = r(n-1)/√n:** The tick covers the entire sphere

## Capital Efficiency

The virtual reserves (minimum possible reserves per token) for a tick with parameter k are:

```
c = n·r - k·√n
x_min = r - (c + √((n-1)·(n·r² - c²))) / n
```

Capital efficiency = q / (q - x_min), where q is the equal-price reserve.

## The Torus Invariant

When the pool has multiple ticks, they consolidate into interior (sphere) and boundary (lower-dimensional sphere) groups. The combined shape is a torus:

```
r_int² = (α_int - r_int·√n)² + (‖w‖ - s_bound)²
```

where:
- **r_int** = sum of all interior tick radii
- **s_bound** = sum of all boundary tick effective radii
- **α_int** = (sum of all reserves) / √n - k_bound
- **‖w‖** = √(Σxᵢ² - (Σxᵢ)²/n)

This equation can be evaluated in **O(1) time** regardless of the number of tokens — the protocol only needs to track Σxᵢ and Σxᵢ² (the sum and sum-of-squares of reserves).

## Computing Trades

To execute a swap, the off-chain SDK solves the torus invariant for the output amount using Newton's method. The on-chain contract verifies the solution by plugging the claimed output into the invariant and checking it equals zero.

For trades that cross tick boundaries, the trade is segmented at each boundary, and each segment is verified independently.

## Further Reading

For the complete mathematical derivation with step-by-step proofs, see our [Implementation Manual](#). For the original research, read the [Orbital paper by Paradigm](https://www.paradigm.xyz/2025/06/orbital).

---

### PAGE: Current Rewards (under Rewards)

**Route:** `/rewards/current`

# Current Rewards

Torus incentivizes early liquidity providers and active traders through reward programs.

## Active Programs

### LP Rewards — Season 1
**Status:** Active
**Duration:** [Start Date] → [End Date]
**Total Rewards:** [X] TORUS tokens

Provide liquidity to any Torus pool and earn TORUS token rewards on top of your swap fee earnings. Rewards are distributed proportionally to your liquidity × time × capital efficiency multiplier.

**How it works:**
1. Deposit liquidity into any Torus pool
2. Rewards accrue every block based on your share of active liquidity
3. Claim rewards at any time from the Rewards dashboard

**Bonus multipliers:**
- Tighter tick ranges earn a higher reward multiplier (rewarding capital efficiency)
- Longer deposit durations earn a time-weighted bonus

### Trading Rewards
**Status:** Active
**Duration:** [Start Date] → [End Date]

Earn TORUS tokens for every swap you make on Torus. The reward scales with trade volume.

| Weekly Volume | Reward Rate |
|---------------|-------------|
| $0 – $1,000 | 1x base |
| $1,000 – $10,000 | 1.5x |
| $10,000+ | 2x |

## How to Participate

1. Go to [app.torus.finance](#)
2. Connect your Algorand wallet
3. Provide liquidity or make swaps
4. View and claim your rewards on the Rewards dashboard

---

### PAGE: Referrals (under Rewards)

**Route:** `/rewards/referrals`

# Referral Program

Invite friends to Torus and earn rewards when they trade or provide liquidity.

## How It Works

1. **Get your referral link** from the Rewards dashboard in the app
2. **Share it** with friends, on social media, or in your community
3. **Earn rewards** when your referrals trade or provide liquidity

## Reward Structure

| Action by Referral | Your Reward |
|--------------------| ------------|
| First swap | [X] TORUS tokens |
| Cumulative $1,000 in trades | [X] TORUS tokens |
| Provides liquidity (1 week+) | [X] TORUS tokens |

Additionally, you earn **[X]%** of the swap fees generated by your referrals, paid in TORUS tokens, for the lifetime of the referral program.

## Terms

- Referral rewards are subject to program terms and may change
- Self-referrals are not permitted
- Rewards are distributed weekly
- Referral tracking is done on-chain via referral codes embedded in transactions

---

### PAGE: Rewards Details (under Rewards)

**Route:** `/rewards/details`

# Rewards Details

## TORUS Token

TORUS is the governance and incentive token of the Torus Protocol. It is used for:

- **Governance:** Vote on protocol parameters (fee rates, pool creation, reward allocations)
- **Rewards:** Distributed to LPs and traders as incentives
- **Fee sharing:** TORUS stakers may receive a share of protocol fees (subject to governance)

## Reward Calculation

### LP Rewards Formula

Your share of LP rewards for a given epoch:

```
your_reward = total_epoch_rewards × (your_liquidity × your_time × your_efficiency) 
              / Σ(all_lp_liquidity × all_lp_time × all_lp_efficiency)
```

Where:
- **your_liquidity:** The dollar value of your deposited liquidity
- **your_time:** The fraction of the epoch your liquidity was active
- **your_efficiency:** The capital efficiency multiplier of your tick (e.g., 150x for a $0.99 tick)

This means a $1,000 deposit in a 150x efficiency tick earns the same rewards as a $150,000 deposit in a 1x (full range) position — incentivizing concentrated, efficient liquidity.

### Trading Rewards Formula

```
your_reward = total_epoch_rewards × your_volume / total_volume
```

With volume tier multipliers applied as described on the Current Rewards page.

## Claiming Rewards

Rewards accrue continuously and can be claimed at any time from the Rewards dashboard. Claimed rewards are sent directly to your connected Algorand wallet as TORUS ASA tokens.

## Vesting

[Define vesting schedule if applicable, or state "No vesting — rewards are immediately liquid."]

---

### PAGE: Previous Rewards (under Rewards)

**Route:** `/rewards/previous`

# Previous Rewards

A record of completed reward programs.

## Completed Programs

### Testnet Incentive Program
**Duration:** [Date] → [Date]
**Total Distributed:** [X] TORUS tokens
**Participants:** [X] wallets

Early testers on the Algorand testnet earned TORUS token allocations for:
- Performing test swaps
- Providing test liquidity
- Reporting bugs
- Community contributions

### Launch Week Trading Competition
**Duration:** [Date] → [Date]
**Prize Pool:** [X] TORUS tokens

Top traders by volume during launch week earned bonus rewards:

| Rank | Reward |
|------|--------|
| 1st | [X] TORUS |
| 2nd–5th | [X] TORUS each |
| 6th–20th | [X] TORUS each |
| All participants | [X] TORUS |

---

## End of Content

### Additional Notes for the AI Builder (Lovable)

**Navigation behavior:**
- Clicking a section header (e.g., "Basics") should expand/collapse its children
- The currently active page should be highlighted with the purple accent color
- Section headers should have a small arrow indicator (▸ collapsed, ▾ expanded)
- On mobile, the sidebar should be a hamburger menu / drawer

**Footer:**
Include a simple footer with: © 2026 Torus Protocol | GitHub | Twitter | Discord

**SEO:**
Each page should have a proper title tag: "[Page Title] — Torus Protocol Docs"

**Responsive:**
- Desktop: Fixed sidebar + scrollable content
- Tablet: Collapsible sidebar
- Mobile: Hidden sidebar with hamburger toggle

**Code blocks:**
Use syntax highlighting with a dark theme. Support for `solidity`, `python`, `typescript`, and `bash` languages.

**Math rendering:**
If possible, use KaTeX for inline math rendering. If not, the code-block style math notation used above is acceptable.