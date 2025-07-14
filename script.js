
const history = [];

function analyze() {
  const input = document.getElementById("resultsInput");
  let raw = input.value.toUpperCase().replace(/[^PBT]/g, '');
  raw = raw.split('').join(',');
  input.value = raw;

  const results = raw.split(',').filter(r => r);
  updateChart(results);

  const tbody = document.getElementById("historyBody");
  tbody.innerHTML = '';

  results.forEach((res, i) => {
    const suggestions = [];

    // ปิงปอง
    if (i >= 3) {
      const [r1, r2, r3] = [results[i - 3], results[i - 2], results[i - 1]];
      if ((r1 === 'P' && r2 === 'B' && r3 === 'P') || (r1 === 'B' && r2 === 'P' && r3 === 'B')) {
        suggestions.push(r3 === 'P' ? 'B (ปิงปอง)' : 'P (ปิงปอง)');
      }
      // ไพ่ติด
      if (r1 === r2 && r2 === r3) {
        suggestions.push(`${r3} (ไพ่ติด)`);
      }
    }

    const row = history[i] || { bet: '-', result: '', suggest: '', outcome: res };
    row.outcome = res;
    row.suggest = suggestions.join(' + ') || '-';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.outcome}</td>
      <td>${row.suggest}</td>
      <td>${row.bet}</td>
      <td>${row.result}</td>
    `;
    tbody.appendChild(tr);
    history[i] = row;
  });
}

function placeBet() {
  const idx = history.findIndex(r => r.bet === '-');
  if (idx !== -1) {
    const suggest = history[idx].suggest;
    history[idx].bet = suggest.startsWith('P') ? 'P' : suggest.startsWith('B') ? 'B' : '-';
    analyze();
  }
}

function setResult(result) {
  const idx = history.findIndex(r => r.result === '');
  if (idx !== -1) {
    history[idx].result = result;
    analyze();
  }
}

function resetAll() {
  history.length = 0;
  document.getElementById("resultsInput").value = '';
  document.getElementById("historyBody").innerHTML = '';
  updateChart([]);
}

function updateChart(results) {
  const p = results.filter(r => r === 'P').length;
  const b = results.filter(r => r === 'B').length;
  const t = results.filter(r => r === 'T').length;

  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const max = Math.max(p, b, t, 1);
  const barWidth = 80;
  const gap = 40;
  const heightUnit = 150 / max;

  const bars = [
    { label: 'P', value: p, color: 'blue' },
    { label: 'B', value: b, color: 'red' },
    { label: 'T', value: t, color: 'green' },
  ];

  bars.forEach((bar, i) => {
    const x = i * (barWidth + gap);
    const h = bar.value * heightUnit;
    ctx.fillStyle = bar.color;
    ctx.fillRect(x, canvas.height - h, barWidth, h);
    ctx.fillStyle = '#000';
    ctx.fillText(`${bar.label}: ${bar.value}`, x + 15, canvas.height - h - 5);
  });
}
