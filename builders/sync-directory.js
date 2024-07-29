const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

module.exports.syncDirectory = function (sourceDir, targetDir) {
  const watcher = chokidar.watch(sourceDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher
    .on('add', (filePath) => syncFile(filePath, sourceDir, targetDir))
    .on('addDir', (dirPath) => syncDirectory(dirPath, sourceDir, targetDir))
    .on('unlink', (filePath) => deleteFile(filePath, sourceDir, targetDir))
    .on('unlinkDir', (dirPath) => deleteDirectory(dirPath, sourceDir, targetDir))
    .on('change', (filePath) => syncFile(filePath, sourceDir, targetDir));

  function syncFile(filePath, sourceDir, targetDir) {
    const relativePath = path.relative(sourceDir, filePath);
    const targetPath = path.join(targetDir, relativePath);

    fs.mkdir(path.dirname(targetPath), { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`);
        return;
      }
      fs.copyFile(filePath, targetPath, (err) => {
        if (err) {
          console.error(`Error copying file: ${err}`);
        }
      });
    });
  }

  function syncDirectory(dirPath, sourceDir, targetDir) {
    const relativePath = path.relative(sourceDir, dirPath);
    const targetPath = path.join(targetDir, relativePath);

    fs.mkdir(targetPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`);
      }
    });
  }

  function deleteFile(filePath, sourceDir, targetDir) {
    const relativePath = path.relative(sourceDir, filePath);
    const targetPath = path.join(targetDir, relativePath);

    fs.unlink(targetPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      }
    });
  }

  function deleteDirectory(dirPath, sourceDir, targetDir) {
    const relativePath = path.relative(sourceDir, dirPath);
    const targetPath = path.join(targetDir, relativePath);

    fs.rmdir(targetPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error deleting directory: ${err}`);
      }
    });
  }
};