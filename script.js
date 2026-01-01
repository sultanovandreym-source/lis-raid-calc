const explosivesSection = document.getElementById('explosive-section');
const objectTypeSection = document.getElementById('object-type-section');
const targetSection = document.getElementById('target-section');
const resultDiv = document.getElementById('result');

let selectedExplosive = '';
let selectedObjectType = '';

// Объекты и их стоимость в Бабовках и сере
const data = {
  bababka: {
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
      "Дверь": { bombs: 200, sulfur: 24000 },
      "Стена": { bombs: 667, sulfur: 80040 },
      "Фундамент": { bombs: 2667, sulfur: 320040 },
      "Складная лестница": { bombs: 275, sulfur: 33000 },
      "Решетка": "Невозможно"
    },
    titan: {
      "Дверь": { bombs: 800, sulfur: 96000 },
      "Стена": { bombs: 2667, sulfur: 320040 },
      "Фундамент": "Невозможно",
      "Складная лестница": { bombs: 1112, sulfur: 133440 },
      "Решетка": "Невозможно"
    },
    objects: {
      "Устройство отслеживания стрельбы": { bombs: 50, sulfur: 6000 },
      "Устройство с автоматической винтовкой": { bombs: 50, sulfur: 6000 },
      "Автоматическая установка для картечи": { bombs: 50, sulfur: 6000 },
      "Торговый бот": { bombs: 668, sulfur: 80160 },
      "Электрическая турель": { bombs: 50, sulfur: 6000 },
      "Ракетная пусковая установка": { bombs: 50, sulfur: 6000 }
    }
  }
  // Можно добавить другие виды взрывчатки
};

// Выбор взрывчатки
document.querySelectorAll('#explosives button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedExplosive = btn.dataset.explosive;
    explosivesSection.style.display = 'none';
    objectTypeSection.style.display = 'block';
  });
});

// Назад к выбору взрывчатки
document.getElementById('back-to-explosive').addEventListener('click', () => {
  objectTypeSection.style.display = 'none';
  explosivesSection.style.display = 'block';
  resultDiv.innerHTML = '';
});

// Выбор типа объекта
document.querySelectorAll('#object-types button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedObjectType = btn.dataset.type;
    objectTypeSection.style.display = 'none';
    targetSection.style.display = 'block';
    showTargets(selectedExplosive, selectedObjectType);
  });
});

// Назад к выбору типа объекта
document.getElementById('back-to-object-type').addEventListener('click', () => {
  targetSection.style.display = 'none';
  objectTypeSection.style.display = 'block';
  resultDiv.innerHTML = '';
});

// Показ объектов для выбранного типа
function showTargets(explosive, type) {
  const targetsDiv = document.getElementById('targets');
  targetsDiv.innerHTML = '';
  const items = data[explosive][type];
  for (let key in items) {
    const btn = document.createElement('button');
    btn.textContent = key;
    btn.addEventListener('click', () => {
      const info = items[key];
      if(typeof info === 'string'){
        resultDiv.innerHTML = info;
      } else {
        resultDiv.innerHTML = `${key}: ${info.bombs} Бабовок, ${info.sulfur} серы`;
      }
    });
    targetsDiv.appendChild(btn);
  }
}
