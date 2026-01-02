// ===== СОСТОЯНИЕ =====
let currentStep = 0;
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');

// ===== ДАННЫЕ =====
const explosives = [
  { id: 'bobovka', name: 'Бобовка' },
  { id: 'dynamite', name: 'Динамит' },
  { id: 'c4', name: 'C4' },
  { id: 'hexogen', name: 'Гексоген' },
  { id: 'rocket', name: 'Ракета' }
];

const materials = [
  { id: 'wood', name: 'Дерево' },
  { id: 'stone', name: 'Камень' },
  { id: 'metal', name: 'Железо' },
  { id: 'steel', name: 'Сталь' },
  { id: 'titan', name: 'Титан' },
  { id: 'objects', name: 'Прочее' }
];

const objectsByMaterial = {
  wood: ['Деревянная дверь','Деревянная стена','Деревянный фундамент'],
  stone: ['Каменная дверь','Каменная стена','Каменный фундамент'],
  metal: ['Железная дверь','Железная стена','Железный фундамент','Железная складная лестница','Железная решетка'],
  steel: ['Стальная дверь','Стальная стена','Стальной фундамент','Стальная складная лестница','Стальная решетка'],
  titan: ['Титановая дверь','Титановая стена','Титановый фундамент','Титановая складная лестница','Титановая решетка'],
  objects: [
    'Устройство отслеживания стрельбы',
    'Установка с автоматической винтовкой',
    'Автоматическая установка для картечи',
    'Торговый бот',
    'Электромагнитная турель',
    'Ракетная пусковая установка'
  ]
};

// ===== ЦИФРЫ (Бобовка пример, остальные уже подготовлены логикой) =====
const data = {
  bobovka: {
    'Деревянная дверь': [2,240],
    'Деревянная стена': [4,480],
    'Деревянный фундамент': [15,1800],
    'Каменная дверь': [3,360],
    'Каменная стена': [10,1200],
    'Каменный фундамент': [40,4800],
    'Железная дверь': [30,3600],
    'Железная стена': [100,12000],
    'Железный фундамент': [400,48000],
    'Железная складная лестница': [46,5520],
    'Железная решетка': null
  }
};

// ===== ОТРИСОВКА 1 ВКЛАДКИ =====
const expDiv = document.getElementById('explosives');
explosives.forEach(e => {
  const d = document.createElement('div');
  d.className = 'cell';
  d.innerText = e.name;
  d.onclick = () => toggleSelect(d, selectedExplosives, e.id);
  expDiv.appendChild(d);
});

// ===== ОТРИСОВКА 2 ВКЛАДКИ =====
const matDiv = document.getElementById('materials');
materials.forEach(m => {
  const d = document.createElement('div');
  d.className = 'cell';
  d.innerText = m.name;
  d.onclick = () => toggleSelect(d, selectedMaterials, m.id);
  matDiv.appendChild(d);
});

// ===== ШАГИ =====
function nextStep(i) {
  if (i === 1 && selectedExplosives.length === 0) return alert('Выберите взрывчатку');
  if (i === 2 && selectedMaterials.length === 0) return alert('Выберите материал');
  showStep(i);
  if (i === 2) loadObjects();
}

function prevStep(i) {
  showStep(i);
}

function showStep(i) {
  steps.forEach(s => s.classList.remove('active'));
  steps[i].classList.add('active');
  currentStep = i;
}

// ===== ВЫБОР =====
function toggleSelect(el, arr, val) {
  if (arr.includes(val)) {
    arr.splice(arr.indexOf(val),1);
    el.classList.remove('active');
  } else {
    arr.push(val);
    el.classList.add('active');
  }
}

// ===== ОБЪЕКТЫ =====
function loadObjects() {
  const oDiv = document.getElementById('objects');
  oDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(obj => {
      selectedObjects[obj] = 0;
      const d = document.createElement('div');
      d.className = 'cell compact';
      d.innerHTML = `
        <div>${obj}</div>
        <div class="counter">
          <button onclick="changeObj('${obj}',-1)">-</button>
          <input id="i_${obj}" value="0">
          <button onclick="changeObj('${obj}',1)">+</button>
        </div>`;
      oDiv.appendChild(d);
    });
  });
}

function changeObj(obj, v) {
  selectedObjects[obj] = Math.max(0, selectedObjects[obj] + v);
  document.getElementById('i_'+obj).value = selectedObjects[obj];
}

// ===== РАСЧЕТ =====
function calculate() {
  let res = '';
  let sulfur = 0;

  Object.entries(selectedObjects).forEach(([obj,count]) => {
    if (!count) return;
    res += obj + ' x' + count + '\n';

    selectedExplosives.forEach(exp => {
      const d = data[exp]?.[obj];
      if (!d) {
        res += 'Невозможно разрушить выбранный объект данной взрывчаткой\n';
      } else {
        res += `${d[0]*count} шт, ${d[1]*count} серы\n`;
        sulfur += d[1]*count;
      }
    });
    res += '\n';
  });

  res += 'Всего серы: ' + sulfur;
  document.getElementById('result').innerText = res;
  showStep(3);
}
