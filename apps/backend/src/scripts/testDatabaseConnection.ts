import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('==============================================');
  console.log('Testing Database Connection with Supabase');
  console.log('==============================================\n');

  try {
    // Test 1: Count all users
    console.log('Test 1: SELECT - Count all users');
    const userCount = await prisma.user.count();
    console.log(` Success: Found ${userCount} users\n`);

    // Test 2: Create a test ServiceCategory
    console.log('Test 2: INSERT - Create test ServiceCategory');
    const testCategory = await prisma.serviceCategory.create({
      data: {
        name: 'Test Category',
        slug: `test-category-${Date.now()}`,
        description: 'This is a test category for database connection verification',
        displayOrder: 999,
      },
    });
    console.log(` Success: Created category with ID: ${testCategory.id}\n`);

    // Test 3: Update the test ServiceCategory
    console.log('Test 3: UPDATE - Update test ServiceCategory');
    const updatedCategory = await prisma.serviceCategory.update({
      where: { id: testCategory.id },
      data: {
        description: 'Updated description to verify UPDATE operation',
      },
    });
    console.log(` Success: Updated category: ${updatedCategory.name}\n`);

    // Test 4: Query the updated category
    console.log('Test 4: SELECT - Query updated category');
    const queriedCategory = await prisma.serviceCategory.findUnique({
      where: { id: testCategory.id },
    });
    console.log(` Success: Retrieved category: ${queriedCategory?.name}`);
    console.log(`   Description: ${queriedCategory?.description}\n`);

    // Test 5: Delete the test ServiceCategory
    console.log('Test 5: DELETE - Delete test ServiceCategory');
    await prisma.serviceCategory.delete({
      where: { id: testCategory.id },
    });
    console.log(` Success: Deleted category with ID: ${testCategory.id}\n`);

    // Test 6: Verify deletion
    console.log('Test 6: SELECT - Verify deletion');
    const deletedCategory = await prisma.serviceCategory.findUnique({
      where: { id: testCategory.id },
    });
    if (deletedCategory === null) {
      console.log(' Success: Category successfully deleted (returns null)\n');
    } else {
      console.log(' Error: Category still exists after deletion\n');
    }

    console.log('==============================================');
    console.log('All Database Tests Passed! ');
    console.log('==============================================');
  } catch (error) {
    console.error(' Database Test Failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();