let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n) {
  if(n === 2) loadObjects();
  showStep(n);
}

function prevStep(n) {
  showStep(n);
}

// ===== Выбор взрывчатки =====
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExplosives.includes(v) ? selectedExplosives = selectedExplosives.filter(x => x !== v) : selectedExplosives.push(v);
  }
});

// ===== Выбор материалов =====
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMaterials.includes(v) ? selectedMaterials = selectedMaterials.filter(x => x !== v) : selectedMaterials.push(v);
  }
});

// ===== Объекты по материалу =====
const objectsByMaterial = {
  wood: ['Деревянная дверь', 'Деревянная стена', 'Деревянный фундамент'],
  stone: ['Каменная дверь', 'Каменная стена', 'Каменный фундамент'],
  metal: ['Железная дверь', 'Железная стена', 'Железный фундамент', 'Складная лестница', 'Решетка'],
  steel: ['Стальная дверь', 'Стальная стена', 'Стальной фундамент', 'Складная лестница', 'Решетка'],
  titan: ['Титановая дверь', 'Титановая стена', 'Титановый фундамент', 'Складная лестница', 'Решетка'],
  objects: ['Устройство отслеживания стрельбы','Установка с автоматической винтовкой','Автоматическая установка для картечи','Торговый бот','Электромагнитная турель','Ракетная пусковая установка']
};

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(o => {
      const key = `${mat}_${o}`;
      if(objectsDiv.querySelector(`[data-obj='${key}']`)) return;

      const div = document.createElement('div');
      div.className = 'object-row obj';
      div.dataset.obj = key;
      div.innerHTML = `
        <img src="images/${key}.png" alt="${o}">
        <span>${o}</span>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>
      `;
      objectsDiv.appendChild(div);
      selectedObjects[key] = 0;
    });
  });
}

function changeObjectCount(obj, v) {
  selectedObjects[obj] = Math.max(0, (selectedObjects[obj] || 0) + v);
  document.getElementById(`count-${obj}`).innerText = selectedObjects[obj];
}

// ===== Данные взрывчатки (пример) =====
const data = {
  bobovka: { wood: { 'Деревянная дверь': {count:2,sulfur:240}, 'Деревянная стена': {count:4,sulfur:480}, 'Деревянный фундамент': {count:15,sulfur:1800} }, /* остальное */ },
  dynamite: { wood: { 'Деревянная дверь': {count:1,sulfur:500}, 'Деревянная стена': {count:2,sulfur:1000}, 'Деревянный фундамент': {count:8,sulfur:4000} }, /* остальное */ },
  c4: { /* заполнить */ },
  hexogen: { /* заполнить */ },
  rocket: { /* заполнить */ }
};

// ===== Расчёт =====
function calculate() {
  let result = '';
  let totalSulfur = 0;

  Object.keys(selectedObjects).forEach(key => {
    const qty = selectedObjects[key];
    if(qty === 0) return;
    const [mat,obj] = key.split('_');

    result += `Объект: ${obj} (${mat})\nКоличество: ${qty}\n`;

    selectedExplosives.forEach(exp => {
      let val = data[exp]?.[mat]?.[obj] || null;
      let c, s;
      if(!val) { c='Невозможно'; s='—'; }
      else { c = val.count * qty; s = val.sulfur * qty; totalSulfur += s; }
      result += `• ${exp}: ${c} (Сера: ${s})\n`;
    });

    result += '\n';
  });

  result += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = result;
  showStep(3);
}let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n) {
  if(n === 2) loadObjects();
  showStep(n);
}

function prevStep(n) {
  showStep(n);
}

// ===== Выбор взрывчатки =====
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExplosives.includes(v) ? selectedExplosives = selectedExplosives.filter(x => x !== v) : selectedExplosives.push(v);
  }
});

// ===== Выбор материалов =====
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMaterials.includes(v) ? selectedMaterials = selectedMaterials.filter(x => x !== v) : selectedMaterials.push(v);
  }
});

// ===== Объекты по материалу =====
const objectsByMaterial = {
  wood: ['Деревянная дверь', 'Деревянная стена', 'Деревянный фундамент'],
  stone: ['Каменная дверь', 'Каменная стена', 'Каменный фундамент'],
  metal: ['Железная дверь', 'Железная стена', 'Железный фундамент', 'Складная лестница', 'Решетка'],
  steel: ['Стальная дверь', 'Стальная стена', 'Стальной фундамент', 'Складная лестница', 'Решетка'],
  titan: ['Титановая дверь', 'Титановая стена', 'Титановый фундамент', 'Складная лестница', 'Решетка'],
  objects: ['Устройство отслеживания стрельбы','Установка с автоматической винтовкой','Автоматическая установка для картечи','Торговый бот','Электромагнитная турель','Ракетная пусковая установка']
};

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(o => {
      const key = `${mat}_${o}`;
      if(objectsDiv.querySelector(`[data-obj='${key}']`)) return;

      const div = document.createElement('div');
      div.className = 'object-row obj';
      div.dataset.obj = key;
      div.innerHTML = `
        <img src="images/${key}.png" alt="${o}">
        <span>${o}</span>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>
      `;
      objectsDiv.appendChild(div);
      selectedObjects[key] = 0;
    });
  });
}

function changeObjectCount(obj, v) {
  selectedObjects[obj] = Math.max(0, (selectedObjects[obj] || 0) + v);
  document.getElementById(`count-${obj}`).innerText = selectedObjects[obj];
}

// ===== Данные взрывчатки (пример) =====
const data = {
  bobovka: { wood: { 'Деревянная дверь': {count:2,sulfur:240}, 'Деревянная стена': {count:4,sulfur:480}, 'Деревянный фундамент': {count:15,sulfur:1800} }, /* остальное */ },
  dynamite: { wood: { 'Деревянная дверь': {count:1,sulfur:500}, 'Деревянная стена': {count:2,sulfur:1000}, 'Деревянный фундамент': {count:8,sulfur:4000} }, /* остальное */ },
  c4: { /* заполнить */ },
  hexogen: { /* заполнить */ },
  rocket: { /* заполнить */ }
};

// ===== Расчёт =====
function calculate() {
  let result = '';
  let totalSulfur = 0;

  Object.keys(selectedObjects).forEach(key => {
    const qty = selectedObjects[key];
    if(qty === 0) return;
    const [mat,obj] = key.split('_');

    result += `Объект: ${obj} (${mat})\nКоличество: ${qty}\n`;

    selectedExplosives.forEach(exp => {
      let val = data[exp]?.[mat]?.[obj] || null;
      let c, s;
      if(!val) { c='Невозможно'; s='—'; }
      else { c = val.count * qty; s = val.sulfur * qty; totalSulfur += s; }
      result += `• ${exp}: ${c} (Сера: ${s})\n`;
    });

    result += '\n';
  });

  result += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = result;
  showStep(3);
}}
