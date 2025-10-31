// Quick database check script
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database for users and posts...\n');
    
    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        twitterHandle: true,
        email: true,
        totalPoints: true,
        totalEarned: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        totalPoints: 'desc'
      }
    });
    
    console.log(`Total users: ${allUsers.length}`);
    console.log('All users:');
    allUsers.forEach(user => {
      console.log(`- ${user.name || user.twitterHandle || user.email}: ${user.totalPoints} points, ${user._count.posts} posts`);
    });
    
    // Check all posts
    const allPosts = await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        pointsAwarded: true,
        lastProcessed: true,
        user: {
          select: {
            name: true,
            twitterHandle: true
          }
        }
      },
      orderBy: {
        pointsAwarded: 'desc'
      }
    });
    
    console.log(`\nTotal posts: ${allPosts.length}`);
    console.log('Posts with points:');
    allPosts.filter(post => post.pointsAwarded > 0).forEach(post => {
      console.log(`- ${post.user.name || post.user.twitterHandle}: ${post.pointsAwarded} points, processed: ${post.lastProcessed ? 'Yes' : 'No'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();