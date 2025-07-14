
let results = JSON.parse(localStorage.getItem("myResults")) || [];
let memory = JSON.parse(localStorage.getItem("myMemory")) || {};

function save() {
  localStorage.setItem("myResults", JSON.stringify(results));
  localStorage.setItem("myMemory", JSON.stringify(memory));
}

function submitResult() {
  const input = document.getElementById("resultInput").value.toUpperCase();
  if (!["P", "B", "T"].includes(input)) {
    alert("กรุณาใส่เฉพาะ P, B หรือ T");
    return;
  }
  results.push(input);
  learn();
  save();
  document.getElementById("resultInput").value = "";
  updateHistory();
  document.getElementById("suggestion").innerText = "";
}

function learn() {
  if (results.length < 6) return;
  const key = results.slice(-6, -1).join(",");
  const next = results[results.length - 1];
  if (!memory[key]) {
    memory[key] = { P: 0, B: 0, T: 0 };
  }
  memory[key][next]++;
}

function analyze() {
  if (results.length < 5) {
    document.getElementById("suggestion").innerText = "ต้องมีอย่างน้อย 5 ตาเพื่อวิเคราะห์";
    return;
  }
  const key = results.slice(-5).join(",");
  const data = memory[key];
  if (!data) {
    document.getElementById("suggestion").innerText = "ยังไม่มีข้อมูลพอสำหรับวิเคราะห์ตานี้";
    return;
  }
  const max = Object.entries(data).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("suggestion").innerText =
    `แนะนำให้ลง: ${max[0]} (จาก ${data.P}P ${data.B}B ${data.T}T)`;
}

function updateHistory() {
  document.getElementById("history").innerText = results.join(", ");
}

function toggleHistory() {
  const section = document.getElementById("historySection");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

updateHistory();
