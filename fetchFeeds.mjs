import fs from 'fs/promises';
import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { subWeeks, subDays, isAfter } from 'date-fns';

const FEEDS = [
  'https://www.wto.org/library/rss/latest_news_e.xml',
  'https://ustr.gov/about-us/policy-offices/press-office/press-releases/rss.xml'
];

const parser = new Parser({ fetch });

let existing = [];
try {
  const txt = await fs.readFile('data.json', 'utf8');
  existing = JSON.parse(txt);
} catch (_) {
  // ignore if file doesn't exist or invalid
}

const now = new Date();
const sevenDaysAgo = subDays(now, 7);

for (const url of FEEDS) {
  try {
    const feed = await parser.parseURL(url);
    const source = feed.title || new URL(url).hostname;
    for (const item of feed.items || []) {
      const date = item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate);
      if (!date || isNaN(date) || !isAfter(date, sevenDaysAgo)) continue;
      existing.push({
        date: date.toISOString(),
        source,
        title: item.title,
        link: item.link
      });
    }
  } catch (err) {
    console.error(`Failed to fetch ${url}: ${err.message}`);
  }
}

const cutoff = subWeeks(now, 12);
existing = existing
  .filter(entry => isAfter(new Date(entry.date), cutoff))
  .sort((a, b) => new Date(a.date) - new Date(b.date));

await fs.writeFile('data.json', JSON.stringify(existing, null, 2));
