import { App } from 'obsidian';
import { FileLeaf } from '../src/FileLeaf';

/**
 * Test suite for FileLeaf class
 * Runs basic tests on FileLeaf functionality
 */
export async function testFileLeaf(app: App): Promise<void> {
    console.log('Starting FileLeaf tests...');

    // Get a test file from the vault
    const files = app.vault.getFiles();
    if (files.length === 0) {
        console.error('No files found in vault for testing');
        return;
    }

    const testFile = files[0]; // Use the first file for testing
    console.log(`Testing with file: ${testFile.path}`);

    try {
        // Test 1: Constructor
        const fileLeaf = new FileLeaf(testFile.name, testFile.path, app);
        console.log('✓ Constructor test passed');

        // Test 2: getName
        const name = fileLeaf.getName();
        if (name === testFile.name) {
            console.log('✓ getName test passed');
        } else {
            console.error(`✗ getName test failed: expected ${testFile.name}, got ${name}`);
        }

        // Test 3: getPath
        const path = fileLeaf.getPath();
        if (path === testFile.path) {
            console.log('✓ getPath test passed');
        } else {
            console.error(`✗ getPath test failed: expected ${testFile.path}, got ${path}`);
        }

        // Test 4: fileMetadata (basic check)
        const metadata = fileLeaf.fileMetadata();
        if (typeof metadata === 'object') {
            console.log('✓ fileMetadata test passed');
        } else {
            console.error('✗ fileMetadata test failed: expected object');
        }

        // Test 5: retrieveAllPaths
        const paths = fileLeaf.retrieveAllPaths();
        if (Array.isArray(paths)) {
            console.log('✓ retrieveAllPaths test passed');
        } else {
            console.error('✗ retrieveAllPaths test failed: expected array');
        }

        // Test 6: readInitial
        const preview = fileLeaf.readInitial();
        if (typeof preview === 'string') {
            console.log('✓ readInitial test passed');
        } else {
            console.error('✗ readInitial test failed: expected string');
        }

        // Note: Skipping async methods like addNewTag, removeTag, etc. as they modify files
        // and require more complex setup for testing

        console.log('FileLeaf tests completed');

    } catch (error) {
        console.error('FileLeaf test failed with error:', error);
    }
}