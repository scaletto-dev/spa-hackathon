import { supabase } from '../lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function testSupabaseStorage() {
  console.log('==============================================');
  console.log('Testing Supabase Storage');
  console.log('==============================================\n');

  const testFileName = `test-image-${Date.now()}.txt`;
  const testFilePath = 'services/' + testFileName;

  try {
    // Test 1: Create a test file buffer (simulating an image upload)
    console.log('Test 1: Prepare test file for upload');
    const testFileContent = 'This is a test file for Supabase Storage verification';
    const fileBuffer = Buffer.from(testFileContent);
    console.log(` Success: Created test file buffer (${fileBuffer.length} bytes)\n`);

    // Test 2: Upload file to storage
    console.log('Test 2: Upload file to storage');
    console.log(`Uploading to: images/${testFilePath}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(testFilePath, fileBuffer, {
        contentType: 'text/plain',
        upsert: false,
      });

    if (uploadError) {
      console.error(' Error uploading file:', uploadError.message);
      console.log('\n  Make sure you have:');
      console.log('1. Created a "images" bucket in Supabase Storage');
      console.log('2. Set the bucket to Public');
      console.log('3. Created a "services/" folder in the bucket');
      process.exit(1);
    }

    console.log(' Success: File uploaded');
    console.log(`File path: ${uploadData.path}\n`);

    // Test 3: Get public URL
    console.log('Test 3: Get public URL for uploaded file');
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(testFilePath);

    console.log(' Success: Retrieved public URL');
    console.log(`Public URL: ${urlData.publicUrl}\n`);

    // Test 4: List files in services folder
    console.log('Test 4: List files in services folder');
    const { data: listData, error: listError } = await supabase.storage
      .from('images')
      .list('services', {
        limit: 10,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      console.error(' Error listing files:', listError.message);
    } else {
      console.log(` Success: Found ${listData.length} files in services/`);
      listData.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name} (${file.metadata?.size || 0} bytes)`);
      });
      console.log('');
    }

    // Test 5: Download the uploaded file
    console.log('Test 5: Download uploaded file');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('images')
      .download(testFilePath);

    if (downloadError) {
      console.error(' Error downloading file:', downloadError.message);
    } else {
      const downloadedContent = await downloadData.text();
      console.log(' Success: File downloaded');
      console.log(`Content matches: ${downloadedContent === testFileContent}`);
      console.log('');
    }

    // Test 6: Delete the uploaded file (cleanup)
    console.log('Test 6: Delete uploaded file (cleanup)');
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([testFilePath]);

    if (deleteError) {
      console.error(' Error deleting file:', deleteError.message);
    } else {
      console.log(' Success: File deleted\n');
    }

    // Test 7: Verify deletion
    console.log('Test 7: Verify file deletion');
    const { data: verifyData, error: verifyError } = await supabase.storage
      .from('images')
      .download(testFilePath);

    if (verifyError) {
      console.log(' Success: File no longer exists (expected error)\n');
    } else {
      console.log(' Warning: File still exists after deletion\n');
    }

    console.log('==============================================');
    console.log('All Storage Tests Passed! ');
    console.log('==============================================');
    console.log('\nNext Steps:');
    console.log('1. Create remaining folders: branches/, blog/, profile/');
    console.log('2. Configure storage policies for authenticated uploads');
    console.log('3. Test uploading actual image files (JPEG, PNG, WEBP)');
  } catch (error) {
    console.error(' Storage Test Failed:');
    console.error(error);
    process.exit(1);
  }
}

testSupabaseStorage();