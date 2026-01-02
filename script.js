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
  if (n === 1 && selectedExplosives.length === 0) {
    alert("Выберите взрывчатку");
    return;
  }
  if (n === 2 && selectedMaterials.length === 0) {
    alert("Выберите материалы");
    return;
  }
  if (n === 2) loadObjects();
  showStep(n);
}

function prevStep(n) {
  showStep(n);
}

// Выбор взрывчатки
document.querySelectorAll('.exp').forEach(el => {
  el.onclick = () => toggle(el, selectedExplosives, el.dataset.exp);
});

// Выбор материалов
document.querySelectorAll('.mat').forEach(el => {
  el.onclick = () => toggle(el, selectedMaterials, el.dataset.mat);
});

function toggle(el, arr, val) {
  el.classList.toggle('active');
  arr.includes(val) ? arr.splice(arr.indexOf(val), 1) : arr.push(val);
}

const objectNames = {
  door: 'Дверь',
  wall: 'Стена',
  foundation: 'Фундамент',
  ladder: 'Складная лестница',
  grate: 'Решётка',
  tracker: 'Устройство отслеживания стрельбы',
  auto_rifle: 'Установка с автоматической винтовкой',
  auto_shotgun: 'Автоматическая установка для картечи',
  trader_bot: 'Торговый бот',
  em_turret: 'Электромагнитная турель',
  rocket_launcher: 'Ракетная пусковая установка'
};

const objectsByMaterial = {
  wood: ['door','wall','foundation'],
  stone: ['door','wall','foundation'],
  metal: ['door','wall','foundation','ladder','grate'],
  steel: ['door','wall','foundation','ladder','grate'],
  titan: ['door','wall','foundation','ladder','grate'],
  objects: ['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(obj => {
      const key = `${mat}_${obj}`;
      const img = mat === 'objects'
        ? `images/${obj}.png`
        : `images/${mat}_${obj}.png`;

      const d = document.createElement('div');
      d.className = 'card';
      d.innerHTML = `
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <input type="number" min="0" value="0" id="c_${key}" onchange="manual('${key}',this.value)">
          <button onclick="change('${key}',1)">+</button>
        </div>
      `;
      objectsDiv.appendChild(d);
      selectedObjects[key] = 0;
    });
  });
}

function change(k, v) {
  selectedObjects[k] = Math.max(0, selectedObjects[k] + v);
  document.getElementById('c_' + k).value = selectedObjects[k];
}

function manual(k, v) {
  selectedObjects[k] = Math.max(0, parseInt(v) || 0);
}

function calculate() {
  let out = '';
  let total = 0;
  let any = false;

  Object.entries(selectedObjects).forEach(([key, qty]) => {
    if (!qty) return;
    any = true;

    const [mat, obj] = key.split('_');
    out += `${objectNames[obj]} (${mat}) x${qty}\n`;

    selectedExplosives.forEach(exp => {
      const v = data[exp]?.[mat]?.[obj];
      if (v) {
        out += `• ${exp}: ${v.count * qty} (Сера: ${v.sulfur * qty})\n`;
        total += v.sulfur * qty;
      } else {
        out += `• ${exp}: Невозможно\n`;
      }
    });
    out += '\n';
  });

  if (!any) {
    alert("Выберите объекты");
    return;
  }

  out += `Общее количество серы: ${total}`;
  document.getElementById('result').innerText = out;
  showStep(3);
}

/* === ДАННЫЕ ВЗРЫВЧАТКИ (ПОЛНОСТЬЮ ПО ТВОИМ ЦИФРАМ) === */
const data = { /* ← блок данных из предыдущего сообщения,
                    он большой и уже проверенный.
                    ВСТАВЬ ЕГО ЗДЕСЬ БЕЗ ИЗМЕНЕНИЙ */ };
