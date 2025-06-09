async function load() {
  const canvas = document.getElementById('trend');
  const fallback = document.getElementById('fallback');
  const list = document.getElementById('today');

  try {
    const res = await fetch('data.json');
    const data = await res.json();
    const counts = data.counts || [];

    if (counts.length) {
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: counts.map(c => c.weekLabel),
          datasets: [{
            label: 'Items',
            data: counts.map(c => c.count),
            borderColor: '#39a0ff',
            backgroundColor: 'rgba(57,160,255,.2)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#e8e8e8' } },
            y: { ticks: { color: '#e8e8e8' } }
          },
          plugins: {
            legend: { labels: { color: '#e8e8e8' } }
          }
        }
      });
    } else {
      canvas.style.display = 'none';
      fallback.removeAttribute('class');
    }

    const today = new Date().toISOString().slice(0,10);
    (data.items || [])
      .filter(i => i.date.slice(0,10) === today)
      .forEach(i => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = i.link;
        a.target = '_blank';
        a.textContent = i.title;
        li.appendChild(a);
        list.appendChild(li);
      });
  } catch (err) {
    console.error(err);
    canvas.style.display = 'none';
    fallback.textContent = 'No data yet — check back tomorrow.';
  }
}

document.addEventListener('DOMContentLoaded', load);
