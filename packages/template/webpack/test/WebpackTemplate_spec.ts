import * as testUtils from '@electron-forge/test-utils';
import { expect } from 'chai';
import fs from 'fs-extra';
import path from 'path';
import template from '../src/WebpackTemplate';

describe('WebpackTemplate', () => {
  let dir: string;

  before(async () => {
    dir = await testUtils.ensureTestDirIsNonexistent();
  });

  it('should succeed in initializing the webpack template', async () => {
    await template.initializeTemplate(dir, {});
  });

  it('should copy the appropriate template files', async () => {
    const expectedFiles = ['webpack.main.config.js', 'webpack.renderer.config.js', 'webpack.rules.js', path.join('src', 'renderer.js')];
    for (const filename of expectedFiles) {
      await testUtils.expectProjectPathExists(dir, filename, 'file');
    }
  });

  it('should move and rewrite the main process file', async () => {
    await testUtils.expectProjectPathNotExists(dir, path.join('src', 'index.js'), 'file');
    await testUtils.expectProjectPathExists(dir, path.join('src', 'main.js'), 'file');
    expect((await fs.readFile(path.join(dir, 'src', 'main.js'))).toString()).to.match(/MAIN_WINDOW_WEBPACK_ENTRY/);
  });

  it('should remove the stylesheet link from the HTML file', async () => {
    expect((await fs.readFile(path.join(dir, 'src', 'index.html'))).toString()).to.not.match(/link rel="stylesheet"/);
  });

  after(async () => {
    await fs.remove(dir);
  });
});
