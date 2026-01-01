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

// ===== Выбор взрывчатки =====
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick=()=>{
    if(el.classList.contains('empty')) return;
    el.classList.toggle('active');
    const v=el.dataset.exp;
    selectedExplosives.includes(v)?selectedExplosives=selectedExplosives.filter(x=>x!==v):selectedExplosives.push(v);
  }
});

// ===== Выбор материалов =====
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.mat;
    selectedMaterials.includes(v)?selectedMaterials=selectedMaterials.filter(x=>x!==v):selectedMaterials.push(v);
  }
});

// ===== Объекты по материалу =====
const objectsByMaterial = {
  wood:['Дверь','Стена','Фундамент'],
  stone:['Дверь','Стена','Фундамент'],
  metal:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  steel:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  titan:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  objects:['Устройство отслеживания стрельбы','Установка с автоматической винтовкой','Автоматическая установка для картечи','Торговый бот','Электромагнитная турель','Ракетная пусковая установка']
};

function loadObjects() {
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(o=>{
      const key = `${mat}_${o}`;
      if(objectsDiv.querySelector(`[data-obj='${key}']`)) return;
      const div = document.createElement('div');
      div.className = 'object-row';
      div.dataset.obj = key;
      div.innerHTML = `<span>${mat} ${o}</span>
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

function changeObjectCount(obj, v) {
  selectedObjects[obj] = Math.max(0, (selectedObjects[obj] || 0) + v);
  document.getElementById(`count-${obj}`).innerText = selectedObjects[obj];
}

// ===== Данные взрывчатки =====
const data = {
  bobovka: { wood:{'Дверь':{count:2,sulfur:240},'Стена':{count:4,sulfur:480},'Фундамент':{count:15,sulfur:1800}} },
  dynamite: { wood:{'Дверь':{count:1,sulfur:500},'Стена':{count:2,sulfur:1000},'Фундамент':{count:8,sulfur:4000}} },
  c4: { wood:{'Дверь':{count:1,sulfur:1500},'Стена':{count:2,sulfur:3000},'Фундамент':{count:5,sulfur:7500}} },
  hexogen: { wood:{'Дверь':{count:1,sulfur:2500},'Стена':{count:1,sulfur:2500},'Фундамент':{count:2,sulfur:5000}} },
  rocket: { wood:{'Дверь':{count:1,sulfur:1500},'Стена':{count:2,sulfur:3000},'Фундамент':{count:5,sulfur:7500}} }
};

// ===== Расчет =====
function calculate() {
  let result='';
  let totalSulfur=0;
  Object.keys(selectedObjects).forEach(key=>{
    const qty=selectedObjects[key];
    if(qty===0) return; 
    const [mat,obj]=key.split('_');
    result+=`Объект: ${obj} (${mat})\nКоличество: ${qty}\n`;
    selectedExplosives.forEach(exp=>{
      let val=null;
      if(data[exp] && data[exp][mat] && data[exp][mat][obj]){
        val=data[exp][mat][obj];
      }
      let c,s;
      if(!val){c='Невозможно'; s='—';}
      else{c=val.count*qty; s=val.sulfur*qty; totalSulfur+=s;}
      result+=`• ${exp}: ${c} (Сера: ${s})\n`;
    })
    result+='\n';
  })
  result+=`Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=result;
  showStep(3);
}
