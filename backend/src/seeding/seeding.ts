import "dotenv/config";
import { prisma } from "../config/prisma.js";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      id: "1",
      image: "1",
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
