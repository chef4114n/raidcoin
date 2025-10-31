import fetch from 'node-fetch'
import { config } from 'dotenv'

// Load environment variables
config()

async function testManualPayout() {
  try {
    console.log('Testing manual payout trigger...')
    
    const adminWallet = process.env.CREATOR_WALLET_ADDRESS
    console.log('Using admin wallet:', adminWallet)
    
    // Test the manual payout trigger
    const response = await fetch('http://localhost:3000/api/admin/payout-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-wallet': adminWallet
      },
      body: JSON.stringify({ action: 'trigger_payout' })
    })
    
    console.log('Response status:', response.status)
    
    const result = await response.text()
    console.log('Response body:', result)
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testManualPayout()