const explosivesSection = document.getElementById('explosive-section');
const objectTypeSection = document.getElementById('object-type-section');
const targetSection = document.getElementById('target-section');
const resultDiv = document.getElementById('result');

let selectedExplosive = '';
let selectedObjectType = '';
let selectedItems = [];

const data = {
  bobovka: {
    wood: {
      "Деревянная дверь": { bombs: 2, sulfur: 240 },
      "Деревянная стена": { bombs: 4, sulfur: 480 },
      "Деревянный фундамент": { bombs: 15, sulfur: 1800 }
    },
    stone: {
      "Каменная дверь": { bombs: 3, sulfur: 360 },
      "Каменная стена": { bombs: 10, sulfur: 1200 },
      "Каменный фундамент": { bombs: 40, sulfur: 4800 }
    },
    metal: {
      "Металлическая дверь": { bombs: 30, sulfur: 3600 },
      "Металлическая стена": { bombs: 100, sulfur: 12000 },
      "Металлический фундамент": { bombs: 400, sulfur: 48000 },
      "Железная складная лестница": { bombs: 46, sulfur: 5520 },
      "Металлическая решетка": "Невозможно"
    },
    iron_cast: {
      "МВК дверь": { bombs: 200, sulfur: 24000 },
      "МВК стена": { bombs: 667, sulfur: 80040 },
      "МВК фундамент": { bombs: 2667, sulfur: 320040 },
      "Стальная решетка": "Невозможно"
    },
    titan: {
      "Титановая дверь": { bombs: 800, sulfur: 96000 },
      "Титановая стена": { bombs: 2667, sulfur: 320040 },
      "Титановый фундамент": "Невозможно"
    },
    objects: {
      "Электромагнитная турель": { bombs: 50, sulfur: 6000 },
      "Торговый бот": { bombs: 668, sulfur: 80160 }
    }
  },

  dinamit: {
    wood: {
      "Деревянная дверь": { bombs: 1, sulfur: 500 },
      "Деревянная стена": { bombs: 2, sulfur: 1000 },
      "Деревянный фундамент": { bombs: 8, sulfur: 4000 }
    },
    stone: {
      "Каменная дверь": { bombs: 2, sulfur: 1000 },
      "Каменная стена": { bombs: 5, sulfur: 2500 },
      "Каменный фундамент": { bombs: 20, sulfur: 10000 }
    },
    metal: {
      "Железная дверь": { bombs: 4, sulfur: 2000 },
      "Железная стена": { bombs: 13, sulfur: 6500 },
      "Железный фундамент": { bombs: 50, sulfur: 25000 },
      "Железная складная лестница": { bombs: 7, sulfur: 3500 },
      "Железная решетка": "Невозможно"
    },
    iron_cast: {
      "МВК дверь": { bombs: 20, sulfur: 10000 },
      "МВК стена": { bombs: 67, sulfur: 33500 },
      "МВК фундамент": { bombs: 267, sulfur: 133500 },
      "Стальная решетка": "Невозможно"
    },
    titan: {
      "Титановая дверь": { bombs: 80, sulfur: 40000 },
      "Титановая стена": { bombs: 200, sulfur: 100000 },
      "Титановый фундамент": { bombs: 800, sulfur: 800000 },
      "Титановая решетка": "Невозможно"
    },
    objects: {
      "Установка с автоматической винтовкой": { bombs: 7, sulfur: 3500 },
      "Автоматическая установка для картечи": { bombs: 7, sulfur: 3500 },
      "Торговый бот": { bombs: 68, sulfur: 34000 },
      "Электромагнитная турель": { bombs: 7, sulfur: 3500 }
    }
  }
};

// ---------- ВЫБОР ВЗРЫВЧАТКИ ----------
document.querySelectorAll('#explosives button').forEach(btn => {
  btn.onclick = () => {
    selectedExplosive = btn.dataset.explosive;
    explosivesSection.style.display = 'none';
    objectTypeSection.style.display = 'block';
    selectedItems = [];
    resultDiv.innerHTML = '';
  };
});

// ---------- ВЫБОР ТИПА ----------
document.querySelectorAll('#object-types button').forEach(btn => {
  btn.onclick = () => {
    selectedObjectType = btn.dataset.type;
    objectTypeSection.style.display = 'none';
    targetSection.style.display = 'block';
    showTargets();
  };
});

// ---------- СПИСОК ОБЪЕКТОВ ----------
function showTargets() {
  const targetsDiv = document.getElementById('targets');
  targetsDiv.innerHTML = '';
  const items = data[selectedExplosive][selectedObjectType];

  for (let name in items) {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => addItem(name, items[name]);
    targetsDiv.appendChild(btn);
  }
}

// ---------- ДОБАВЛЕНИЕ В РАСЧЁТ ----------
function addItem(name, info) {
  if (info === "Невозможно") {
    alert("❌ Невозможно разрушить этим типом взрывчатки");
    return;
  }

  const existing = selectedItems.find(i => i.name === name);
  if (existing) {
    existing.count++;
  } else {
    selectedItems.push({
      name,
      bombs: info.bombs,
      sulfur: info.sulfur,
      count: 1
    });
  }

  renderResult();
}

// ---------- ОТРИСОВКА ----------
function renderResult() {
  let totalBombs = 0;
  let totalSulfur = 0;

  resultDiv.innerHTML = `<h3>Расчёт рейда</h3>`;

  selectedItems.forEach((item, index) => {
    const bombs = item.bombs * item.count;
    const sulfur = item.sulfur * item.count;

    totalBombs += bombs;
    totalSulfur += sulfur;

    resultDiv.innerHTML += `
      <div class="raid-item">
        <b>${item.name}</b><br>
        💣 ${bombs} | 🧪 ${sulfur}<br>
        <button onclick="changeCount(${index}, -1)">−</button>
        ${item.count}
        <button onclick="changeCount(${index}, 1)">+</button>
      </div>
      <hr>
    `;
  });

  resultDiv.innerHTML += `
    <h3>ИТОГО</h3>
    💣 Всего взрывчатки: <b>${totalBombs}</b><br>
    🧪 Всего серы: <b>${totalSulfur}</b><br><br>
    <button onclick="clearAll()">Очистить расчёт</button>
  `;
}

// ---------- ИЗМЕНЕНИЕ КОЛИЧЕСТВА ----------
function changeCount(index, delta) {
  selectedItems[index].count += delta;
  if (selectedItems[index].count <= 0) {
    selectedItems.splice(index, 1);
  }
  renderResult();
}

function clearAll() {
  selectedItems = [];
  resultDiv.innerHTML = '';
}
