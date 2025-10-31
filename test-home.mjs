import fetch from 'node-fetch'

async function testSimplePage() {
  try {
    console.log('Testing simple homepage...')
    
    const response = await fetch('http://localhost:3000/')
    
    console.log('Response status:', response.status)
    
    const result = await response.text()
    console.log('Response length:', result.length)
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSimplePage()