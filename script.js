let step = 0;
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep() {
  steps.forEach(s => s.classList.remove('active'));
  steps[step].classList.add('active');
}
function next() {
  step++;
  if (step === 2) loadObjects();
  showStep();
}
function prev() {
  step--;
  showStep();
}

// ---------- выбор взрывчатки ----------
document.querySelectorAll('.exp').forEach(el => {
  el.onclick = () => toggle(el, selectedExplosives, el.dataset.exp);
});

// ---------- выбор материалов ----------
document.querySelectorAll('.mat').forEach(el => {
  el.onclick = () => toggle(el, selectedMaterials, el.dataset.mat);
});

function toggle(el, arr, val) {
  el.classList.toggle('active');
  arr.includes(val) ? arr.splice(arr.indexOf(val), 1) : arr.push(val);
}

// ---------- объекты ----------
const objectsByMaterial = {
  wood: [
    { id: 'door', name: 'Деревянная дверь' },
    { id: 'wall', name: 'Деревянная стена' },
    { id: 'foundation', name: 'Деревянный фундамент' }
  ],
  stone: [
    { id: 'door', name: 'Каменная дверь' },
    { id: 'wall', name: 'Каменная стена' },
    { id: 'foundation', name: 'Каменный фундамент' }
  ],
  metal: [
    { id: 'door', name: 'Железная дверь' },
    { id: 'wall', name: 'Железная стена' },
    { id: 'foundation', name: 'Железный фундамент' }
  ],
  steel: [
    { id: 'door', name: 'Стальная дверь' },
    { id: 'wall', name: 'Стальная стена' },
    { id: 'foundation', name: 'Стальной фундамент' }
  ],
  titan: [
    { id: 'door', name: 'Титановая дверь' },
    { id: 'wall', name: 'Титановая стена' },
    { id: 'foundation', name: 'Титановый фундамент' }
  ],
  objects: [
    { id: 'turret', name: 'Турель' },
    { id: 'shotgun_trap', name: 'Картечница' },
    { id: 'rocket_launcher', name: 'Ракетная установка' }
  ]
};

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat]?.forEach(o => {
      const key = `${mat}_${o.id}`;
      selectedObjects[key] = 0;

      objectsDiv.innerHTML += `
        <div class="card">
          <img src="images/${key}.png">
          <span>${o.name}</span>
          <div class="counter">
            <button onclick="change('${key}',-1)">-</button>
            <span id="${key}">0</span>
            <button onclick="change('${key}',1)">+</button>
          </div>
        </div>
      `;
    });
  });
}

function change(key, v) {
  selectedObjects[key] = Math.max(0, selectedObjects[key] + v);
  document.getElementById(key).innerText = selectedObjects[key];
}

// ---------- данные взрывчатки ----------
const data = {
  bobovka: {
    wood: { door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800} },
    metal:{ door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000} }
  },
  dynamite: {
    wood: { door:{count:1,sulfur:500}, wall:{count:2,sulfur:1000} },
    metal:{ door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500} }
  },
  c4: {
    wood:{ door:{count:1,sulfur:1500} },
    metal:{ door:{count:2,sulfur:3000} }
  },
  hexogen: {
    wood:{ door:{count:1,sulfur:2500} },
    metal:{ door:{count:1,sulfur:2500} }
  },
  rocket: {
    wood:{ door:{count:1,sulfur:1500} },
    metal:{ door:{count:2,sulfur:3000} }
  }
};

// ---------- расчёт ----------
function calculate() {
  let out = '';
  let total = 0;

  for (let key in selectedObjects) {
    const qty = selectedObjects[key];
    if (!qty) continue;

    const [mat, obj] = key.split('_');
    out += `${key} x${qty}\n`;

    selectedExplosives.forEach(exp => {
      const v = data[exp]?.[mat]?.[obj];
      if (v) {
        out += `  ${exp}: ${v.count * qty}\n`;
        total += v.sulfur * qty;
      }
    });
    out += '\n';
  }

  out += `Всего серы: ${total}`;
  document.getElementById('result').innerText = out;
  step = 3;
  showStep();
}

showStep();
