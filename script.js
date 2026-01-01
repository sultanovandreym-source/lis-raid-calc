let step = 0;
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

function prevStep(n) { showStep(n); }

// Выбор взрывчатки
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExplosives.includes(v) ? selectedExplosives = selectedExplosives.filter(x => x!==v) : selectedExplosives.push(v);
  }
});

// Выбор материалов
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMaterials.includes(v) ? selectedMaterials = selectedMaterials.filter(x => x!==v) : selectedMaterials.push(v);
  }
});

// ===== Объекты по материалу =====
const objectsByMaterial = {
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','shotgun_turret','trade_bot','em_turret','rocket_launcher']
};

const objectNames = {
  door:'Дверь',
  wall:'Стена',
  foundation:'Фундамент',
  ladder:'Складная лестница',
  grate:'Решетка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Установка с автоматической винтовкой',
  shotgun_turret:'Автоматическая установка для картечи',
  trade_bot:'Торговый бот',
  em_turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная пусковая установка'
};

// ===== Загрузка объектов 3 вкладка =====
function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedObjects = {};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key = `${mat}_${obj}`;
      if(objectsDiv.querySelector(`[data-obj='${key}']`)) return;

      const div = document.createElement('div');
      div.className = 'object-row';
      div.dataset.obj = key;

      let imgSrc = mat === 'objects' ? `img/objects_${obj}.png` : `img/${mat}_${obj}.png`;

      div.innerHTML = `
        <img src="${imgSrc}" alt="${objectNames[obj]}">
        <span>${objectNames[obj]}</span>
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

function changeObjectCount(key, val) {
  selectedObjects[key] = Math.max(0,(selectedObjects[key]||0)+val);
  document.getElementById(`count-${key}`).innerText = selectedObjects[key];
}

// ===== Данные взрывчатки =====
const data = {
  bobovka: { wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}} },
  dynamite: { /* данные */ },
  c4: { /* данные */ },
  hexogen: { /* данные */ },
  rocket: { /* данные */ }
};

// ===== Расчет =====
function calculate(){
  let result='';
  let totalSulfur=0;
  Object.keys(selectedObjects).forEach(key=>{
    const qty = selectedObjects[key];
    if(qty===0) return; 
    const [mat,obj]=key.split('_');
    result+=`Объект: ${objectNames[obj]} (${mat})\nКоличество: ${qty}\n`;
    selectedExplosives.forEach(exp=>{
      let val=null;
      if(data[exp] && data[exp][mat] && data[exp][mat][obj]){
        val=data[exp][mat][obj];
      }
      let c,s;
      if(!val){c='Невозможно'; s='—';}
      else{c=val.count*qty; s=val.sulfur*qty; totalSulfur+=s;}
      result+=`• ${exp}: ${c} (Сера: ${s})\n`;
    });
    result+='\n';
  });
  result+=`Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = result;
  showStep(3);
}
