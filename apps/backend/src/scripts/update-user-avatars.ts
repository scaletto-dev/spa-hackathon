import prisma from "../lib/prisma";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

/**
 * Update existing users without avatars to have default avatar
 * Using raw SQL since Prisma client might not be regenerated yet
 */
async function updateUserAvatars() {
   console.log("🔄 Starting user avatar update...\n");

   try {
      // Default avatar URL (you can change this to any default image)
      const defaultAvatar =
         "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

      // First, check how many users need update
      const countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count 
      FROM "User" 
      WHERE avatar IS NULL OR avatar = ''
    `;

      const count = countResult[0] ? Number(countResult[0].count) : 0;
      console.log(`📊 Found ${count} users without avatars`);

      if (count === 0) {
         console.log("✅ All users already have avatars!");
         return;
      }

      // Get users without avatar
      const users = await prisma.$queryRaw<
         Array<{ id: string; email: string; fullName: string }>
      >`
      SELECT id, email, "fullName"
      FROM "User"
      WHERE avatar IS NULL OR avatar = ''
    `;

      console.log(`\n📝 Users to update:`);
      users.forEach((user, index) => {
         console.log(`   ${index + 1}. ${user.email} (${user.fullName})`);
      });

      // Update all users without avatar
      const result = await prisma.$executeRaw`
      UPDATE "User"
      SET avatar = ${defaultAvatar}
      WHERE avatar IS NULL OR avatar = ''
    `;

      console.log(
         `\n🎉 Successfully updated ${result} users with default avatars!`
      );
      console.log(`📷 Default avatar: ${defaultAvatar}`);
   } catch (error) {
      console.error("❌ Error updating user avatars:", error);
      throw error;
   } finally {
      await prisma.$disconnect();
   }
}

// Run the update
updateUserAvatars()
   .then(() => {
      console.log("\n✨ Avatar update completed successfully!");
      process.exit(0);
   })
   .catch((error) => {
      console.error("\n💥 Avatar update failed:", error);
      process.exit(1);
   });
