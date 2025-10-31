const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdminWallet() {
  try {
    console.log('Checking for admin wallet: EUZHkLdK57woXEi24ZqE1nr9pDJA3FnAphoqg8M5yGSr')
    
    const adminUser = await prisma.user.findFirst({
      where: {
        walletAddress: 'EUZHkLdK57woXEi24ZqE1nr9pDJA3FnAphoqg8M5yGSr'
      }
    })
    
    if (adminUser) {
      console.log('Admin user found:', {
        id: adminUser.id,
        username: adminUser.username,
        walletAddress: adminUser.walletAddress,
        email: adminUser.email
      })
    } else {
      console.log('Admin user NOT found in database')
    }
    
    // Also check all users in the database
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        walletAddress: true,
        email: true,
        twitterHandle: true
      }
    })
    
    console.log('\nAll users in database:')
    allUsers.forEach(user => {
      console.log(`- ${user.name || user.twitterHandle || 'NO_NAME'}: ${user.walletAddress || 'NO_WALLET'}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminWallet()