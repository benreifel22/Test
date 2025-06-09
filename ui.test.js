import { JSDOM } from 'jsdom';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('renders chart or message', async () => {
  const dom = await JSDOM.fromFile(path.resolve(__dirname, 'index.html'), {
    runScripts: 'dangerously',
    resources: 'usable'
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  const canvas = dom.window.document.querySelector('canvas');
  const fallback = dom.window.document.getElementById('fallback');
  expect(canvas || fallback).toBeTruthy();
});
