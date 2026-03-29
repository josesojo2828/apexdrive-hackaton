const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const auctions = await prisma.auction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { car: true }
  });
  console.log(JSON.stringify(auctions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
