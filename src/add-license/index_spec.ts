/// <reference path="./../jasmine-custom-matchers.d.ts"/>

import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { HostTree } from '@angular-devkit/schematics';
const fs = require('fs');

const collectionPath = path.join(__dirname, '../collection.json');

describe('my-component', () => {
  beforeEach(() => {});

  beforeEach(() => {
    jasmine.addMatchers({
      toMatchFileContentsAtPath: function() {
        return {
          compare: function(actualFileContents: string, filePath: string) {
            const sanitizedExpectedFileContent = fs
              .readFileSync(filePath)
              .toString()
              .replace(/\s/g, '');
            const sanitizedActualFileContents = actualFileContents.replace(
              /\s/g,
              ''
            );

            const result = {
              pass:
                sanitizedActualFileContents === sanitizedExpectedFileContent,
              message: ''
            };

            if (result.pass) {
              result.message = 'Contents match expectation';
            } else {
              result.message = 'Contents did not match';
            }

            return result;
          }
        };
      }
    });
  });

  it('performs partial test', () => {
    const expectedLicenseText = 'Copyright Google Inc. All Rights Reserved';

    let tree: UnitTestTree = new UnitTestTree(new HostTree());
    tree.create('a/b/c.md', 'markdown file should not have a license added');
    tree.create('a/b/c.ts', 'typescript file should have a license');

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = runner.runSchematic(
      'add-license',
      { sourceDir: 'a' },
      tree
    );

    expect(resultTree.files.length).toBe(2);

    expect(resultTree.readContent('a/b/c.ts')).toContain(expectedLicenseText);

    expect(resultTree.readContent('a/b/c.md')).not.toContain(expectedLicenseText);
  });

  it('performs full test', () => {
    let tree: UnitTestTree = new UnitTestTree(new HostTree());
    tree.create('a/b/c.ts', 'typescript file should have a license');

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = runner.runSchematic(
      'add-license',
      { sourceDir: 'a' },
      tree
    );
    expect(resultTree.files.length).toBe(1);

    var filePath = path.join(
      __dirname,
      'file-snapshots',
      'performs-full-test.txt'
    );
    expect(resultTree.readContent('a/b/c.ts')).toMatchFileContentsAtPath(
      filePath
    );
  });
});
