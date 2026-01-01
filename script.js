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
  if (n === 2) loadObjects();
  showStep(n);
}
function prevStep(n) {
  showStep(n);
}

/* ===== ВЫБОР ВЗРЫВЧАТКИ ===== */
document.querySelectorAll('.exp').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives = selectedExplosives.filter(x => x !== v)
      : selectedExplosives.push(v);
  };
});

/* ===== ВЫБОР МАТЕРИАЛОВ ===== */
document.querySelectorAll('.mat').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials = selectedMaterials.filter(x => x !== v)
      : selectedMaterials.push(v);
  };
});

/* ===== ОБЪЕКТЫ ===== */
const objectsByMaterial = {
  wood: ['Дверь','Стена','Фундамент'],
  stone: ['Дверь','Стена','Фундамент'],
  metal: ['Дверь','Стена','Фундамент','Складная лестница'],
  steel: ['Дверь','Стена','Фундамент','Складная лестница'],
  titan: ['Дверь','Стена','Фундамент','Складная лестница'],
  objects: ['Электромагнитная турель','Торговый бот']
};

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(obj => {
      const key = `${mat}_${obj}`;
      selectedObjects[key] = 0;

      const row = document.createElement('div');
      row.className = 'object-row';
      row.innerHTML = `
        <span>${mat} ${obj}</span>
        <div class="counter">
          <button onclick="changeCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeCount('${key}',1)">+</button>
        </div>
      `;
      objectsDiv.appendChild(row);
    });
  });
}

function changeCount(key, v) {
  selectedObjects[key] = Math.max(0, selectedObjects[key] + v);
  document.getElementById(`count-${key}`).innerText = selectedObjects[key];
}

/* ===== РАСЧЕТ (ЗАГЛУШКА) ===== */
function calculate() {
  let text = '';
  Object.keys(selectedObjects).forEach(k => {
    if (selectedObjects[k] > 0) {
      text += `${k}: ${selectedObjects[k]}\n`;
    }
  });
  document.getElementById('result').innerText = text || 'Ничего не выбрано';
  showStep(3);
}
