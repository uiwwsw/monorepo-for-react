const ncp = require('ncp').ncp;
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const targetDir = '../monorepo-for-github';
fs.readdirSync(targetDir).forEach((file) => {
  if (file !== '.git') {
    rimraf.sync(`${targetDir}/${file}`);
  }
});
const filterFunc = (filename) => {
  const relativePath = path.relative(__dirname, filename);
  if (
    relativePath.startsWith('.git/') ||
    relativePath === '.git' ||
    relativePath.includes('node_modules') ||
    relativePath.includes('dist')
  )
    return false;
  return true;
};

ncp('./', targetDir, { filter: filterFunc }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Copy completed.');
});
