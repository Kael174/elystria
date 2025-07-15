const story = document.getElementById("story");
const commandInput = document.getElementById("command");

let player = {
  energy: 100,
  money: 50,
  hunger: 100, // 100 = tok, 0 = aç
  day: 1,
  inventory: {
    yemek: 0
  }
};

const loopIntervals = {
  uyu: null,
  dinlen: null,
  meditasyon: null
};

function clampStats() {
  player.energy = Math.min(Math.max(player.energy, 0), 100);
  player.hunger = Math.min(Math.max(player.hunger, 0), 100);

  if (player.hunger <= 0) {
    log("⚠️ Açlıktan bayılmak üzeresin!");
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
    log("Bilinmeyen komut. 'stat', 'çalış', 'yemek ye', 'uyu' gibi komutları dene.");
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
    log(`${actionName} döngüsü durduruldu.`);
  } else {
    loopIntervals[actionName] = setInterval(() => {
      if (responses[actionName]) responses[actionName]();
    }, 3000);
    btn.classList.add("active");
    log(`${actionName} döngüsü başlatıldı.`);
  }
}

const responses = {
  "çalış": () => {
    player.energy -= 20;
    player.money += 30;
    player.hunger -= 15;
    log("Çalıştın. 30₺ kazandın, karnın acıktı.");
  },
  "yemek ye": () => {
    if (player.inventory.yemek > 0) {
      player.inventory.yemek -= 1;
      player.hunger += 30;
      if (player.hunger > 100) player.hunger = 100;
      log("Yemek yedin. Karnın doydu.");
    } else {
      log("Yemek envanterinde yemek yok. Önce marketten yemek almalısın.");
    }
  },
  "iş ara": () => log("Bir kafede garson arıyor. Başvurmaya ne dersin?"),
  "metroya bin": () => {
    if (player.money >= 10) {
      player.money -= 10;
      player.energy -= 10;
      player.hunger -= 5;
      log("Metroyla şehrin diğer ucuna gittin. Biraz yoruldun.");
    } else {
      log("Kartında yeterli bakiye yok.");
    }
  },
  "uyu": () => {
    player.energy = 100;
    player.hunger -= 10;
    player.day++;
    log("Uyudun ve yeni bir güne başladın.");
  },
  "dinlen": () => {
    player.energy = Math.min(player.energy + 20, 100);
    log("Biraz oturup dinlendin.");
  },
  "meditasyon": () => {
    player.energy += 10;
    player.hunger -= 3;
    log("Zihnini dinlendirdin, enerjin hafif yükseldi.");
  },
  "döner al": () => {
    if (player.money >= 20) {
      player.money -= 20;
      player.inventory.yemek += 1;
      log("Döner aldın, envanterine 1 yemek eklendi.");
    } else {
      log("Döner alacak paran yok.");
    }
  },
  "enerji içeceği": () => {
    if (player.money >= 15) {
      player.money -= 15;
      player.energy = Math.min(player.energy + 25, 100);
      log("Enerji içeceği içtin. Doping etkisi!");
    } else {
      log("İçecek alacak paran yok.");
    }
  },
  "kitap al": () => {
    if (player.money >= 50) {
      player.money -= 50;
      log("Kitap aldın. Zihnin açıldı. (Gelecekte işe yarayabilir!)");
    } else {
      log("Kitap almak için yeterli paran yok.");
    }
  },
  "stat": updateStats
};

log("Sabah oldu. Gözlerini açtın.\nKomut gir veya butonlardan birine tıkla!");
updateStats();
