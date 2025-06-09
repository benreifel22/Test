const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('index.html', () => {
  test('contains chart element', () => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    const dom = new JSDOM(html);
    const chart = dom.window.document.getElementById('chart');
    expect(chart).not.toBeNull();
  });
});
