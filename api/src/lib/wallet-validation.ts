import { isAddress, verifyMessage } from 'viem'

export async function validateWalletAddress(address: string): Promise<{
  isValid: boolean
  isContract: boolean
  hasActivity: boolean
}> {
  try {
    // Check if address format is valid
    if (!isAddress(address)) {
      return {
        isValid: false,
        isContract: false,
        hasActivity: false
      }
    }

    // Check if address is a contract
    const bytecode = await publicClient.getBytecode({ address: address as `0x${string}` })
    const isContract = bytecode !== undefined && bytecode !== '0x'

    // Check if address has any transaction activity
    const balance = await publicClient.getBalance({ address: address as `0x${string}` })
    const transactionCount = await publicClient.getTransactionCount({ address: address as `0x${string}` })
    
    const hasActivity = balance > 0n || transactionCount > 0

    return {
      isValid: true,
      isContract,
      hasActivity
    }
  } catch (error) {
    console.error('Wallet validation error:', error)
    return {
      isValid: false,
      isContract: false,
      hasActivity: false
    }
  }
}

export async function validateWalletSignature(
  address: string,
  message: string, 
  signature: string
): Promise<boolean> {
  try {
    // Verify the signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`
    })

    return isValid
  } catch (error) {
    console.error('Wallet signature validation error:', error)
    return false
  }
}