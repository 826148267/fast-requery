import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function getCurrentVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  return packageJson.version;
}

function createGitTag(version: string): void {
  const tagName = `v${version}`;

  try {
    // 确保所有更改都已提交
    const status = execSync('git status --porcelain').toString();
    if (status) {
      throw new Error('Working directory is not clean. Please commit all changes first.');
    }

    // 创建并推送标签
    execSync(`git tag -a ${tagName} -m "Release ${tagName}"`);
    execSync(`git push origin ${tagName}`);

    process.stdout.write(`Successfully created and pushed tag: ${tagName}\n`);
  } catch (error) {
    process.stderr.write(`Failed to create git tag: ${error}\n`);
    process.exit(1);
  }
}

function generateChangelog(version: string): void {
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  const date = new Date().toISOString().split('T')[0];

  const newVersion = `\n## [${version}] - ${date}\n`;
  const changes = execSync('git log --pretty=format:"- %s" $(git describe --tags --abbrev=0)..HEAD')
    .toString()
    .split('\n')
    .filter((line) => !line.startsWith('- Release'))
    .join('\n');

  const changelog = fs.existsSync(changelogPath)
    ? fs.readFileSync(changelogPath, 'utf-8')
    : '# Changelog\n';

  fs.writeFileSync(
    changelogPath,
    changelog.replace('# Changelog\n', `# Changelog\n${newVersion}\n${changes}\n`)
  );
}

function main(): void {
  try {
    const version = getCurrentVersion();

    process.stdout.write('Starting release process...\n');

    // 生成更新日志
    generateChangelog(version);
    process.stdout.write('Generated changelog\n');

    // 提交更新日志
    execSync('git add CHANGELOG.md');
    execSync(`git commit -m "docs: update changelog for v${version}"`);
    process.stdout.write('Committed changelog\n');

    // 创建 Git 标签
    createGitTag(version);

    process.stdout.write(`\nRelease v${version} completed successfully!\n`);
    process.stdout.write('\nNext steps:\n');
    process.stdout.write('1. Upload dist.zip to Chrome Web Store\n');
    process.stdout.write('2. Submit for review\n');
    process.stdout.write('3. Create GitHub release with dist.zip\n');
  } catch (error) {
    process.stderr.write(`Release failed: ${error}\n`);
    process.exit(1);
  }
}

main();
