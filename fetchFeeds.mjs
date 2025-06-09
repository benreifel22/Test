import fs from 'fs/promises';
import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { subDays, subWeeks, formatISO, parseISO, isAfter } from 'date-fns';

const FEEDS = [
  'https://www.wto.org/library/rss/latest_news_e.xml'
];

const parser = new Parser({ fetch });
const DATA_FILE = new URL('./data.json', import.meta.url);

async function loadData() {
  try {
    const text = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(it => ({
      date: formatISO(new Date(it.pubDate || it.isoDate || Date.now()), { representation: 'date' }),
      source: feed.title || new URL(url).hostname,
      title: it.title || '',
      link: it.link || ''
    }));
  } catch (e) {
    console.error('Failed to fetch', url, e.message);
    return [];
  }
}

async function main() {
  const cutoff = subDays(new Date(), 7);
  let items = await loadData();

  for (const url of FEEDS) {
    const records = await fetchFeed(url);
    for (const r of records) {
      const date = parseISO(r.date);
      if (isAfter(date, cutoff)) {
        if (!items.find(i => i.link === r.link)) {
          items.push(r);
        }
      }
    }
  }

  const oldest = subWeeks(new Date(), 12);
  items = items.filter(i => isAfter(parseISO(i.date), oldest));
  items.sort((a, b) => new Date(a.date) - new Date(b.date));

  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

main();
