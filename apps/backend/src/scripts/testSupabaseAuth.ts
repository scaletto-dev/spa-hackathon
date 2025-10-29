import {
  signInWithOTP,
  verifyOTP,
  getCurrentUser,
  signOut,
} from '../lib/supabaseAuth';

// Test email - CHANGE THIS TO YOUR EMAIL
const TEST_EMAIL = 'baodev.work@gmail.com';

async function testSupabaseAuth() {
  console.log('==============================================');
  console.log('Testing Supabase Authentication');
  console.log('==============================================\n');

  console.log(`  IMPORTANT: Update TEST_EMAIL in this script to your email before running!\n`);
  console.log(`Current test email: ${TEST_EMAIL}\n`);

  if (TEST_EMAIL === 'your-email@example.com') {
    console.log(' Please update TEST_EMAIL in apps/backend/src/scripts/testSupabaseAuth.ts');
    console.log('   with a real email address you can access.\n');
    process.exit(1);
  }

  try {
    // Test 1: Send OTP to email
    console.log('Test 1: Send OTP code to email');
    console.log(`Sending OTP to: ${TEST_EMAIL}`);
    const otpResult = await signInWithOTP(TEST_EMAIL);

    if (otpResult.error) {
      console.error(' Error sending OTP:', otpResult.error.message);
      process.exit(1);
    }

    console.log(' Success: OTP code sent to email\n');
    console.log(' Check your email inbox (and spam folder) for the OTP code\n');
    console.log('==============================================');
    console.log('  MANUAL STEP REQUIRED');
    console.log('==============================================');
    console.log('1. Check your email for the OTP code (6-digit number)');
    console.log('2. Update the OTP_CODE variable below');
    console.log('3. Uncomment the verification code section');
    console.log('4. Run this script again\n');

    // UNCOMMENT BELOW AFTER RECEIVING OTP CODE
    /*
    const OTP_CODE = '123456'; // REPLACE WITH YOUR OTP CODE

    // Test 2: Verify OTP code
    console.log('Test 2: Verify OTP code');
    const verifyResult = await verifyOTP(TEST_EMAIL, OTP_CODE);

    if (verifyResult.error) {
      console.error(' Error verifying OTP:', verifyResult.error.message);
      process.exit(1);
    }

    console.log(' Success: OTP verified');
    console.log(`Access Token: ${verifyResult.data?.accessToken.substring(0, 20)}...`);
    console.log(`User ID: ${verifyResult.data?.user.id}`);
    console.log(`Email: ${verifyResult.data?.user.email}\n`);

    // Test 3: Get current user with access token
    console.log('Test 3: Get current user with access token');
    const getUserResult = await getCurrentUser(verifyResult.data!.accessToken);

    if (getUserResult.error) {
      console.error(' Error getting user:', getUserResult.error.message);
      process.exit(1);
    }

    console.log(' Success: Retrieved user data');
    console.log(`User ID: ${getUserResult.data?.id}`);
    console.log(`Email: ${getUserResult.data?.email}`);
    console.log(`Email Verified: ${getUserResult.data?.email_confirmed_at ? 'Yes' : 'No'}\n`);

    // Test 4: Sign out
    console.log('Test 4: Sign out user');
    const signOutResult = await signOut(verifyResult.data!.accessToken);

    if (signOutResult.error) {
      console.error(' Error signing out:', signOutResult.error.message);
      process.exit(1);
    }

    console.log(' Success: User signed out\n');

    console.log('==============================================');
    console.log('All Auth Tests Passed! ');
    console.log('==============================================');
    */
  } catch (error) {
    console.error(' Auth Test Failed:');
    console.error(error);
    process.exit(1);
  }
}

testSupabaseAuth();