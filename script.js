
let history = [];
function autoFormat() {
  let input = document.getElementById('resultsInput');
  let value = input.value.replace(/[^PBT]/gi, '').toUpperCase().split('').join(',');
  input.value = value;
  analyze();
}
function analyze() {
  // will insert full logic for 11 patterns here
}
function placeBet() {
  if (history.length === 0) return;
  history[history.length - 1].bet = 'ลงแล้ว';
  renderTable();
}
function setResult(result) {
  if (history.length === 0) return;
  history[history.length - 1].result = result;
  renderTable();
}
function resetAll() {
  history = [];
  document.getElementById('resultsInput').value = '';
  renderTable();
  drawChart();
}
function renderTable() {
  const tbody = document.getElementById('historyBody');
  tbody.innerHTML = '';
  history.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.outcome}</td>
      <td>${item.suggestion || '-'}</td>
      <td>${item.bet || '-'}</td>
      <td>${item.result || '-'}</td>
    `;
    tbody.appendChild(row);
  });
}
function drawChart() {
  // Graph rendering logic here
}
