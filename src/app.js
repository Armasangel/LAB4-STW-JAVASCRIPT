//  DISCI-APP — app.js
//  Sistemas y Tecnologías Web — Lab 4

//ESTADO GLOBAL
let missions = [];
let globalXP = 0;

//RANGOS (tres categorías según XP)
const RANKS = [
  { minXP: 0,   name: "Novato",    icon: "🌱", maxXP: 100  },
  { minXP: 100, name: "Guerrero",  icon: "⚔️",  maxXP: 300  },
  { minXP: 300, name: "Archimago", icon: "🧙",  maxXP: Infinity },
];

//XP POR DIFICULTAD
const XP_MAP = {
  "Fácil":   10,
  "Normal":  25,
  "Difícil": 50,
};

//REFERENCIAS AL DOM
const btnCreate   = document.getElementById("btnCreate");
const missionList = document.getElementById("missionList");
const xpDisplay   = document.getElementById("xpDisplay");
const xpBarFill   = document.getElementById("xpBarFill");
const xpBarText   = document.getElementById("xpBarText");
const rankBadge   = document.getElementById("rankBadge");
const rankName    = document.getElementById("rankName");
const toastEl     = document.getElementById("toast");

//GENERAR ESTRELLAS DECORATIVAS
function generateStars() {
  const container = document.getElementById("stars");
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${Math.random() * 4 + 2}s;
      --delay: ${Math.random() * 5}s;
      --bright: ${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(star);
  }
}

//CREAR UNA MISIÓN
function createMission() {
  const name = document.getElementById("missionName").value.trim();
  const desc = document.getElementById("missionDesc").value.trim();
  const diff = document.getElementById("missionDiff").value;

  if (!name) {
    showToast("Debes ingresar un nombre para la misión.");
    return;
  }
  if (!desc) {
    showToast("Debes ingresar una descripción.");
    return;
  }

  const mission = {
    id:          Date.now(),
    name:        name,
    description: desc,
    difficulty:  diff,
    xp:          XP_MAP[diff],
    status:      "PENDING",
    createdAt:   new Date().toLocaleString("es-GT"),
  };

  missions.push(mission);

  // Console.log valida la estructura del objeto
  console.log("✦ Nueva misión creada:", mission);

  renderMissions();
  clearForm();
  showToast(`¡Misión "${mission.name}" registrada!`);
}

//COMPLETAR UNA MISIÓN
function completeMission(id) {
  const mission = missions.find(m => m.id === id);
  if (!mission || mission.status === "SUCCESFUL") return;

  mission.status = "SUCCESFUL";
  globalXP += mission.xp;

  console.log(`Misión completada: "${mission.name}" | +${mission.xp} XP | XP Total: ${globalXP}`);

  renderMissions();
  updateXPBar();
  showXPPopup(mission.xp);
  showToast(`¡Misión completada! +${mission.xp} XP`);
}

//RENDERIZAR MISIONES
function renderMissions() {
  if (missions.length === 0) {
    missionList.innerHTML = `<p class="empty-state">Aún no has registrado ninguna misión, ¡comienza tu aventura!</p>`;
    return;
  }

  missionList.innerHTML = missions.map(m => {
    const diffClass   = { "Fácil": "easy", "Normal": "normal", "Difícil": "hard" }[m.difficulty];
    const badgeClass  = { "Fácil": "badge-easy", "Normal": "badge-normal", "Difícil": "badge-hard" }[m.difficulty];
    const isCompleted = m.status === "SUCCESFUL";
    const statusClass = isCompleted ? "badge-status-successful" : "badge-status-pending";
    const statusLabel = isCompleted ? "✔ SUCCESFUL" : "PENDING";
    const cardExtra   = isCompleted ? "successful" : "";

    return `
      <div class="mission-card ${diffClass} ${cardExtra}">
        <div class="mission-body">
          <div class="mission-header">
            <span class="mission-name">${escapeHTML(m.name)}</span>
            <span class="badge ${badgeClass}">${m.difficulty}</span>
            <span class="badge badge-xp">+${m.xp} XP</span>
            <span class="badge ${statusClass}">${statusLabel}</span>
          </div>
          <p class="mission-desc">${escapeHTML(m.description)}</p>
        </div>
        <div class="mission-actions">
          <button
            class="btn-complete"
            onclick="completeMission(${m.id})"
            ${isCompleted ? "disabled" : ""}
          >
            ${isCompleted ? "Completada" : "Completar"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

//ACTUALIZAR BARRA DE XP Y RANGO
function updateXPBar() {
  xpDisplay.textContent = globalXP;

  // Animar el número
  xpDisplay.style.transform = "scale(1.3)";
  xpDisplay.style.color = "#f5d98a";
  setTimeout(() => {
    xpDisplay.style.transform = "scale(1)";
    xpDisplay.style.color = "";
  }, 300);

  // Determinar rango actual
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (globalXP >= rank.minXP) currentRank = rank;
  }

  // Barra de progreso hacia el siguiente rango
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1];
  if (nextRank) {
    const progress = ((globalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100;
    xpBarFill.style.width = Math.min(progress, 100) + "%";
    xpBarText.textContent = `${globalXP} / ${nextRank.minXP} XP`;
  } else {
    xpBarFill.style.width = "100%";
    xpBarText.textContent = `${globalXP} XP — Rango Máximo`;
  }

  // Actualizar badge de rango
  rankName.textContent = currentRank.name;
  rankBadge.querySelector(".rank-icon").textContent = currentRank.icon;
}

//POPUP FLOTANTE DE XP
function showXPPopup(xp) {
  const popup = document.createElement("div");
  popup.classList.add("xp-popup");
  popup.textContent = `+${xp} XP`;
  popup.style.bottom = "5rem";
  popup.style.right = "2rem";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1300);
}

//TOAST NOTIFICATION
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3000);
}

//LIMPIAR FORMULARIO
function clearForm() {
  document.getElementById("missionName").value = "";
  document.getElementById("missionDesc").value = "";
  document.getElementById("missionDiff").value = "Normal";
}

//UTILIDAD: escapar HTML para evitar XSS
function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//INICIALIZACIÓN
function init() {
  generateStars();
  updateXPBar();
  renderMissions();
  btnCreate.addEventListener("click", createMission);

  document.getElementById("missionName").addEventListener("keydown", (e) => {
    if (e.key === "Enter") createMission();
  });

  console.log("Disci-App iniciada. ¡Forja tu disciplina!");
}

init();