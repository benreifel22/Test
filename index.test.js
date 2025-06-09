const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('index.html', () => {
  test('contains greeting element', async () => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    const dom = new JSDOM(html);
    const greeting = dom.window.document.getElementById('greeting');
    expect(greeting).not.toBeNull();
  });
});
