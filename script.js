
let history = [];
let currentBet = '';
let currentOutcome = '';

function parseInput(input) {
    return input.toUpperCase().replace(/[^PBT]/g, '').split('');
}

function addResult() {
    const input = document.getElementById('input-result').value;
    const results = parseInput(input);
    results.forEach(result => {
        const pattern = history.slice(-6).map(r => r.result).join(',') + ',' + result;
        const recommendation = analyzePattern([...history.map(h => h.result), result]);
        history.push({
            result,
            recommend: recommendation,
            bet: '',
            outcome: ''
        });
    });
    document.getElementById('input-result').value = '';
    renderTable();
    renderChart();
}

function analyzePattern(results) {
    let reco = [];
    const last = results[results.length - 1];
    const prev = results[results.length - 2];
    const pattern = results.slice(-6).join(',');

    if (results.slice(-6).join(',') === 'P,B,P,B,P,B') reco.push('P (ปิงปอง)');
    else if (results.slice(-6).join(',') === 'B,P,B,P,B,P') reco.push('B (ปิงปอง)');
    else if (/^P{4,}$/.test(results.slice(-6).join(''))) reco.push('P (มังกรน้ำเงิน)');
    else if (/^B{4,}$/.test(results.slice(-6).join(''))) reco.push('B (มังกรแดง)');
    else if (/^(P{3,}|B{3,})$/.test(results.slice(-3).join(''))) reco.push(last + ' (ไพ่ติด)');
    else if (results.slice(-6).join(',') === 'P,P,B,B,P,P') reco.push('B (ไพ่คู่)');
    else if (results.slice(-6).join(',') === 'B,P,P,B,P,P') reco.push('B (แดง1น้ำเงิน2)');
    else if (results.slice(-6).join(',') === 'P,B,B,P,B,B') reco.push('P (น้ำเงิน1แดง2)');
    else if (results.slice(-3).join(',') === 'B,P,B') reco.push('B (แดงต่อ)');
    else if (results.slice(-3).join(',') === 'P,B,P') reco.push('P (น้ำเงินต่อ)');
    else if (results.slice(-1)[0] === 'B') reco.push('P (เจอแดงลงน้ำเงิน)');
    else if (results.slice(-1)[0] === 'P') reco.push('B (เจอน้ำเงินลงแดง)');
    return reco.length > 0 ? reco.join(' + ') : '-';
}

function markBet(type) {
    if (history.length === 0) return;
    const last = history.length - 1;
    if (type === 'ลง') history[last].bet = '✔️';
    else history[last].outcome = type;
    renderTable();
}

function resetData() {
    history = [];
    renderTable();
    renderChart();
}

function renderTable() {
    const tbody = document.querySelector('#result-table tbody');
    tbody.innerHTML = '';
    history.forEach((item, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.result}</td>
            <td>${item.recommend}</td>
            <td>${item.bet}</td>
            <td>${item.outcome}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderChart() {
    const ctx = document.getElementById('stats-chart').getContext('2d');
    const counts = { P: 0, B: 0, T: 0 };
    history.forEach(h => counts[h.result]++);
    if (window.chart) window.chart.destroy();
    window.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['P', 'B', 'T'],
            datasets: [{
                label: 'จำนวน',
                data: [counts.P, counts.B, counts.T],
                backgroundColor: ['blue', 'red', 'green']
            }]
        }
    });
}
