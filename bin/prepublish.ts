import { writeFileSync, copyFileSync } from 'fs';
import originPackage from '../package.json';

const distPackage: Record<string, any> = originPackage;
distPackage.module = './index.js';
distPackage.main = './index.js';
distPackage.types = './index.d.ts';
delete distPackage.scripts;
delete distPackage.devDependencies;
delete distPackage.config;
delete distPackage.husky;
delete distPackage.files;
delete distPackage.directories;
delete distPackage['lint-staged'];

writeFileSync('./dist/package.json', JSON.stringify(distPackage, null, '  '));

const copyFiles = ['README.md'];
for (const file of copyFiles) {
    copyFileSync(`./${file}`, `./dist/${file}`);
}
