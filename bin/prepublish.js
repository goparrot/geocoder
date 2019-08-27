const fs = require('fs');

const originalPackage = require('../package.json');
originalPackage.module = './index.js';
originalPackage.main = './index.js';
originalPackage.types = './index.d.ts';
delete originalPackage.scripts;
delete originalPackage.devDependencies;
delete originalPackage.config;
delete originalPackage.husky;
delete originalPackage.files;
delete originalPackage.directories;
delete originalPackage['lint-staged'];

fs.writeFileSync('./dist/package.json', JSON.stringify(originalPackage, null, '  '));

const copyFiles = ['README.md'];
for (const file of copyFiles) {
    fs.copyFileSync(`./${file}`, `./dist/${file}`);
}
