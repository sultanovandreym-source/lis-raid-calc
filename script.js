const explosivesSection = document.getElementById('explosive-section');
const objectTypeSection = document.getElementById('object-type-section');
const targetSection = document.getElementById('target-section');
const resultDiv = document.getElementById('result');

let selectedExplosive = '';
let selectedObjectType = '';

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
      "Стальная складная лестница": { bombs: 275, sulfur: 33000 },
      "Стальная решетка": "Невозможно"
    },
    titan: {
      "Титановая дверь": { bombs: 800, sulfur: 96000 },
      "Титановая стена": { bombs: 2667, sulfur: 320040 },
      "Титановый фундамент": "Невозможно",
      "Титановая складная лестница": { bombs: 1112, sulfur: 133440 },
      "Титановая решетка": "Невозможно"
    },
    objects: {
      "Устройство отслеживания стрельбы": { bombs: 50, sulfur: 6000 },
      "Установка с автоматической винтовкой": { bombs: 50, sulfur: 6000 },
      "Автоматическая установка для картечи": { bombs: 50, sulfur: 6000 },
      "Торговый бот": { bombs: 668, sulfur: 80160 },
      "Электромагнитная турель": { bombs: 50, sulfur: 6000 },
      "Ракетная пусковая установка": { bombs: 50, sulfur: 6000 }
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
      "Стальная складная лестница": { bombs: 28, sulfur: 14000 },
      "Стальная решетка": "Невозможно"
    },
    titan: {
      "Титановая дверь": { bombs: 80, sulfur: 40000 },
      "Титановая стена": { bombs: 200, sulfur: 100000 },
      "Титановый фундамент": { bombs: 800, sulfur: 800000 },
      "Титановая складная лестница": { bombs: 112, sulfur: 56000 },
      "Титановая решетка": "Невозможно"
    },
    objects: {
      "Устройство отслеживания стрельбы": "Невозможно",
      "Установка с автоматической винтовкой": { bombs: 7, sulfur: 3500 },
      "Автоматическая установка для картечи": { bombs: 7, sulfur: 3500 },
      "Торговый бот": { bombs: 68, sulfur: 34000 },
      "Электромагнитная турель": { bombs: 7, sulfur: 3500 },
      "Ракетная пусковая установка": { bombs: 7, sulfur: 3500 }
    }
  }
};

// ---------- ЛОГИКА ----------

document.querySelectorAll('#explosives button').forEach(btn => {
  btn.onclick = () => {
    selectedExplosive = btn.dataset.explosive;
    explosivesSection.style.display = 'none';
    objectTypeSection.style.display = 'block';
  };
});

document.getElementById('back-to-explosive').onclick = () => {
  objectTypeSection.style.display = 'none';
  explosivesSection.style.display = 'block';
  resultDiv.innerHTML = '';
};

document.querySelectorAll('#object-types button').forEach(btn => {
  btn.onclick = () => {
    selectedObjectType = btn.dataset.type;
    objectTypeSection.style.display = 'none';
    targetSection.style.display = 'block';
    showTargets();
  };
});

document.getElementById('back-to-object-type').onclick = () => {
  targetSection.style.display = 'none';
  objectTypeSection.style.display = 'block';
  resultDiv.innerHTML = '';
};

function showTargets() {
  const targetsDiv = document.getElementById('targets');
  targetsDiv.innerHTML = '';
  const items = data[selectedExplosive][selectedObjectType];

  for (let name in items) {
    const btn = document.createElement('button');
    btn.textContent = name;

    btn.onclick = () => {
      const info = items[name];
      if (info === "Невозможно") {
        resultDiv.innerHTML = "❌ Невозможно разрушить выбранный объект данной взрывчаткой.";
        return;
      }

      let count = 1;
      update(info, count);

      targetsDiv.innerHTML = `
        <h3>${name}</h3>
        <div class="counter">
          <button id="minus">−</button>
          <span id="count">1</span>
          <button id="plus">+</button>
        </div>
      `;

      document.getElementById('minus').onclick = () => {
        if (count > 1) count--;
        document.getElementById('count').textContent = count;
        update(info, count);
      };

      document.getElementById('plus').onclick = () => {
        count++;
        document.getElementById('count').textContent = count;
        update(info, count);
      };
    };

    targetsDiv.appendChild(btn);
  }
}

function update(info, count) {
  resultDiv.innerHTML = `
    💣 Взрывчатка: <b>${info.bombs * count}</b><br>
    🧪 Сера: <b>${info.sulfur * count}</b><br>
    📦 Количество объектов: <b>${count}</b>
  `;
}
