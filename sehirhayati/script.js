const story = document.getElementById("story");
const commandInput = document.getElementById("command");

let player = {
  energy: 100,
  money: 50,
  hunger: 100, // 100 = tok, 0 = aç
  day: 1,
  inventory: {
    food: 0
  }
};

const loopIntervals = {
  sleep: null,
  relax: null,
  meditation: null
};

function clampStats() {
  player.energy = Math.min(Math.max(player.energy, 0), 100);
  player.hunger = Math.min(Math.max(player.hunger, 0), 100);

  if (player.hunger <= 0) {
    log("⚠️ You're about to faint from hunger!");
  }
}

function updateStats() {
  document.getElementById("day").innerText = player.day;
  document.getElementById("money").innerText = player.money;
  document.getElementById("inventory-yemek").innerText = player.inventory.yemek;

  const energyPercent = Math.max(0, Math.min(100, player.energy));
  const energyBar = document.getElementById("energy-bar");
  energyBar.style.width = energyPercent + "%";

  const hungerPercent = Math.max(0, Math.min(100, player.hunger));
  const hungerBar = document.getElementById("hunger-bar");
  hungerBar.style.width = hungerPercent + "%";
}

function log(text) {
  story.innerText += `\n> ${text}`;
  story.scrollTop = story.scrollHeight;
  clampStats();
  updateStats();
}

function runCommand(input) {
  input = input.toLowerCase().trim();
  if (responses[input]) {
    responses[input]();
  } else {
    log("Unknown command. Try 'stat', 'work', 'eat', 'sleep'.");
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
    log(`${actionName} cycle stopped.`);
  } else {
    loopIntervals[actionName] = setInterval(() => {
      if (responses[actionName]) responses[actionName]();
    }, 3000);
    btn.classList.add("active");
    log(`${actionName} cycle started.`);
  }
}

const responses = {
  "work": () => {
    player.energy -= 20;
    player.money += 30;
    player.hunger -= 15;
    log("You worked. You earned 30₺ and you're hungry.");
  },
  "eat": () => {
    if (player.inventory.yemek > 0) {
      player.inventory.yemek -= 1;
      player.hunger += 30;
      if (player.hunger > 100) player.hunger = 100;
      log("You ate. Your stomach is full.");
    } else {
      log("There is no food in your food inventory. You must buy food from the market first.");
    }
  },
  "iş ara": () => log("A cafe is looking for a waiter. How about applying?"),
  "metroya bin": () => {
    if (player.money >= 10) {
      player.money -= 10;
      player.energy -= 10;
      player.hunger -= 5;
      log("You took the subway to the other end of the city. You're a little tired.");
    } else {
      log("There is insufficient balance on your card.");
    }
  },
  "uyu": () => {
    player.energy = 100;
    player.hunger -= 10;
    player.day++;
    log("You slept and started a new day.");
  },
  "dinlen": () => {
    player.energy = Math.min(player.energy + 20, 100);
    log("You sat down and rested for a while.");
  },
  "meditasyon": () => {
    player.energy += 10;
    player.hunger -= 3;
    log("You rested your mind, your energy increased slightly.");
  },
  "döner al": () => {
    if (player.money >= 20) {
      player.money -= 20;
      player.inventory.yemek += 1;
      log("You bought döner, 1 food was added to your inventory.");
    } else {
      log("You don't have money to buy doner.");
    }
  },
  "enerji içeceği": () => {
    if (player.money >= 15) {
      player.money -= 15;
      player.energy = Math.min(player.energy + 25, 100);
      log("You drank an energy drink. Doping effect!");
    } else {
      log("You don't have money to buy drinks.");
    }
  },
  "kitap al": () => {
    if (player.money >= 50) {
      player.money -= 50;
      log("You bought a book. Your mind has been opened. (This may come in handy in the future!)");
    } else {
      log("You don't have enough money to buy books.");
    }
  },
  "stat": updateStats
};

log("It's morning. You opened your eyes.\nEnter a command or click one of the buttons!");
updateStats();
