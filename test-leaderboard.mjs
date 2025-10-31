import fetch from 'node-fetch'
import { config } from 'dotenv'

// Load environment variables
config()

async function testLeaderboardAPI() {
  try {
    console.log('Testing leaderboard API with admin wallet header...')
    
    const adminWallet = process.env.CREATOR_WALLET_ADDRESS
    console.log('Using admin wallet:', adminWallet)
    
    const response = await fetch('http://localhost:3000/api/admin/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-wallet': adminWallet
      }
    })
    
    console.log('Response status:', response.status)
    
    const result = await response.text()
    console.log('Response body:', result)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testLeaderboardAPI()