
let allResults = JSON.parse(localStorage.getItem("allResults")) || [];
let allSessions = JSON.parse(localStorage.getItem("allSessions")) || [];
let currentSession = [];

function saveAll() {
  localStorage.setItem("allResults", JSON.stringify(allResults));
  localStorage.setItem("allSessions", JSON.stringify(allSessions));
}

function submitResult() {
  let raw = document.getElementById("resultInput").value.toUpperCase();
  raw = raw.replace(/[^PBT]/g, ""); // กรองเฉพาะ P B T
  let added = false;
  for (let char of raw) {
    if (["P", "B", "T"].includes(char)) {
      allResults.push(char);
      currentSession.push(char);
      added = true;
    }
  }
  if (!added) {
    alert("กรุณาใส่เฉพาะ P, B หรือ T");
    return;
  }
  saveAll();
  document.getElementById("resultInput").value = "";
  updateSessionDisplay();
  document.getElementById("suggestion").innerText = "";
  document.getElementById("patternUsed").innerText = "";
}

function analyze() {
  if (currentSession.length < 5) {
    document.getElementById("suggestion").innerText = "ต้องมีอย่างน้อย 5 ตาเพื่อวิเคราะห์";
    return;
  }
  const pattern = currentSession.slice(-5).join(",");
  document.getElementById("patternUsed").innerText = "แพทเทิร์นที่ใช้วิเคราะห์: " + pattern;
  let memory = {};
  for (let i = 0; i < allResults.length - 5; i++) {
    const pat = allResults.slice(i, i + 5).join(",");
    const next = allResults[i + 5];
    if (pat === pattern) {
      if (!memory[next]) memory[next] = 0;
      memory[next]++;
    }
  }
  if (Object.keys(memory).length === 0) {
    document.getElementById("suggestion").innerText = "ยังไม่มีข้อมูลพอสำหรับวิเคราะห์ตานี้";
    return;
  }
  const max = Object.entries(memory).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("suggestion").innerText =
    `แนะนำให้ลง: ${max[0]} (จาก ${memory.P || 0}P ${memory.B || 0}B ${memory.T || 0}T)`;
}

function startNewSession() {
  if (currentSession.length > 0) {
    allSessions.push([...currentSession]);
    currentSession = [];
    saveAll();
    updateSessionDisplay();
    document.getElementById("suggestion").innerText = "";
    document.getElementById("patternUsed").innerText = "";
  }
}

function updateSessionDisplay() {
  const container = document.getElementById("sessions");
  container.innerHTML = "";
  allSessions.forEach((session, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>รอบที่ ${index + 1}:</strong> ${session.join(", ")}`;
    container.appendChild(div);
  });
  const current = document.createElement("div");
  current.innerHTML = `<strong>รอบปัจจุบัน:</strong> ${currentSession.join(", ")}`;
  container.appendChild(current);
}

function toggleHistory() {
  const section = document.getElementById("historySection");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

updateSessionDisplay();
