import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import parseArgs from 'minimist';
import { SemVer } from 'semver';

function getCurrentGitBranch(): string {
    return execSync('git branch --show-current').toString().trim();
}

/**
 * @var {string} p - path to directory where package.json is located
 */
const { p: packageJsonDir = '.' } = parseArgs(process.argv.slice(2));

void (async (): Promise<void> => {
    const packageJsonPath = `${packageJsonDir}/package.json`;
    const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
    const { version } = packageJson;
    const branchName: string = getCurrentGitBranch();

    const ticketNumber: string | undefined = /^(feature|feat|hotifx|fix)\/(\d+)/gim.exec(branchName)?.[0]?.split('/').pop();
    const semVer: SemVer = new SemVer(version);

    if (!semVer) {
        throw new Error(`Can't find package.json version`);
    }

    console.log('Input data', { packageJsonPath, branchName, ticketNumber, version: semVer.format() });

    if (!semVer.prerelease.length && !ticketNumber) {
        throw new Error(`Your branch should contain the ticket number or the package.json version should be with the prerelease version`);
    }
    if (semVer.prerelease.length && Number.isSafeInteger(semVer.prerelease[semVer.prerelease.length - 1])) {
        // @ts-ignore
        semVer.prerelease[semVer.prerelease.length - 1]++;
    } else if (ticketNumber) {
        semVer.prerelease = [`dev`, ticketNumber, 0];
    }

    console.log('Output data', { packageJsonPath, branchName, ticketNumber, version: semVer.format() });

    packageJson.version = semVer.format();
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
})();
