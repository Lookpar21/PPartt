
let history = [];

function autoComma() {
  let input = document.getElementById('input');
  input.value = input.value.replace(/[^PBT]/gi, '').toUpperCase().split('').join(',');
}

function analyze() {
  const raw = document.getElementById('input').value;
  const results = raw.split(',').filter(c => ['P', 'B', 'T'].includes(c));
  const table = document.getElementById('tableBody');
  table.innerHTML = '';
  history = [];

  for (let i = 0; i < results.length; i++) {
    const recent = results.slice(0, i + 1);
    const reco = analyzePattern(recent);
    const row = { turn: i + 1, result: results[i], advice: reco, action: '', outcome: '' };
    history.push(row);
    addRow(row);
  }

  updateChart();
}

function analyzePattern(seq) {
  let patterns = [];
  const last = seq.slice(-1)[0];
  const last2 = seq.slice(-2);
  const last3 = seq.slice(-3);
  const last4 = seq.slice(-4);
  const last5 = seq.slice(-5);
  const last6 = seq.slice(-6);

  if (last4.join() === 'P,B,P,B') patterns.push('ปิงปอง');
  if (last4.join() === 'B,P,B,P') patterns.push('ปิงปอง');

  if (last6.every(v => v === 'P')) patterns.push('มังกรน้ำเงิน');
  if (last6.every(v => v === 'B')) patterns.push('มังกรแดง');

  if (last3.every(v => v === last)) patterns.push('ไพ่ติด');

  if (seq.join().includes('P,P,B,B,P,P')) patterns.push('ไพ่คู่');
  if (seq.join().includes('B,P,P,B,P,P')) patterns.push('แดง1น้ำเงิน2');
  if (seq.join().includes('P,B,B,P,B,B')) patterns.push('น้ำเงิน1แดง2');
  if (last2.join() === 'B,P') patterns.push('แดงต่อ');
  if (last2.join() === 'P,B') patterns.push('น้ำเงินต่อ');
  if (last === 'B') patterns.push('เจอแดงลงน้ำเงิน');
  if (last === 'P') patterns.push('เจอน้ำเงินลงแดง');

  let advice = '-';
  if (patterns.length) {
    if (patterns.includes('ปิงปอง')) {
      const last = seq[seq.length - 1];
      advice = last === 'P' ? 'B (ปิงปอง)' : 'P (ปิงปอง)';
    } else {
      advice = seq[seq.length - 1] + ' (' + patterns.join(' + ') + ')';
    }
  }
  return advice;
}

function addRow(row) {
  const table = document.getElementById('tableBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${row.turn}</td>
    <td>${row.result}</td>
    <td>${row.advice}</td>
    <td>${row.action}</td>
    <td>${row.outcome}</td>
  `;
  table.appendChild(tr);
}

function markAction(action) {
  const table = document.getElementById('tableBody');
  if (!history.length) return;
  const last = history[history.length - 1];
  if (['ลงเดิมพัน', 'ชนะ', 'แพ้', 'ไม่ลง'].includes(action)) {
    if (action === 'ลงเดิมพัน') last.action = '✔';
    else last.outcome = action;
  }
  table.lastChild.innerHTML = `
    <td>${last.turn}</td>
    <td>${last.result}</td>
    <td>${last.advice}</td>
    <td>${last.action}</td>
    <td>${last.outcome}</td>
  `;
}

function resetAll() {
  document.getElementById('input').value = '';
  document.getElementById('tableBody').innerHTML = '';
  const ctx = document.getElementById('chart').getContext('2d');
  ctx.clearRect(0, 0, 300, 150);
  history = [];
}

function updateChart() {
  const counts = { P: 0, B: 0, T: 0 };
  history.forEach(r => counts[r.result]++);
  const ctx = document.getElementById('chart').getContext('2d');
  ctx.clearRect(0, 0, 300, 150);

  const max = Math.max(counts.P, counts.B, counts.T, 1);
  const barW = 60;
  const gap = 40;
  ['P','B','T'].forEach((key, i) => {
    const h = (counts[key] / max) * 100;
    ctx.fillStyle = key === 'P' ? 'blue' : key === 'B' ? 'red' : 'green';
    ctx.fillRect(30 + i * (barW + gap), 140 - h, barW, h);
    ctx.fillStyle = '#000';
    ctx.fillText(key + ': ' + counts[key], 30 + i * (barW + gap), 145);
  });
}
