import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js';
import { parseISO, formatISO, subWeeks, eachWeekOfInterval, addWeeks, startOfISOWeek, getISOWeek, getISOWeekYear } from 'https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm';

async function loadData() {
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('Failed to load data', e);
    return [];
  }
}

function countByWeek(items) {
  const now = new Date();
  const start = startOfISOWeek(subWeeks(now, 11));
  const weeks = eachWeekOfInterval({ start, end: now });
  const labels = weeks.map(w => `${getISOWeekYear(w)}-W${String(getISOWeek(w)).padStart(2, '0')}`);
  const counts = weeks.map(w => {
    const end = addWeeks(w, 1);
    return items.filter(it => {
      const d = parseISO(it.date);
      return d >= w && d < end;
    }).length;
  });
  return { labels, counts };
}

function listToday(items) {
  const list = document.getElementById('today-list');
  const today = formatISO(new Date(), { representation: 'date' });
  const todays = items.filter(it => it.date === today);
  if (!todays.length) return;
  todays.forEach(it => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = it.link;
    a.textContent = `${it.source}: ${it.title}`;
    a.target = '_blank';
    li.appendChild(a);
    list.appendChild(li);
  });
}

(async () => {
  const items = await loadData();
  const { labels, counts } = countByWeek(items);
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Items per Week', data: counts }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
  listToday(items);
})();
