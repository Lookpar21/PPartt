
let patternLength = 10; // ค่าเริ่มต้น

// เพิ่มฟังก์ชันเลือกจำนวนตา
function setPatternLength(len) {
    patternLength = len;
    analyzeNext(); // วิเคราะห์ใหม่เมื่อมีการเปลี่ยนค่า
}


let allRounds = JSON.parse(localStorage.getItem('baccaratRounds') || '[]');
let currentRound = JSON.parse(localStorage.getItem('baccaratCurrent') || '[]');

function saveData() {
    localStorage.setItem('baccaratRounds', JSON.stringify(allRounds));
    localStorage.setItem('baccaratCurrent', JSON.stringify(currentRound));
}

function renderCurrentRound() {
    document.getElementById("current-round").innerText = currentRound.join(", ");
}

function renderHistory() {
    let content = "";
    allRounds.forEach((round, index) => {
        content += `<p><strong>รอบที่ ${index + 1}:</strong> ${round.join(", ")}</p>`;
    });
    document.getElementById("history-content").innerHTML = content;
}

function toggleHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.style.display = historyDiv.style.display === "none" ? "block" : "none";
}

function startNewRound() {
    if (currentRound.length > 0) {
        allRounds.push(currentRound);
        currentRound = [];
        saveData();
        renderCurrentRound();
        renderHistory();
    }
}

function addResult() {
    const input = document.getElementById("input").value.toUpperCase().replace(/\s+/g, '');
    let results = input.includes(',') ? input.split(',') : input.split('');
    results = results.map(c => c.trim()).filter(c => ['P','B','T'].includes(c));
    currentRound.push(...results);
    saveData();
    renderCurrentRound();
    document.getElementById("input").value = '';
}

function analyzeNext() {
    const maxPatternLength = 6;
    const allHistory = allRounds.flat();
    let recommendation = '';
    let patternUsed = '';
    for (let len = maxPatternLength; len >= 3; len--) {
        if (currentRound.length < len) continue;
        const pattern = currentRound.slice(-len).join('');
        let matches = [];
        for (let i = 0; i <= allHistory.length - len - 1; i++) {
            const slice = allHistory.slice(i, i + len).join('');
            if (slice === pattern) {
                matches.push(allHistory[i + len]);
            }
        }
        if (matches.length > 0) {
            const count = { 'P': 0, 'B': 0, 'T': 0 };
            matches.forEach(r => count[r]++);
            let best = Object.entries(count).sort((a,b) => b[1] - a[1])[0][0];
            recommendation = `แนะนำให้ลง: ${best} (จาก ${count['P']}P ${count['B']}B ${count['T']}T)`;
            patternUsed = `แพทเทิร์นที่ใช้วิเคราะห์: ${pattern.split('').join(',')}`;
            break;
        }
    }
    document.getElementById("next-recommendation").innerText = recommendation || "ไม่พบแพทเทิร์นที่ตรงกัน";
    document.getElementById("used-pattern").innerText = patternUsed;
}
renderCurrentRound();
renderHistory();
