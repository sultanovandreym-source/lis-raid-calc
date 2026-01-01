let step = 0;
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

// ===== Переходы =====
function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}
function nextStep(n) {
  if (n === 2) loadObjects();
  showStep(n);
}
function prevStep(n) { showStep(n); }

// ===== Выбор взрывчатки =====
document.querySelectorAll('.exp').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives = selectedExplosives.filter(x => x !== v)
      : selectedExplosives.push(v);
  };
});

// ===== Выбор материалов =====
document.querySelectorAll('.mat').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials = selectedMaterials.filter(x => x !== v)
      : selectedMaterials.push(v);
  };
});

// ===== Объекты =====
const objectsByMaterial = {
  wood: ['door','wall','foundation'],
  stone: ['door','wall','foundation'],
  metal: ['door','wall','foundation','ladder','grate'],
  steel: ['door','wall','foundation','ladder','grate'],
  titan: ['door','wall','foundation','ladder','grate'],
  objects: ['tracking_device','auto_rifle','auto_shotgun','trading_bot','turret','rocket_launcher']
};

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};
  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(obj => {
      const key = `${mat}_${obj}`;
      const div = document.createElement('div');
      div.className = 'object-row';
      div.dataset.obj = key;
      div.innerHTML = `
        <div style="display:flex;align-items:center;">
          <img src="img/${key}.png" alt="${obj}">
          <span style="margin-left:10px">${mat} ${obj}</span>
        </div>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(div);
      selectedObjects[key] = 0;
    });
  });
}

function changeObjectCount(obj,v){
  selectedObjects[obj] = Math.max(0,(selectedObjects[obj]||0)+v);
  document.getElementById(`count-${obj}`).innerText = selectedObjects[obj];
}

// ===== Данные взрывчатки =====
const data = {
  bobovka:{wood:{door:{count:2,sulfur:240},wall:{count:4,sulfur:480},foundation:{count:15,sulfur:1800}}, stone:{door:{count:3,sulfur:360},wall:{count:10,sulfur:1200},foundation:{count:40,sulfur:4800}}, metal:{door:{count:30,sulfur:3600},wall:{count:100,sulfur:12000},foundation:{count:400,sulfur:48000},ladder:{count:46,sulfur:5520},grate:null}, steel:{door:{count:200,sulfur:24000},wall:{count:667,sulfur:80040},foundation:{count:2667,sulfur:320040},ladder:{count:275,sulfur:33000},grate:null}, titan:{door:{count:800,sulfur:96000},wall:{count:2667,sulfur:320040},foundation:null,ladder:{count:1112,sulfur:133440},grate:null}, objects:{tracking_device:{count:50,sulfur:6000},auto_rifle:{count:50,sulfur:6000},auto_shotgun:{count:50,sulfur:6000},trading_bot:{count:668,sulfur:80160},turret:{count:50,sulfur:6000},rocket_launcher:{count:50,sulfur:6000}}},
  dynamite:{wood:{door:{count:1,sulfur:500},wall:{count:2,sulfur:1000},foundation:{count:8,sulfur:4000}}, stone:{door:{count:2,sulfur:1000},wall:{count:5,sulfur:2500},foundation:{count:20,sulfur:10000}}, metal:{door:{count:4,sulfur:2000},wall:{count:13,sulfur:6500},foundation:{count:50,sulfur:25000},ladder:{count:7,sulfur:3500},grate:null}, steel:{door:{count:20,sulfur:10000},wall:{count:67,sulfur:33500},foundation:{count:267,sulfur:133500},ladder:{count:28,sulfur:14000},grate:null}, titan:{door:{count:80,sulfur:40000},wall:{count:200,sulfur:100000},foundation:{count:800,sulfur:800000},ladder:{count:112,sulfur:56000},grate:null}, objects:{tracking_device:{count:7,sulfur:3500},auto_rifle:{count:7,sulfur:3500},auto_shotgun:{count:7,sulfur:3500},trading_bot:{count:68,sulfur:34000},turret:{count:7,sulfur:3500},rocket_launcher:{count:7,sulfur:3500}}}
};

// ===== Расчет =====
function calculate() {
  let result='';
  let totalSulfur=0;
  Object.keys(selectedObjects).forEach(key=>{
    const qty = selectedObjects[key];
    if(qty === 0) return;
    const [mat,obj] = key.split('_');
    result += `Объект: ${obj} (${mat})\nКоличество: ${qty}\n`;
    selectedExplosives.forEach(exp => {
      let val = data[exp]?.[mat]?.[obj] || null;
      let c, s;
      if(!val){c='Невозможно'; s='—';}
      else{c = val.count*qty; s = val.sulfur*qty; totalSulfur += s;}
      result += `• ${exp}: ${c} (Сера: ${s})\n`;
    });
    result += '\n';
  });
  result += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = result;
  showStep(3);
}
