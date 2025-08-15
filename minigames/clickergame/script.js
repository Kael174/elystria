let count = 0;
let level = 0;
let prestige = 0;
let power = 1.0;
let isMobile = false;

function round(num, decimals = 1) {
  return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
}

function calculatePower() {
  power = 1 + level * 0.01 + prestige * 0.1;
}

function updateDisplay() {
  document.getElementById("count").textContent = count.toFixed(1);
  document.getElementById("level").textContent = level;
  document.getElementById("prestige").textContent = prestige;
  document.getElementById("power").textContent = power.toFixed(1);
}

function checkLevel() {
  const newLevel = Math.floor(count / 100);
  if (newLevel > level) {
    level = newLevel;
    calculatePower();
  }
}

function handleClick() {
  count = round(count + power);
  checkLevel();
  updateDisplay();
  saveGame();
}

function handleRebirth() {
  if (count >= 10000) {
    count = 0;
    level = 0;
    prestige++;
    calculatePower();
    updateDisplay();
    saveGame();
  } else {
    alert("You need at least 10,000 points to prestige!");
  }
}

function handleReset() {
  if (confirm("Are you sure you want to reset all progress?")) {
    count = 0;
    level = 0;
    prestige = 0;
    calculatePower();
    updateDisplay();
    saveGame();
  }
}

function saveGame() {
  localStorage.setItem("count", count);
  localStorage.setItem("level", level);
  localStorage.setItem("prestige", prestige);
}

function loadGame() {
  count = parseFloat(localStorage.getItem("count")) || 0;
  level = parseInt(localStorage.getItem("level")) || 0;
  prestige = parseInt(localStorage.getItem("prestige")) || 0;
  calculatePower();
  updateDisplay();
}

function askPlatform() {
  let answer = prompt("Are you playing on a mobile device? (yes/no)").toLowerCase();
  if (answer === "yes" || answer === "y") {
    isMobile = true;
    document.body.classList.add("mobile");
  } else {
    isMobile = false;
    document.body.classList.remove("mobile");
  }
}

function setupListeners() {
  document.getElementById("clickBtn").onclick = handleClick;
  document.getElementById("rebirthBtn").onclick = handleRebirth;
  document.getElementById("resetBtn").onclick = handleReset;
}

window.onload = function () {
  askPlatform();
  loadGame();
  setupListeners();
};
