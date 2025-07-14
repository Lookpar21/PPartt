let results = JSON.parse(localStorage.getItem("results")) || [];
let patternMemory = JSON.parse(localStorage.getItem("patternMemory")) || {};

function saveAll() {
  localStorage.setItem("results", JSON.stringify(results));
  localStorage.setItem("patternMemory", JSON.stringify(patternMemory));
}

function addResults() {
  const input = document.getElementById("resultInput").value.toUpperCase().replace(/\s+/g, '');
  const newResults = input.includes(",") ? input.split(",") : input.split("");
  newResults.forEach(res => {
    if (["P", "B", "T"].includes(res)) {
      results.push(res);
    }
  });
  learnPatterns();
  saveAll();
  render();
  document.getElementById("resultInput").value = "";
}

function learnPatterns() {
  for (let i = 0; i < results.length - 5; i++) {
    const pattern = results.slice(i, i + 5).join(",");
    const next = results[i + 5];
    if (!patternMemory[pattern]) {
      patternMemory[pattern] = { P: 0, B: 0, T: 0 };
    }
    patternMemory[pattern][next]++;
  }
}

function render() {
  const tableBody = document.querySelector("#historyTable tbody");
  tableBody.innerHTML = "";
  results.forEach((res, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${index + 1}</td><td>${res}</td>`;
    tableBody.appendChild(row);
  });

  const summary = {
    P: results.filter(r => r === "P").length,
    B: results.filter(r => r === "B").length,
    T: results.filter(r => r === "T").length,
  };
  document.getElementById("summary").innerText =
    `Player (P): ${summary.P} | Banker (B): ${summary.B} | Tie (T): ${summary.T}`;

  analyzePatterns();
}

function queryResult() {
  const index = parseInt(document.getElementById("queryIndex").value);
  const result = results[index - 1];
  document.getElementById("queryResultOutput").innerText =
    result ? `ตาที่ ${index} ออก ${result}` : "ไม่พบผลในตานี้";
}

function resetData() {
  if (confirm("แน่ใจว่าต้องการล้างข้อมูลทั้งหมด?")) {
    results = [];
    patternMemory = {};
    saveAll();
    render();
    document.getElementById("patternAnalysis").innerText = "";
    document.getElementById("queryResultOutput").innerText = "";
  }
}

function analyzePatterns() {
  const display = document.getElementById("patternAnalysis");
  if (results.length < 5) {
    display.innerText = "ต้องมีอย่างน้อย 5 ตาเพื่อวิเคราะห์แพทเทิร์น";
    return;
  }
  const lastFive = results.slice(-5).join(",");
  const match = patternMemory[lastFive];
  if (match) {
    const total = match.P + match.B + match.T;
    let recommended = Object.entries(match).sort((a, b) => b[1] - a[1])[0][0];
    display.innerText =
      `เคยเกิดแพทเทิร์นนี้ ${total} ครั้ง → P: ${match.P}, B: ${match.B}, T: ${match.T} → แนะนำ: ${recommended}`;
  } else {
    display.innerText = "ยังไม่เคยเจอแพทเทิร์นนี้มาก่อน";
  }
}

learnPatterns();
render();
