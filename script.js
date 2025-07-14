
let currentAction = '';
function formatInput() {
  let input = document.getElementById('resultInput');
  input.value = input.value.toUpperCase().replace(/[^PBT]/g, '').split('').join(',') + ',';
}
function analyze() {
  const raw = document.getElementById('resultInput').value.replace(/,$/, '');
  const results = raw.split(',');
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = '';
  let pCount = 0, bCount = 0, tCount = 0;
  results.forEach((res, i) => {
    let reco = getRecommendation(results.slice(0, i + 1));
    let row = tbody.insertRow();
    row.insertCell(0).textContent = i + 1;
    row.insertCell(1).textContent = res;
    row.insertCell(2).textContent = reco;
    row.insertCell(3).textContent = '';
    row.insertCell(4).textContent = '';
    if (res === 'P') pCount++;
    if (res === 'B') bCount++;
    if (res === 'T') tCount++;
  });
  updateChart(pCount, bCount, tCount);
}
function getRecommendation(seq) {
  const last6 = seq.slice(-6).join(',');
  const last5 = seq.slice(-5).join(',');
  const last4 = seq.slice(-4).join(',');
  const last3 = seq.slice(-3).join(',');
  const last2 = seq.slice(-2).join(',');
  const last1 = seq.slice(-1).join(',');
  const patterns = [
    { pattern: 'P,B,P,B', reco: 'P (ปิงปอง)' },
    { pattern: 'B,B,B', reco: 'B (ไพ่ติด)' },
    { pattern: 'B,B,B,B,B,B', reco: 'B (มังกรแดง)' },
    { pattern: 'P,P,P,P,P,P', reco: 'P (มังกรน้ำเงิน)' },
    { pattern: 'P,P,B,B,P,P', reco: 'B (ไพ่คู่)' },
    { pattern: 'B,P,P,B,P,P', reco: 'B (แดง1น้ำเงิน2)' },
    { pattern: 'P,B,B,P,B,B', reco: 'P (น้ำเงิน1แดง2)' },
    { pattern: 'B,P,B', reco: 'B (แดงต่อ)' },
    { pattern: 'P,B,P', reco: 'P (น้ำเงินต่อ)' },
    { pattern: 'B', reco: 'P (เจอแดงลงน้ำเงิน)' },
    { pattern: 'P', reco: 'B (เจอน้ำเงินลงแดง)' }
  ];
  let recs = [];
  patterns.forEach(p => {
    if (last6.endsWith(p.pattern) || last5.endsWith(p.pattern) || last4.endsWith(p.pattern) || last3.endsWith(p.pattern) || last2.endsWith(p.pattern) || last1.endsWith(p.pattern)) {
      recs.push(p.reco);
    }
  });
  return recs.length ? seq[seq.length - 1] + ' (' + recs.join(' + ') + ')' : '-';
}
function setAction(action) {
  currentAction = action;
  const tbody = document.querySelector('#resultTable tbody');
  if (!tbody.rows.length) return;
  let lastRow = tbody.rows[tbody.rows.length - 1];
  if (action === 'ลง') lastRow.cells[3].textContent = 'ลง';
  if (['ชนะ','แพ้','ไม่ลง'].includes(action)) lastRow.cells[4].textContent = action;
}
function resetAll() {
  document.getElementById('resultInput').value = '';
  document.querySelector('#resultTable tbody').innerHTML = '';
  updateChart(0, 0, 0);
}
function updateChart(p, b, t) {
  if (window.myChart) window.myChart.destroy();
  const ctx = document.getElementById('chart');
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['P', 'B', 'T'],
      datasets: [{
        label: 'สถิติรวม',
        data: [p, b, t],
        backgroundColor: ['blue', 'red', 'green']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
