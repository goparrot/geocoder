import fs from 'fs';
import path from 'path';

async function run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { scripts, devDependencies, husky, files, 'lint-staged': lintStaged, directories, config, ...packageJson } = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json')).toString(),
    );

    packageJson.main = './cjs/index.js';
    packageJson.module = './esm/index.js';
    packageJson.typings = './types/index.d.ts';
    packageJson.sideEffects = false;

    fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 4));

    const copyFiles = ['README.md'];
    for (const file of copyFiles) {
        fs.copyFileSync(`./${file}`, `./dist/${file}`);
    }
}

void run();
