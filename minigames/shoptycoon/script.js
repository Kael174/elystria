// --- Variables ---
let money = 0;
let prestige = 0;
let clickPower = 1.0;

const items = [
  { name: "Torn Hat", level: 0, baseCost: 50 },
  { name: "Wool Scarf", level: 0, baseCost: 150 },
  { name: "Wooden Spoon", level: 0, baseCost: 300 },
  { name: "Tin Toy", level: 0, baseCost: 600 },
  { name: "Pixel Shirt", level: 0, baseCost: 1200 },
  { name: "Retro Console", level: 0, baseCost: 2400 },
  { name: "LED Sneakers", level: 0, baseCost: 4800 },
  { name: "Virtual Pet", level: 0, baseCost: 9600 },
];

// --- Save & Load ---
function saveGame() {
  localStorage.setItem("money", money);
  localStorage.setItem("prestige", prestige);
  localStorage.setItem("clickPower", clickPower);

  items.forEach((item, index) => {
    localStorage.setItem(`item${index}Level`, item.level);
  });
}

function loadGame() {
  money = parseFloat(localStorage.getItem("money")) || 0;
  prestige = parseInt(localStorage.getItem("prestige")) || 0;
  clickPower = parseFloat(localStorage.getItem("clickPower")) || 1.0;

  items.forEach((item, index) => {
    const savedLevel = parseInt(localStorage.getItem(`item${index}Level`));
    if (!isNaN(savedLevel)) {
      item.level = savedLevel;
    }
  });
}

// --- Format Numbers ---
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toFixed(1);
}

// --- Display ---
function updateDisplay() {
  document.getElementById("money").textContent = formatNumber(money);
  document.getElementById("prestige").textContent = prestige;
  document.getElementById("clickPower").textContent = formatNumber(clickPower);

  items.forEach((item, index) => {
    document.getElementById(`item${index}Level`).textContent = item.level;
    document.getElementById(`item${index}Income`).textContent = formatNumber(item.level * item.baseCost * 0.05);
    document.getElementById(`item${index}Cost`).textContent = formatNumber(getCost(item));
  });

  // Prestige 1M$'a sabitlenmiş
  document.getElementById("prestigeBtn").disabled = money < 1000000;
}

// --- Core ---
function getCost(item) {
  return item.baseCost * Math.pow(1.15, item.level);
}

function earnPassiveIncome() {
  let total = 0;
  items.forEach(item => {
    total += item.level * item.baseCost * 0.05;
  });
  money += total;
  updateDisplay();
  saveGame();
}

function handleClick() {
  money += clickPower;
  updateDisplay();
  saveGame();
}

function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  setTimeout(() => (msg.textContent = ""), 2000);
}

function buyItem(index) {
  const item = items[index];
  const cost = getCost(item);

  if (index > 0 && items[index - 1].level < 10) {
    showMessage("Need 10 of the previous item to unlock!");
    return;
  }

  if (money >= cost) {
    money -= cost;
    item.level++;
    updateDisplay();
    saveGame();
  } else {
    showMessage("Not enough money!");
  }
}

function handlePrestige() {
  if (money >= 1000000) {
    if (confirm("Prestige reset? You'll gain +1 prestige and double click power.")) {
      money = 0;
      prestige++;
      clickPower *= 2;
      items.forEach(item => (item.level = 0));
      updateDisplay();
      saveGame();
    }
  }
}

function restartGame() {
  if (confirm("Are you sure you want to restart?")) {
    localStorage.clear();
    money = 0;
    prestige = 0;
    clickPower = 1.0;
    items.forEach(item => (item.level = 0));
    updateDisplay();
    saveGame();
  }
}

// --- Init ---
function setupListeners() {
  document.getElementById("clickBtn").onclick = handleClick;
  document.getElementById("prestigeBtn").onclick = handlePrestige;
  document.getElementById("restartBtn").onclick = restartGame;

  items.forEach((_, index) => {
    document.getElementById(`buyItem${index}`).onclick = () => buyItem(index);
  });
}

window.onload = function () {
  loadGame();
  updateDisplay();
  setupListeners();
  setInterval(earnPassiveIncome, 1000);
};
