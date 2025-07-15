
let history = JSON.parse(localStorage.getItem('baccarat_history')) || [];
let currentRound = JSON.parse(localStorage.getItem('baccarat_current')) || [];
let patternLength = 5;

function saveState() {
    localStorage.setItem('baccarat_history', JSON.stringify(history));
    localStorage.setItem('baccarat_current', JSON.stringify(currentRound));
}

function addResult() {
    const input = document.getElementById('inputResult').value.toUpperCase().replace(/[^PBT]/g, '');
    for (let char of input) {
        if (['P', 'B', 'T'].includes(char)) {
            currentRound.push(char);
        }
    }
    document.getElementById('inputResult').value = '';
    saveState();
    displayCurrent();
}

function newRound() {
    if (currentRound.length > 0) {
        history.push(currentRound);
        currentRound = [];
        saveState();
        displayHistory();
        displayCurrent();
        document.getElementById('suggestionText').innerText = '';
    }
}

function displayCurrent() {
    document.getElementById('currentResults').innerText = currentRound.join(', ');
}

function displayHistory() {
    const container = document.getElementById('historyRounds');
    container.innerHTML = '';
    history.forEach((round, index) => {
        const div = document.createElement('div');
        div.innerText = `รอบที่ ${index + 1}: ` + round.join(', ');
        container.appendChild(div);
    });
}

function toggleHistory() {
    const el = document.getElementById('history');
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function setPatternLength(n) {
    patternLength = n;
    analyzeNext();
}

function analyzeNext() {
    if (currentRound.length < patternLength) {
        document.getElementById('suggestionText').innerText = 'ข้อมูลไม่พอสำหรับวิเคราะห์';
        return;
    }
    const pattern = currentRound.slice(-patternLength).join('');
    let counts = { 'P': 0, 'B': 0, 'T': 0 };
    history.forEach(round => {
        for (let i = 0; i <= round.length - patternLength - 1; i++) {
            if (round.slice(i, i + patternLength).join('') === pattern) {
                const next = round[i + patternLength];
                if (counts[next] !== undefined) counts[next]++;
            }
        }
    });
    let suggestion = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (suggestion[1] === 0) {
        document.getElementById('suggestionText').innerText = 'ไม่พบแพทเทิร์นนี้มาก่อน';
    } else {
        document.getElementById('suggestionText').innerText =
            `แพทเทิร์นที่ใช้วิเคราะห์: ${pattern}
แนะนำให้ลง: ${suggestion[0]} (จาก ${counts.P}P ${counts.B}B ${counts.T}T)`;
    }
}

function backupData() {
    const data = {
        baccarat_history: history,
        baccarat_current: currentRound
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baccarat_backup.json';
    a.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            history = data.baccarat_history || [];
            currentRound = data.baccarat_current || [];
            saveState();
            displayCurrent();
            displayHistory();
            document.getElementById('suggestionText').innerText = '';
        } catch (err) {
            alert('ไฟล์ไม่ถูกต้อง');
        }
    };
    reader.readAsText(file);
}

window.onload = function () {
    displayCurrent();
    displayHistory();
};
