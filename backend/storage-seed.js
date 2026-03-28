/* eslint-disable no-undef */
// backend/seed-storage.js
// Ensure .env has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// Also npm install @supabase/supabase-js dotenv glob mime-types

const { createClient } = require('@supabase/supabase-js');
const glob = require('glob');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedDir = path.join(__dirname, 'supabase', 'storage-seed');

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedStorage() {
    console.log('Starting dynamic storage seed...');

    if (!fs.existsSync(seedDir)) {
        console.error(`Seed directory not found: ${seedDir}`);
        return;
    }

    // 1. Lese alle Unterordner in `storage-seed` aus (das sind unsere Bucket-Namen)
    const entries = fs.readdirSync(seedDir, { withFileTypes: true });
    const bucketsToProcess = entries
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    if (bucketsToProcess.length === 0) {
        console.log('No bucket folders found in storage-seed directory.');
        return;
    }

    // 2. Hole alle aktuell existierenden Buckets (um API-Calls zu sparen)
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error('Error listing buckets:', listError.message);
        return;
    }
    const existingBucketNames = existingBuckets.map(b => b.name);

    // 3. Iteriere über jeden gefundenen Ordner (Bucket)
    for (const bucketName of bucketsToProcess) {
        console.log(`\n--- Processing bucket: '${bucketName}' ---`);

        // Check & Create Bucket
        if (!existingBucketNames.includes(bucketName)) {
            console.log(`Bucket '${bucketName}' does not exist. Creating...`);
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true // Wir machen standardmäßig alle Seed-Buckets öffentlich
            });
            if (createError) {
                console.error(`Error creating bucket '${bucketName}':`, createError.message);
                continue; // Überspringe diesen Bucket bei Fehler
            }
            console.log(`Bucket '${bucketName}' created.`);
        } else {
            console.log(`Bucket '${bucketName}' already exists.`);
        }

        // 4. Lade Dateien aus DIESEM spezifischen Bucket-Ordner
        const bucketDirPath = path.join(seedDir, bucketName);
        const files = glob.sync("**/*", { cwd: bucketDirPath, nodir: true });

        if (files.length === 0) {
            console.log(`No files found in ${bucketName}/. Skipping upload.`);
            continue;
        }

        // 5. Dateien parallel hochladen
        await Promise.all(files.map(async (fileRelativePath) => {
            const absoluteFilePath = path.join(bucketDirPath, fileRelativePath);
            const fileContent = fs.readFileSync(absoluteFilePath);

            const { error } = await supabase.storage
                .from(bucketName)
                .upload(fileRelativePath, fileContent, {
                    upsert: true,
                    // Wichtig für dein Projekt: HLS Files korrekt taggen
                    contentType: mime.lookup(absoluteFilePath) || 'application/octet-stream'
                });

            if (error) {
                console.error(`Error uploading ${fileRelativePath} to ${bucketName}:`, error.message);
            } else {
                console.log(`Uploaded: [${bucketName}] / ${fileRelativePath}`);
            }
        }));
    }
    console.log('\n✅ Storage seed completed successfully.');
}

seedStorage().catch(err => console.error('Unhandled error:', err));