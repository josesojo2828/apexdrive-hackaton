const { PrismaClient } = require('./prisma/generated');
const prisma = new PrismaClient();

async function main() {
  const trips = await prisma.trip.findMany();
  console.log('Trips:', trips.map(t => ({ id: t.id, createdAt: t.createdAt })));
  
  const sessions = await prisma.session.findMany();
  console.log('Sessions:', sessions.length);

  const logs = await prisma.auditLog.findMany();
  console.log('Logs:', logs.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
