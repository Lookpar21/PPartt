let results = JSON.parse(localStorage.getItem("results")) || [];

function saveResults() {
  localStorage.setItem("results", JSON.stringify(results));
}

function addResults() {
  const input = document.getElementById("resultInput").value.toUpperCase().replace(/\s+/g, '');
  const newResults = input.includes(",") ? input.split(",") : input.split("");
  newResults.forEach(res => {
    if (["P", "B", "T"].includes(res)) {
      results.push(res);
    }
  });
  saveResults();
  render();
  document.getElementById("resultInput").value = "";
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
    saveResults();
    render();
  }
}

function analyzePatterns() {
  const display = document.getElementById("patternAnalysis");
  const patternStats = {};
  for (let i = 0; i < results.length - 5; i++) {
    const pattern = results.slice(i, i + 5).join(",");
    const next = results[i + 5];
    if (!patternStats[pattern]) {
      patternStats[pattern] = { P: 0, B: 0, T: 0 };
    }
    patternStats[pattern][next]++;
  }

  const lastFive = results.slice(-5).join(",");
  const match = patternStats[lastFive];
  if (match) {
    display.innerText =
      `เคยเกิดแพทเทิร์นนี้ ${match.P + match.B + match.T} ครั้ง → P: ${match.P}, B: ${match.B}, T: ${match.T}`;
  } else {
    display.innerText = "ยังไม่เคยเจอแพทเทิร์นนี้มาก่อน";
  }
}

render();
