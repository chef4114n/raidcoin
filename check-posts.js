const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPosts() {
  try {
    console.log('Checking posts in database...');
    
    const allPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            twitterHandle: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Total posts found: ${allPosts.length}`);
    
    if (allPosts.length > 0) {
      console.log('\nPosts:');
      allPosts.forEach((post, index) => {
        console.log(`\n${index + 1}. Post ID: ${post.id}`);
        console.log(`   Tweet ID: ${post.tweetId}`);
        console.log(`   User: ${post.user.name} (@${post.user.twitterHandle})`);
        console.log(`   Content: ${post.content.substring(0, 100)}...`);
        console.log(`   Points Awarded: ${post.pointsAwarded}`);
        console.log(`   Last Processed: ${post.lastProcessed}`);
        console.log(`   URL: ${post.url}`);
        console.log(`   Created: ${post.createdAt}`);
      });
    }

    // Check pending posts (same query as admin panel)
    console.log('\nChecking pending posts (admin panel query)...');
    const pendingPosts = await prisma.post.findMany({
      where: {
        OR: [
          { pointsAwarded: 0 },
          { lastProcessed: null }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            twitterHandle: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    console.log(`Pending posts for admin review: ${pendingPosts.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();