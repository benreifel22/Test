async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('Failed to load data', e);
    return [];
  }
}

function isoWeekStr(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function groupByWeek(items) {
  const counts = {};
  for (const item of items) {
    const week = isoWeekStr(new Date(item.date));
    counts[week] = (counts[week] || 0) + 1;
  }
  return counts;
}

async function init() {
  const items = await loadData();
  const counts = groupByWeek(items);
  const weeks = Object.keys(counts).sort();
  const data = weeks.map(w => counts[w]);

  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [{
        label: 'Items',
        data,
        borderColor: 'skyblue',
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const todayList = document.getElementById('today');
  const todayStr = new Date().toISOString().slice(0,10);
  items.filter(i => i.date.slice(0,10) === todayStr).forEach(i => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = i.link;
    a.textContent = `[${i.source}] ${i.title}`;
    a.target = '_blank';
    li.appendChild(a);
    todayList.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded', init);
