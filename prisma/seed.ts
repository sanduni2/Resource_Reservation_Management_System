import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.resource.count();
  if (existing > 0) {
    console.log("Seed data already exists.");
    return;
  }

  await prisma.resource.createMany({
    data: [
      { name: "Boardroom A", type: "Meeting Room", location: "Floor 2", capacity: 12 },
      { name: "Innovation Lab", type: "Workshop Space", location: "Floor 3", capacity: 8 },
      { name: "Camera Kit", type: "Equipment", location: "Storage Room", capacity: 2 },
      { name: "Training Hall", type: "Event Space", location: "Ground Floor", capacity: 30 },
    ],
  });

  console.log("Database seeded with initial resources.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
