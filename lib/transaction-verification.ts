import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const u2uSolaris = {
  id: 39,
  name: 'U2U Solaris Mainnet',
  network: 'u2u-solaris',
  nativeCurrency: {
    decimals: 18,
    name: 'U2U',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.u2uscan.xyz'],
    },
    public: {
      http: ['https://rpc.u2uscan.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'U2UScan', url: 'https://u2uscan.xyz' },
  },
  testnet: false,
}

type VerificationReceipt = Awaited<
  ReturnType<ReturnType<typeof createPublicClient>['waitForTransactionReceipt']>
>

export interface TransactionVerificationResult {
  success: boolean
  receipt?: VerificationReceipt
  error?: string
  confirmations?: number
}

export interface TransactionVerificationOptions {
  hash: string
  chainId: number
  requiredConfirmations?: number
  timeoutMs?: number
}

export async function verifyTransaction({
  hash,
  chainId,
  requiredConfirmations = 1,
  timeoutMs = 60000,
}: TransactionVerificationOptions): Promise<TransactionVerificationResult> {
  try {
    const client = createPublicClient({
      chain: chainId === 11155111 ? sepolia : u2uSolaris,
      transport: http(),
    })

    console.log(`Verifying transaction ${hash} on chain ${chainId}...`)

    const receipt: VerificationReceipt = await Promise.race([
      client.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
        confirmations: requiredConfirmations,
        timeout: timeoutMs,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Transaction verification timeout')), timeoutMs)
      ),
    ])

    if (!receipt) {
      return {
        success: false,
        error: 'No receipt received',
      }
    }

    if (receipt.status !== 'success') {
      return {
        success: false,
        error: 'Transaction failed on-chain',
        receipt,
      }
    }

    console.log(
      `Transaction ${hash} verified successfully with ${requiredConfirmations} confirmations`
    )

    return {
      success: true,
      receipt,
      confirmations: requiredConfirmations,
    }
  } catch (error) {
    console.error(`Transaction verification failed for ${hash}:`, error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
    }
  }
}

export async function getTransactionDetails(hash: string, chainId: number) {
  try {
    const client = createPublicClient({
      chain: chainId === 11155111 ? sepolia : u2uSolaris,
      transport: http(),
    })

    const tx = await client.getTransaction({
      hash: hash as `0x${string}`,
    })

    return {
      success: true,
      transaction: tx,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction details',
    }
  }
}

export function getExplorerUrl(hash: string, chainId: number): string {
  if (chainId === 11155111) {
    return `https://sepolia.etherscan.io/tx/${hash}`
  }

  if (chainId === 39) {
    return `https://u2uscan.xyz/tx/${hash}`
  }

  return ''
}

export function getChainDisplayName(chainId: number): string {
  if (chainId === 11155111) {
    return 'Sepolia Testnet'
  }

  if (chainId === 39) {
    return 'U2U Solaris Mainnet'
  }

  return `Chain ${chainId}`
}
