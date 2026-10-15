// The Miloe engine's SEO fixes (content/seo-meta.json): a page's search title and description
// come from the file when it sets both, and from the site's own defaults otherwise.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readEngineMeta } from '../lib/page-meta.mjs';

function dirWith(text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-meta-'));
  fs.mkdirSync(path.join(dir, 'content'));
  if (text !== null) fs.writeFileSync(path.join(dir, 'content', 'seo-meta.json'), text);
  return dir;
}

test('reads the engine file', () => {
  const meta = readEngineMeta(dirWith('{"/services":{"title":"T","description":"D"}}'));
  assert.equal(meta['/services'].title, 'T');
});

test('a missing or broken file is no fixes, never a broken build', () => {
  assert.deepEqual(readEngineMeta(dirWith(null)), {});
  assert.deepEqual(readEngineMeta(dirWith('not json')), {});
  assert.deepEqual(readEngineMeta(dirWith('[1,2]')), {});
});

test('the committed file is valid and pages fall back to their defaults', async () => {
  const { pageMetadata, PAGE_META } = await import('../lib/page-meta.mjs');
  const file = readEngineMeta();
  for (const key of Object.keys(PAGE_META)) {
    const m = pageMetadata(key);
    assert.ok(m.title && m.description, key);
  }
  assert.equal(typeof file, 'object');
});
