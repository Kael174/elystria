const story = document.getElementById("story");
const commandInput = document.getElementById("command");

let player = {
  energy: 100,
  money: 50,
  hunger: 100,
  day: 1,
  inventory: {
    yemek: 0
  }
};

const loopIntervals = {
  sleep: null,
  rest: null,
  meditate: null
};

// 💾 Kaydetme fonksiyonu
function saveGame() {
  localStorage.setItem("cityLifeSave", JSON.stringify(player));
}

// 💾 Yükleme fonksiyonu
function loadGame() {
  const savedData = localStorage.getItem("cityLifeSave");
  if (savedData) {
    player = JSON.parse(savedData);
    log("💾 Save loaded from local storage.");
    updateStats();
  } else {
    log("No save found. Starting new game.");
  }
}

function clampStats() {
  player.energy = Math.min(Math.max(player.energy, 0), 100);
  player.hunger = Math.min(Math.max(player.hunger, 0), 100);

  if (player.hunger <= 0) {
    log("⚠️ You're starving!");
  }
}

function updateStats() {
  document.getElementById("day").innerText = player.day;
  document.getElementById("money").innerText = player.money;
  document.getElementById("inventory-yemek").innerText = player.inventory.yemek;

  document.getElementById("energy-bar").style.width = player.energy + "%";
  document.getElementById("hunger-bar").style.width = player.hunger + "%";
}

function log(text) {
  story.innerText += `\n> ${text}`;
  story.scrollTop = story.scrollHeight;
  clampStats();
  updateStats();
  saveGame(); // 🔹 otomatik kayıt
}

function runCommand(input) {
  input = input.toLowerCase().trim();
  if (responses[input]) {
    responses[input]();
  } else {
    log("Unknown command. Try 'work', 'eat', 'sleep', etc.");
  }
}

commandInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const input = commandInput.value;
    commandInput.value = "";
    runCommand(input);
  }
});

function toggleLoop(actionName) {
  const btn = document.querySelector(`button[onclick="toggleLoop('${actionName}')"]`);
  
  if (loopIntervals[actionName]) {
    clearInterval(loopIntervals[actionName]);
    loopIntervals[actionName] = null;
    btn.classList.remove("active");
    log(`${actionName} loop stopped.`);
  } else {
    loopIntervals[actionName] = setInterval(() => {
      if (responses[actionName]) {
        responses[actionName]();

        if (player.energy >= 100) {
          clearInterval(loopIntervals[actionName]);
          loopIntervals[actionName] = null;
          btn.classList.remove("active");
          log(`${actionName} loop automatically stopped (energy full).`);
        }
      }
    }, 3000);

    btn.classList.add("active");
    log(`${actionName} loop started.`);
  }
}

const responses = {
  "work": () => {
    player.energy -= 20;
    player.money += 30;
    player.hunger -= 15;
    log("You worked and earned 30₺. It made you hungry.");
  },
  "eat": () => {
    if (player.inventory.yemek > 0) {
      player.inventory.yemek--;
      player.hunger += 30;
      if (player.hunger > 100) player.hunger = 100;
      log("You ate a meal. Feeling full!");
    } else {
      log("No food in inventory. Buy food first.");
    }
  },
  "find job": () => log("A café is hiring. Want to apply?"),
  "ride metro": () => {
    if (player.money >= 10) {
      player.money -= 10;
      player.energy -= 10;
      player.hunger -= 5;
      log("You rode the metro across town. It was tiring.");
    } else {
      log("Not enough money for metro.");
    }
  },
  "sleep": () => {
    player.energy = 100;
    player.hunger -= 10;
    player.day++;
    log("You slept and woke up to a new day.");
  },
  "rest": () => {
    player.energy = Math.min(player.energy + 20, 100);
    log("You rested for a bit.");
  },
  "meditate": () => {
    player.energy += 10;
    player.hunger -= 3;
    log("You meditated and cleared your mind.");
  },
  "buy food": () => {
    if (player.money >= 20) {
      player.money -= 20;
      player.inventory.yemek++;
      log("You bought food. 1 meal added to inventory.");
    } else {
      log("Not enough money to buy food.");
    }
  },
  "energy drink": () => {
    if (player.money >= 15) {
      player.money -= 15;
      player.energy = Math.min(player.energy + 25, 100);
      log("You drank an energy drink. Refreshed!");
    } else {
      log("Not enough money for drink.");
    }
  },
  "buy book": () => {
    if (player.money >= 50) {
      player.money -= 50;
      log("You bought a book. Wisdom unlocked! 📘");
    } else {
      log("You need 50₺ to buy a book.");
    }
  },
  "reset game": () => {
    player = {
      energy: 100,
      money: 50,
      hunger: 100,
      day: 1,
      inventory: {
        yemek: 0
      }
    };
    updateStats();
    log("Game has been reset!");
    saveGame(); // reset sonrası kaydet
  },
  "stats": updateStats
};

// 💾 Oyun başlatılırken save yükle
loadGame();
