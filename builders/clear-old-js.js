const fs = require('fs');
const path = require('path');

// Directory containing build files
const distDir = path.resolve(process.cwd(), './dist');

// Regex to capture "filename.timestamp.js" and ".map"
const fileRegex = /^(.+)\.(\d+)\.js(\.map)?$/;

(async function cleanOldBuilds() {
  try {
    const files = await fs.promises.readdir(distDir);
    const fileGroups = {};

    for (const file of files) {
      const match = file.match(fileRegex);
      if (match) {
        const [, name, timestampStr] = match;
        const timestamp = Number(timestampStr);

        fileGroups[name] = fileGroups[name] || [];
        fileGroups[name].push({ file, timestamp });
      }
    }

    for (const name of Object.keys(fileGroups)) {
      // sort by timestamp
      fileGroups[name].sort((a, b) => b.timestamp - a.timestamp);

      const [latest, ...oldFiles] = fileGroups[name];
      for (const old of oldFiles) {
        const jsFilePath = path.join(distDir, old.file);
        try {
          await fs.promises.unlink(jsFilePath);
          console.log(`Deleted old file: ${old.file}`);
        } catch (err) {
          console.error(`Error deleting file ${old.file}:`, err);
        }
      }
    }

    console.log('Cleanup complete.');
  } catch (err) {
    console.error('Error cleaning up builds:', err);
  }
})();
