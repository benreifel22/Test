import Parser from 'rss-parser';
import {readFile, writeFile} from 'fs/promises';
import {format, startOfISOWeek, getISOWeek, getISOWeekYear, subWeeks, parseISO, isAfter} from 'date-fns';

const FEEDS = [
  'https://www.wto.org/library/rss/latest_news_e.xml'
];

const parser = new Parser();
const DATA_FILE = './data.json';
const now = new Date();

async function loadData() {
  try {
    const text = await readFile(DATA_FILE, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    return { items: [], counts: [] };
  }
}

async function fetchFeed(url) {
  try {
    const res = await fetch(url);
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    const weekAgo = subWeeks(now, 1);
    return feed.items
      .filter(i => i.pubDate && new Date(i.pubDate) > weekAgo)
      .map(i => ({
        date: new Date(i.pubDate).toISOString(),
        source: feed.title || url,
        title: i.title || '',
        link: i.link || ''
      }));
  } catch (err) {
    console.error('Error fetching', url, err.message);
    return [];
  }
}

function buildCounts(items) {
  const map = new Map();
  for (const item of items) {
    const d = new Date(item.date);
    const label = `${getISOWeekYear(d)}-W${String(getISOWeek(d)).padStart(2,'0')}`;
    map.set(label, (map.get(label) || 0) + 1);
  }
  const sorted = Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  return sorted.slice(-12).map(([weekLabel, count]) => ({weekLabel, count}));
}

async function main() {
  const data = await loadData();
  let items = data.items || [];

  for (const url of FEEDS) {
    const newItems = await fetchFeed(url);
    items = items.concat(newItems);
  }

  const cutoff = subWeeks(now, 12);
  items = items.filter(i => isAfter(parseISO(i.date), cutoff));

  const counts = buildCounts(items);

  await writeFile(DATA_FILE, JSON.stringify({items, counts}, null, 2));
}

main();
