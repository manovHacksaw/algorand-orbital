# Torus Protocol: Orbital AMM on Algorand

> **Multi-stablecoin AMM with concentrated liquidity for the Algorand ecosystem**

A PyTeal/TEALScript implementation of Paradigm's Orbital AMM - bringing capital-efficient multi-dimensional stablecoin trading to Algorand.

---

## 🎯 Overview

**Orbital AMM** enables efficient trading of multiple stablecoins (USDC, USDT, EUROC, etc.) in a single pool with:

- ✅ **Capital Efficiency:** 10-150x better than traditional AMMs
- ✅ **N-dimensional Trading:** Support for 3, 5, 10+ stablecoins in one pool
- ✅ **Concentrated Liquidity:** LPs customize their risk/reward profiles
- ✅ **Depeg Protection:** Ticks provide layered protection against depegs
- ✅ **Constant-Time Trades:** O(1) complexity regardless of pool size

### Key Innovation

Traditional AMMs (Uniswap V2, Tinyman) require separate pools for each pair. Orbital uses **spherical geometry** and **tick consolidation** to create a single pool that handles all pairs efficiently.

**Example:**
- Traditional: 3 stablecoins = 3 pools (USDC/USDT, USDC/DAI, USDT/DAI)
- Orbital: 3 stablecoins = 1 pool (USDC/USDT/DAI)
- Traditional: 5 stablecoins = 10 pools
- Orbital: 5 stablecoins = 1 pool

---

## 🌊 Why Algorand?

Algorand is the **ideal blockchain** for Orbital AMM:

| Feature | Why It Matters for Orbital |
|---------|---------------------------|
| **Low Fees** | Complex math operations remain economical |
| **Fast Finality** | 3.3s blocks → quick arbitrage correction → tight prices |
| **High TPS** | Can handle high-frequency stablecoin swaps |
| **AVM Capabilities** | 256-byte scratch space, box storage for tick data |
| **Native Assets** | All stablecoins are ASAs → unified handling |
| **Deterministic Costs** | Predictable opcode budgets for complex calculations |

### Algorand vs EVM for Orbital

```
Complexity Metric         | Algorand AVM | EVM (Ethereum)
--------------------------|--------------|----------------
Opcode Budget             | 20,000/call  | ~30M gas/block
Math Operations Cost      | Fixed        | Variable (high)
Storage Model             | Box Storage  | Storage slots
Native Multi-Asset        | ✅ ASA       | ❌ Needs ERC20
Block Time                | 3.3s         | 12s
Transaction Finality      | 1 block      | 12+ blocks
```

**Verdict:** Algorand's fixed costs and native asset support make it perfect for math-heavy DeFi protocols.

---

## 🏗️ Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    ORBITAL AMM PROTOCOL                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Pool Manager │  │ Tick Manager │  │ Trade Engine │      │
│  │  Contract    │  │   Contract   │  │   Contract   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│         ┌──────────────────┴──────────────────┐             │
│         │                                      │             │
│  ┌──────▼───────┐                    ┌────────▼────────┐    │
│  │ Box Storage  │                    │  Global State   │    │
│  │              │                    │                 │    │
│  │ • Tick Data  │                    │ • Pool Params   │    │
│  │ • LP Positions│                   │ • Consolidated  │    │
│  │ • Reserves   │                    │   Tick State    │    │
│  └──────────────┘                    └─────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
   │  USDC   │         │  USDT   │        │  EUROC  │
   │  (ASA)  │         │  (ASA)  │        │  (ASA)  │
   └─────────┘         └─────────┘        └─────────┘
```

### Contract Separation Strategy

**1. Pool Manager Contract**
- Creates and initializes pools
- Manages pool-level parameters (r, n, supported assets)
- Handles LP position creation/removal
- Emits events for indexing

**2. Tick Manager Contract**
- Stores tick data in box storage
- Manages tick boundaries (k values)
- Tracks interior vs boundary tick status
- Consolidates ticks for trading

**3. Trade Engine Contract**
- Executes swap logic
- Solves the torus invariant equation
- Handles tick crossing during large trades
- Computes output amounts via Newton's method

**Why Separate?**
- **Opcode Budget:** Each contract gets 20,000 opcodes
- **Modularity:** Easier to upgrade individual components
- **Gas Optimization:** Users only call contracts they need

---

## 🔧 Smart Contract Design

### Core Data Structures

#### Global State (Pool Manager)

```python
# Pool Parameters (stored in global state)
pool_radius: uint64           # r value (e.g., 1,000,000 for 6 decimals)
num_coins: uint64             # n (number of stablecoins)
total_liquidity: uint64       # Total LP tokens issued
fee_bps: uint64               # Fee in basis points (e.g., 30 = 0.3%)

# Asset IDs (ASAs)
asset_0: uint64               # USDC ASA ID
asset_1: uint64               # USDT ASA ID
asset_2: uint64               # EUROC ASA ID
# ... up to 10 assets

# Current reserves (sum across all ticks)
reserve_0: uint64
reserve_1: uint64
reserve_2: uint64
# ... matching asset count

# Consolidated tick state
interior_r: uint64            # Consolidated interior tick radius
boundary_k: uint64            # Consolidated boundary tick k value
boundary_s: uint64            # Consolidated boundary tick radius
```

#### Box Storage (Tick Manager)

**Tick Box Key:** `tick_{pool_id}_{tick_index}`

```python
# Each tick stored as a box (2KB max)
class TickData:
    k_value: uint64           # Tick boundary (k)
    is_interior: bool         # Interior (True) or Boundary (False)
    liquidity: uint64         # LP tokens for this tick
    
    # Reserve amounts (only for active ticks)
    reserve_0: uint64
    reserve_1: uint64
    reserve_2: uint64
    # ...
    
    # LP tracking
    lp_count: uint16          # Number of LPs in this tick
    lp_addresses: [Address]   # List of LP addresses (up to 50)
    lp_shares: [uint64]       # Corresponding shares
```

**LP Position Box Key:** `position_{user_address}_{pool_id}_{tick_index}`

```python
class LPPosition:
    tick_index: uint16        # Which tick
    shares: uint64            # LP tokens owned
    fees_earned_0: uint64     # Unclaimed fees in asset 0
    fees_earned_1: uint64     # Unclaimed fees in asset 1
    # ...
```

### Contract Methods

#### Pool Manager

```python
# Initialize a new pool
@external
def create_pool(
    asset_ids: list[uint64],      # ASA IDs for stablecoins
    radius: uint64,                # r value
    fee_bps: uint64                # Fee (basis points)
) -> uint64:                       # Returns pool_id
    """
    Creates a new Orbital pool.
    
    Requirements:
    - 3 <= len(asset_ids) <= 10
    - All assets must be valid ASAs
    - radius > 0
    - fee_bps <= 1000 (max 10%)
    """
    pass

# Add liquidity to a specific tick
@external
def add_liquidity(
    pool_id: uint64,
    tick_k: uint64,                # Tick boundary
    amount_0: uint64,              # Amount of asset 0
    amount_1: uint64,              # Amount of asset 1
    # ... (all assets)
) -> uint64:                       # Returns LP tokens minted
    """
    Adds liquidity to a tick.
    
    Process:
    1. Validate amounts match tick requirements
    2. Transfer assets from user
    3. Update tick reserves
    4. Mint LP tokens
    5. Update consolidated state if needed
    """
    pass

# Remove liquidity
@external
def remove_liquidity(
    pool_id: uint64,
    tick_index: uint16,
    lp_tokens: uint64              # Amount to burn
) -> list[uint64]:                 # Returns [amount_0, amount_1, ...]
    """
    Removes liquidity from a tick.
    
    Process:
    1. Burn LP tokens
    2. Calculate proportional reserves
    3. Add accrued fees
    4. Transfer assets to user
    5. Update tick state
    """
    pass
```

#### Trade Engine

```python
# Execute a swap
@external
def swap(
    pool_id: uint64,
    asset_in_id: uint64,           # ASA to give
    asset_out_id: uint64,          # ASA to receive
    amount_in: uint64,             # Amount to swap
    min_amount_out: uint64         # Slippage protection
) -> uint64:                       # Returns actual amount_out
    """
    Executes a swap through the Orbital AMM.
    
    Process:
    1. Load pool state
    2. Load consolidated tick state
    3. Compute output using torus invariant
    4. Check if tick crossing occurs
    5. If crossing: segment trade
    6. Apply fees
    7. Update reserves
    8. Transfer assets
    """
    pass

# Quote a trade (read-only, no state change)
@external(readonly=True)
def get_quote(
    pool_id: uint64,
    asset_in_id: uint64,
    asset_out_id: uint64,
    amount_in: uint64
) -> dict:
    """
    Returns expected output without executing.
    
    Returns:
    {
        'amount_out': uint64,
        'price_impact': uint64,    # In basis points
        'crosses_tick': bool,
        'effective_fee': uint64
    }
    """
    pass
```

#### Tick Manager

```python
# Update tick consolidation
@internal
def consolidate_ticks(pool_id: uint64):
    """
    Consolidates all ticks into interior/boundary groups.
    
    Process:
    1. Iterate through all active ticks
    2. Check each tick's state (interior vs boundary)
    3. Sum up radii for interior ticks → r_int
    4. Sum up k and s values for boundary ticks
    5. Update global state
    """
    pass

# Check if tick should cross
@internal
def check_tick_crossing(
    pool_id: uint64,
    new_reserves: list[uint64]
) -> tuple[bool, uint16]:
    """
    Determines if trade crosses a tick boundary.
    
    Returns:
    - crossed: bool (True if boundary crossed)
    - tick_index: uint16 (which tick was crossed)
    """
    pass
```

---

## 🗺️ Implementation Roadmap

### Phase 1: Core Math Library (Weeks 1-2)

**Deliverables:**
- [ ] PyTeal library for fixed-point arithmetic (18 decimals)
- [ ] Square root implementation (Newton's method)
- [ ] Dot product and vector operations
- [ ] Sphere constraint validation
- [ ] Unit tests for all math operations

**Files:**
```
src/
  math/
    fixed_point.py       # Fixed-point arithmetic
    vectors.py           # Vector operations (dot, norm)
    sqrt.py              # Square root via Newton's method
    sphere.py            # Sphere constraint validation
```

### Phase 2: Data Structures & Storage (Weeks 3-4)

**Deliverables:**
- [ ] Box storage schema design
- [ ] Tick data structure
- [ ] LP position tracking
- [ ] Global state management
- [ ] Integration tests

**Files:**
```
src/
  storage/
    tick_box.py          # Tick box storage
    position_box.py      # LP position boxes
    global_state.py      # Global state helpers
```

### Phase 3: Pool Manager Contract (Weeks 5-6)

**Deliverables:**
- [ ] Pool creation logic
- [ ] Liquidity add/remove
- [ ] LP token minting/burning
- [ ] Fee collection mechanism
- [ ] Integration with tick manager

**Files:**
```
src/
  contracts/
    pool_manager.py      # Main pool contract
```

### Phase 4: Tick Manager Contract (Weeks 7-8)

**Deliverables:**
- [ ] Tick creation and initialization
- [ ] Interior/boundary status tracking
- [ ] Tick consolidation algorithm
- [ ] Min/max reserve calculation
- [ ] Virtual reserve computation

**Files:**
```
src/
  contracts/
    tick_manager.py      # Tick management logic
```

### Phase 5: Trade Engine Contract (Weeks 9-11)

**Deliverables:**
- [ ] Torus invariant solver (Newton's method)
- [ ] Single-tick trade execution
- [ ] Multi-tick crossing logic
- [ ] Trade segmentation
- [ ] Price impact calculation
- [ ] Slippage protection

**Files:**
```
src/
  contracts/
    trade_engine.py      # Trading logic
    invariant.py         # Torus equation solver
```

### Phase 6: Testing & Optimization (Weeks 12-14)

**Deliverables:**
- [ ] Comprehensive unit tests (>90% coverage)
- [ ] Integration tests (full trade flows)
- [ ] Fuzz testing (random trade scenarios)
- [ ] Gas optimization
- [ ] Opcode budget analysis
- [ ] Security audit preparation

**Files:**
```
tests/
  unit/
    test_math.py
    test_storage.py
    test_pool_manager.py
    test_tick_manager.py
    test_trade_engine.py
  integration/
    test_full_flow.py
    test_tick_crossing.py
    test_depeg_scenarios.py
  fuzz/
    fuzz_trades.py
```

### Phase 7: Frontend & Deployment (Weeks 15-16)

**Deliverables:**
- [ ] Web interface for trading
- [ ] LP dashboard
- [ ] Analytics page
- [ ] TestNet deployment
- [ ] MainNet deployment
- [ ] Documentation

**Files:**
```
frontend/
  components/
    SwapInterface.tsx
    LiquidityManager.tsx
    Analytics.tsx
  utils/
    algorand.ts          # SDK integration
    orbital.ts           # Contract interaction
```

---

## 🧮 Mathematical Core

### Key Formulas (Implemented in PyTeal)

#### 1. Sphere Constraint
```python
def check_sphere_constraint(reserves: list[int], r: int) -> bool:
    """
    Validates: Σ(r - x_i)² = r²
    """
    sum_squares = 0
    for reserve in reserves:
        diff = r - reserve
        sum_squares += diff * diff
    
    return abs(sum_squares - r * r) < EPSILON
```

#### 2. Price Calculation
```python
def get_price(reserves: list[int], r: int, i: int, j: int) -> int:
    """
    Price of asset j in terms of asset i.
    Formula: (r - x_j) / (r - x_i)
    """
    numerator = r - reserves[j]
    denominator = r - reserves[i]
    
    # Fixed-point division (18 decimals)
    return (numerator * SCALE) // denominator
```

#### 3. Polar Decomposition
```python
def decompose_reserves(reserves: list[int], n: int) -> tuple[int, int]:
    """
    Decomposes reserves into parallel (alpha) and perpendicular (w_mag).
    
    Returns:
    - alpha: projection onto v direction
    - w_mag: magnitude of perpendicular component
    """
    # Calculate v = (1/√n, 1/√n, ..., 1/√n)
    sqrt_n = isqrt(n * SCALE)  # Fixed-point sqrt
    
    # alpha = (sum of reserves) / √n
    total = sum(reserves)
    alpha = (total * SCALE) // sqrt_n
    
    # Calculate parallel vector: alpha * v
    parallel = [(alpha * SCALE) // sqrt_n for _ in range(n)]
    
    # Calculate w = reserves - parallel
    w = [reserves[i] - parallel[i] for i in range(n)]
    
    # Calculate ||w|| = sqrt(sum(w_i²))
    w_squared_sum = sum(wi * wi for wi in w)
    w_mag = isqrt(w_squared_sum)
    
    return alpha, w_mag
```

#### 4. Torus Invariant
```python
def torus_invariant(
    total_reserves: list[int],
    r_int: int,
    k_bound: int,
    r_bound: int,
    n: int
) -> int:
    """
    Computes: r²_int = [(x·v - k_bound) - r_int√n]² + [||w|| - s_bound]²
    
    Returns the left-hand side (should equal r²_int).
    """
    sqrt_n = isqrt(n * SCALE)
    
    # Calculate alpha (x·v)
    total = sum(total_reserves)
    alpha = (total * SCALE) // sqrt_n
    
    # Calculate ||w||
    _, w_mag = decompose_reserves(total_reserves, n)
    
    # Calculate s_bound = sqrt(r²_bound - (k_bound - r_bound√n)²)
    k_term = k_bound - (r_bound * sqrt_n) // SCALE
    s_bound_sq = r_bound * r_bound - k_term * k_term
    s_bound = isqrt(s_bound_sq) if s_bound_sq > 0 else 0
    
    # First term: [(alpha - k_bound) - r_int√n]²
    term1_inner = alpha - k_bound - (r_int * sqrt_n) // SCALE
    term1 = term1_inner * term1_inner
    
    # Second term: [||w|| - s_bound]²
    term2_inner = w_mag - s_bound
    term2 = term2_inner * term2_inner
    
    return term1 + term2
```

#### 5. Newton's Method for Trade Solving
```python
def solve_trade_newton(
    reserves_in: list[int],
    amount_in: int,
    asset_in_idx: int,
    asset_out_idx: int,
    r_int: int,
    k_bound: int,
    r_bound: int,
    n: int,
    max_iterations: int = 10
) -> int:
    """
    Solves for amount_out using Newton's method.
    
    Given: reserves_in[asset_in_idx] += amount_in
    Find: amount_out such that torus_invariant is preserved
    """
    # Initial guess: use linear approximation
    price = get_price(reserves_in, r_int, asset_in_idx, asset_out_idx)
    x_out_guess = reserves_in[asset_out_idx] - (amount_in * price) // SCALE
    
    for iteration in range(max_iterations):
        # Create trial reserves
        trial_reserves = reserves_in.copy()
        trial_reserves[asset_in_idx] += amount_in
        trial_reserves[asset_out_idx] = x_out_guess
        
        # Compute F(x) = torus_invariant(trial) - r²_int
        F = torus_invariant(trial_reserves, r_int, k_bound, r_bound, n) - r_int * r_int
        
        # If close enough, we're done
        if abs(F) < EPSILON:
            break
        
        # Compute F'(x) via finite difference
        trial_reserves[asset_out_idx] = x_out_guess + DELTA
        F_plus = torus_invariant(trial_reserves, r_int, k_bound, r_bound, n) - r_int * r_int
        F_prime = (F_plus - F) // DELTA
        
        # Newton's update: x_new = x_old - F(x) / F'(x)
        if F_prime != 0:
            x_out_guess -= (F * SCALE) // F_prime
    
    # Amount out = initial - final
    return reserves_in[asset_out_idx] - x_out_guess
```

---

## ⚡ Technical Challenges & Solutions

### Challenge 1: Opcode Budget Constraints

**Problem:** Complex math (sqrt, Newton's method) can exceed 20,000 opcode limit.

**Solutions:**
1. **Contract Splitting:** Separate pool, tick, and trade logic
2. **Precomputation:** Store sqrt(n), r*sqrt(n) in global state
3. **Approximations:** Use Taylor series for sqrt with early termination
4. **Batching:** Group tick updates in separate transactions

**Example Optimization:**
```python
# SLOW: Compute sqrt(n) every time
sqrt_n = isqrt(n * SCALE)

# FAST: Precompute and store
sqrt_n = App.globalGet(Bytes("sqrt_n"))
```

### Challenge 2: Fixed-Point Arithmetic Precision

**Problem:** Algorand AVM uses uint64. Need 18 decimal precision.

**Solution:** Use 10^18 scaling factor, careful overflow prevention.

```python
SCALE = 10**18  # 18 decimals

def mul_fp(a: int, b: int) -> int:
    """Fixed-point multiplication: (a * b) / SCALE"""
    # Check for overflow
    assert a * b < 2**64, "Overflow in mul_fp"
    return (a * b) // SCALE

def div_fp(a: int, b: int) -> int:
    """Fixed-point division: (a * SCALE) / b"""
    assert b != 0, "Division by zero"
    return (a * SCALE) // b

def sqrt_fp(x: int) -> int:
    """Fixed-point square root via Newton's method"""
    if x == 0:
        return 0
    
    # Initial guess: x / 2
    z = x // 2
    
    for _ in range(10):  # 10 iterations sufficient
        z_new = (z + (x * SCALE) // z) // 2
        if abs(z_new - z) < 100:  # Converged
            break
        z = z_new
    
    return z
```

### Challenge 3: Box Storage Limits

**Problem:** Each box limited to 32KB. Need to store many ticks.

**Solution:** Use multiple boxes, indexed by tick_id.

```python
# Tick box key format: "tick_{pool_id}_{tick_index}"
tick_box_key = Concat(
    Bytes("tick_"),
    Itob(pool_id),
    Bytes("_"),
    Itob(tick_index)
)

# Write tick data
App.box_put(tick_box_key, tick_data)

# Read tick data
tick_data = App.box_get(tick_box_key)
```

**Storage Cost Calculation:**
- Each tick box: ~500 bytes
- 100 ticks per pool
- Total: 50KB per pool
- Cost: 0.4 ALGO minimum balance requirement

### Challenge 4: Tick Crossing Detection

**Problem:** During large trades, need to detect when reserves cross tick boundary.

**Solution:** Check alpha value before and after trade.

```python
def check_crossing(
    reserves_before: list[int],
    reserves_after: list[int],
    k_values: list[int],  # Sorted tick boundaries
    n: int
) -> tuple[bool, int]:
    """
    Returns (crossed, tick_index) if a boundary was crossed.
    """
    alpha_before = sum(reserves_before) // isqrt(n * SCALE)
    alpha_after = sum(reserves_after) // isqrt(n * SCALE)
    
    # Check if we crossed any k value
    for i, k in enumerate(k_values):
        if (alpha_before < k <= alpha_after) or (alpha_after < k <= alpha_before):
            return True, i
    
    return False, -1
```

### Challenge 5: Gas Efficiency for Multi-Tick Trades

**Problem:** Large trades might cross multiple ticks → expensive.

**Solution:** Segment trade into chunks, process iteratively.

```python
@external
def swap_large(
    pool_id: uint64,
    asset_in_id: uint64,
    asset_out_id: uint64,
    amount_in: uint64,
    min_amount_out: uint64,
    max_ticks: uint16 = 3  # Limit ticks per transaction
) -> uint64:
    """
    Handles large swaps that might cross multiple ticks.
    
    If trade would cross more than max_ticks, it requires
    multiple transactions (user calls repeatedly).
    """
    remaining_in = amount_in
    total_out = 0
    ticks_crossed = 0
    
    while remaining_in > 0 and ticks_crossed < max_ticks:
        # Execute partial trade up to next tick boundary
        chunk_out, crossed = execute_partial_swap(
            pool_id, asset_in_id, asset_out_id, remaining_in
        )
        
        total_out += chunk_out
        
        if not crossed:
            break
        
        ticks_crossed += 1
        # Update state for next iteration
    
    assert total_out >= min_amount_out, "Slippage exceeded"
    return total_out
```

---

## 🚀 Getting Started

### Prerequisites

```bash
# Install Algorand Python SDK
pip install py-algorand-sdk

# Install PyTeal
pip install pyteal

# Install development tools
pip install pytest black mypy
```

### Project Structure

```
orbital-algorand/
├── src/
│   ├── contracts/
│   │   ├── pool_manager.py
│   │   ├── tick_manager.py
│   │   └── trade_engine.py
│   ├── math/
│   │   ├── fixed_point.py
│   │   ├── vectors.py
│   │   └── sqrt.py
│   └── storage/
│       ├── tick_box.py
│       └── position_box.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fuzz/
├── scripts/
│   ├── deploy.py
│   ├── create_pool.py
│   └── simulate_trade.py
├── frontend/
│   └── (React app)
└── README.md
```

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/orbital-algorand
cd orbital-algorand

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/

# Compile contracts
python scripts/compile_contracts.py

# Deploy to TestNet
python scripts/deploy.py --network testnet

# Create a pool
python scripts/create_pool.py \
  --assets USDC,USDT,EUROC \
  --radius 1000000 \
  --fee 30

# Execute a test trade
python scripts/simulate_trade.py \
  --pool-id 12345 \
  --asset-in USDC \
  --asset-out USDT \
  --amount 100
```

---

## 💡 Example Usage

### Creating a Pool (Python SDK)

```python
from algosdk.v2client import algod
from orbital import PoolManager

# Connect to Algorand node
algod_client = algod.AlgodClient(
    algod_token="",
    algod_address="https://testnet-api.algonode.cloud"
)

# Initialize pool manager
pool_manager = PoolManager(algod_client)

# Create 3-stablecoin pool
pool_id = pool_manager.create_pool(
    creator_address="YOUR_ADDRESS",
    creator_private_key="YOUR_PRIVATE_KEY",
    asset_ids=[
        12345678,  # USDC ASA ID
        23456789,  # USDT ASA ID
        34567890,  # EUROC ASA ID
    ],
    radius=1_000_000,  # 1M units (6 decimals)
    fee_bps=30,        # 0.3% fee
)

print(f"Pool created with ID: {pool_id}")
```

### Adding Liquidity

```python
from orbital import LiquidityManager

lp_manager = LiquidityManager(algod_client)

# Add liquidity to a tight tick (k=850)
lp_tokens = lp_manager.add_liquidity(
    pool_id=pool_id,
    lp_address="YOUR_ADDRESS",
    lp_private_key="YOUR_PRIVATE_KEY",
    tick_k=850_000,  # Tight tick boundary
    amounts={
        12345678: 10_000,  # 10k USDC
        23456789: 10_000,  # 10k USDT
        34567890: 10_000,  # 10k EUROC
    }
)

print(f"Received {lp_tokens} LP tokens")
```

### Executing a Swap

```python
from orbital import TradeEngine

trade_engine = TradeEngine(algod_client)

# Swap 1000 USDC for USDT
result = trade_engine.swap(
    pool_id=pool_id,
    trader_address="YOUR_ADDRESS",
    trader_private_key="YOUR_PRIVATE_KEY",
    asset_in_id=12345678,   # USDC
    asset_out_id=23456789,  # USDT
    amount_in=1_000_000,    # 1000 USDC (6 decimals)
    min_amount_out=995_000, # 995 USDT (0.5% slippage)
)

print(f"Swapped 1000 USDC for {result['amount_out'] / 1e6} USDT")
print(f"Price impact: {result['price_impact_bps']} bps")
print(f"Effective fee: {result['fee_paid'] / 1e6} USDC")
```

### Querying Pool State

```python
from orbital import PoolQuery

query = PoolQuery(algod_client)

# Get pool information
pool_info = query.get_pool_info(pool_id)
print(f"Total liquidity: ${pool_info['tvl_usd']:,.2f}")
print(f"24h volume: ${pool_info['volume_24h']:,.2f}")
print(f"Number of ticks: {pool_info['num_ticks']}")

# Get price quote
quote = query.get_quote(
    pool_id=pool_id,
    asset_in_id=12345678,
    asset_out_id=23456789,
    amount_in=1_000_000
)

print(f"Expected output: {quote['amount_out'] / 1e6} USDT")
print(f"Price: {quote['price']}")
print(f"Will cross tick: {quote['crosses_tick']}")
```

---

## ⚙️ Gas Optimization

### Opcode Budget Breakdown

| Operation | Opcodes | Optimizations |
|-----------|---------|---------------|
| Box read | ~200 | Cache frequently accessed data |
| Box write | ~200 | Batch writes in single txn |
| Fixed-point mul | ~10 | Precompute common factors |
| Fixed-point div | ~15 | Use bit shifts where possible |
| Square root | ~150 | Use lookup table for small values |
| Newton iteration | ~300 | Limit to 5 iterations max |
| Tick consolidation | ~1000 | Amortize over multiple trades |

### Optimization Strategies

**1. Precomputation**
```python
# Store frequently used values in global state
App.globalPut(Bytes("sqrt_n"), isqrt(n * SCALE))
App.globalPut(Bytes("r_sqrt_n"), r * isqrt(n * SCALE) // SCALE)
App.globalPut(Bytes("k_min"), k_min)
App.globalPut(Bytes("k_max"), k_max)
```

**2. Lazy Tick Consolidation**
```python
# Only consolidate when tick status changes
def add_liquidity(...):
    # ... add liquidity logic ...
    
    # Check if this tick state changed
    if tick_crossed_boundary:
        consolidate_ticks()  # Expensive operation
    # Otherwise, skip consolidation
```

**3. Approximation for Small Trades**
```python
# For trades < 1% of pool, use linear approximation
if amount_in < pool_total // 100:
    # Fast path: use current price
    amount_out = amount_in * current_price // SCALE
else:
    # Slow path: solve torus invariant
    amount_out = solve_newton_method(...)
```

**4. Grouped Transactions**
```python
# For tick crossing, use atomic group
txn_1 = trade_up_to_boundary()
txn_2 = update_tick_state()
txn_3 = continue_trade()

group_id = transaction.calculate_group_id([txn_1, txn_2, txn_3])
signed_group = sign_group([txn_1, txn_2, txn_3], private_key)
algod_client.send_transactions(signed_group)
```

---

## 🧪 Testing Strategy

### Unit Tests

```python
# tests/unit/test_math.py
def test_sqrt_fp():
    """Test fixed-point square root"""
    assert sqrt_fp(4 * SCALE) == 2 * SCALE
    assert sqrt_fp(9 * SCALE) == 3 * SCALE
    assert sqrt_fp(2 * SCALE) == 1414213562373095048  # ≈ 1.414...

def test_sphere_constraint():
    """Test sphere constraint validation"""
    r = 1000 * SCALE
    reserves = [423 * SCALE, 423 * SCALE, 423 * SCALE]
    assert check_sphere_constraint(reserves, r, n=3)

def test_price_calculation():
    """Test price formula"""
    r = 1000 * SCALE
    reserves = [800 * SCALE, 600 * SCALE, 500 * SCALE]
    
    # Price of asset 1 in terms of asset 0
    price = get_price(reserves, r, 0, 1)
    expected = (r - reserves[1]) / (r - reserves[0])
    assert abs(price - expected * SCALE) < 1000  # Within tolerance
```

### Integration Tests

```python
# tests/integration/test_full_flow.py
def test_full_trading_flow(algod_client):
    """Test complete user journey"""
    
    # 1. Create pool
    pool_id = create_pool(...)
    
    # 2. Add liquidity
    lp_tokens = add_liquidity(pool_id, ...)
    
    # 3. Execute swap
    output = swap(pool_id, amount_in=1000)
    
    # 4. Verify reserves updated
    reserves = get_pool_reserves(pool_id)
    assert reserves[0] > initial_reserves[0]  # USDC increased
    assert reserves[1] < initial_reserves[1]  # USDT decreased
    
    # 5. Remove liquidity
    withdrawn = remove_liquidity(pool_id, lp_tokens)
    assert sum(withdrawn) > sum(initial_deposits)  # Fees earned
```

### Fuzz Testing

```python
# tests/fuzz/fuzz_trades.py
def test_random_trades():
    """Fuzz test with random trade sizes"""
    
    for _ in range(1000):
        # Random trade parameters
        asset_in = random.choice([0, 1, 2])
        asset_out = random.choice([i for i in range(3) if i != asset_in])
        amount = random.randint(1, 10_000)
        
        try:
            output = swap(pool_id, asset_in, asset_out, amount)
            
            # Invariants that should always hold
            assert output > 0
            assert output < get_reserve(asset_out)
            
            # Price should be reasonable
            price = amount / output
            assert 0.9 < price < 1.1  # For stablecoins
            
        except Exception as e:
            # Log failures for investigation
            print(f"Failed: {asset_in}->{asset_out}, amount={amount}, error={e}")
```

---

## 🚢 Deployment Plan

### TestNet Deployment

```bash
# 1. Compile contracts
python scripts/compile.py

# 2. Deploy pool manager
python scripts/deploy.py \
  --contract pool_manager \
  --network testnet

# 3. Deploy tick manager
python scripts/deploy.py \
  --contract tick_manager \
  --network testnet

# 4. Deploy trade engine
python scripts/deploy.py \
  --contract trade_engine \
  --network testnet

# 5. Initialize with test stablecoins
python scripts/init_testnet.py
```

### MainNet Deployment Checklist

- [ ] **Security Audit** by reputable firm (e.g., Trail of Bits, OpenZeppelin)
- [ ] **Formal Verification** of critical math functions
- [ ] **Bug Bounty Program** ($50k-$100k)
- [ ] **TestNet Public Beta** (1 month)
- [ ] **Economic Audit** (incentive alignment, game theory)
- [ ] **Multisig Governance** for upgrades
- [ ] **Emergency Pause** mechanism
- [ ] **Insurance Fund** seeding
- [ ] **Monitoring & Alerts** infrastructure
- [ ] **Documentation** (user guide, developer docs, FAQs)

### Upgrade Strategy

Since Algorand smart contracts are immutable, use **proxy pattern**:

```python
# Proxy contract (upgradeable)
@external
def execute_trade(pool_id: uint64, ...):
    # Get current trade engine address from global state
    trade_engine_app_id = App.globalGet(Bytes("trade_engine"))
    
    # Call the actual implementation
    InnerTxnBuilder.Execute({
        TxnField.type_enum: TxnType.ApplicationCall,
        TxnField.application_id: trade_engine_app_id,
        TxnField.on_completion: OnComplete.NoOp,
        # ... pass through parameters
    })
```

---

## 🔮 Future Enhancements

### Phase 2 Features

1. **Dynamic Fees**
   - Adjust fees based on volatility
   - Increase during high imbalance
   - Decrease during calm periods

2. **Flash Swaps**
   - Borrow from pool, execute arbitrage, repay + fee
   - Atomic within single transaction group

3. **Concentrated Liquidity Positions (CLP)**
   - Allow LPs to create custom range positions
   - Similar to Uniswap V3 but multi-dimensional

4. **Auto-Rebalancing**
   - Automatically move LP positions as market moves
   - Keep liquidity "in range"

5. **Governance Token**
   - Protocol fee revenue distribution
   - Vote on pool parameters
   - Grants for ecosystem development

### Algorand-Specific Optimizations

1. **State Proofs Integration**
   - Enable cross-chain stablecoin bridges
   - Bridge USDC from Ethereum to Algorand seamlessly

2. **Rekeying for Upgrades**
   - Use rekeying to enable contract upgrades
   - Maintain security with multisig

3. **Inner Transactions for Efficiency**
   - Batch multiple operations
   - Reduce transaction count

4. **ASA Clawback for Recovery**
   - Emergency recovery of stuck funds
   - Requires governance approval

---

## 📚 Resources

### Documentation
- [Orbital Paper (Paradigm)](https://paradigm.xyz/2025/06/orbital)
- [Algorand Developer Docs](https://developer.algorand.org)
- [PyTeal Documentation](https://pyteal.readthedocs.io)
- [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
- [Curve StableSwap](https://curve.fi/files/stableswap-paper.pdf)

### Tools
- [AlgoKit](https://github.com/algorandfoundation/algokit-cli)
- [Dappflow](https://dappflow.org) - Algorand IDE
- [Goal CLI](https://developer.algorand.org/docs/clis/goal/goal/)
- [Pera Wallet](https://perawallet.app)

### Community
- [Algorand Discord](https://discord.gg/algorand)
- [r/AlgorandOfficial](https://reddit.com/r/AlgorandOfficial)
- [Algorand Foundation Grants](https://algorand.foundation/grants)

---

## 🙏 Acknowledgments

- **Paradigm Research** for the Orbital AMM design
- **Algorand Foundation** for blockchain infrastructure
- **Uniswap Labs** for pioneering concentrated liquidity
- **Curve Finance** for multi-asset stablecoin pools

---

**Built with ❤️ for the Algorand ecosystem**