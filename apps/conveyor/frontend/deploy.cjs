const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function copyFile(src, dest) {
  await fs.copyFile(src, dest);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory() ? await copyDir(srcPath, destPath) : await copyFile(srcPath, destPath);
  }
}
async function deleteDir(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error deleting directory ${dir}:`, err);
  }
}

async function main() {
  try {
    await deleteDir('./deploy');
    // pnpm build 명령 실행
    execSync('pnpm do @library* build', { stdio: 'inherit' });
    execSync('pnpm do @app-conveyor/frontend build', { stdio: 'inherit' });

    // dist 폴더와 index.js 파일 복사
    await copyDir('./apps/conveyor/frontend/dist', './deploy/dist');
    await copyFile('./apps/conveyor/frontend/index.js', './deploy/index.js');
    await copyFile('./apps/conveyor/frontend/package-deploy.json', './deploy/package.json');

    // 종속성 설치
    execSync('cd ./deploy && npm i', { stdio: 'inherit' });
    console.log('Deployment preparation complete.');
  } catch (error) {
    console.error('Deployment script failed:', error);
  }
}

main();
