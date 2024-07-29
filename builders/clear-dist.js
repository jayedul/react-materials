const fs = require('fs');
const path = require('path');

const directory = path.resolve(process.cwd() + '/dist');

fs.readdir(directory, (err, files) => {

  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(directory, file);
    fs.stat(filePath, (err, stat) => {
      if (err) throw err;

      if (stat.isFile()) {
        fs.unlink(filePath, err => {
          if (err) throw err;
        });
      }
    });
  });
});
