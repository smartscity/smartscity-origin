import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = (locale) =>
  JSON.parse(readFileSync(`src/i18n/${locale}.json`, 'utf8'));
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, shape(v)]),
    );
  assert.equal(typeof value, 'string');
  assert.ok(value.trim());
  return 'string';
}
assert.deepEqual(shape(read('en')), shape(read('zh-CN')));
console.log(
  'PASS: English and Simplified Chinese have matching keys, array shapes, and non-empty text.',
);
